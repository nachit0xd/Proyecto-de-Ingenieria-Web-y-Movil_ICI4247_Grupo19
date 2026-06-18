import { Router, Request, Response } from 'express';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import prisma from '../db';

const router = Router();

// Obtener todas las fichas
router.get('/', async (req: Request, res: Response) => {
  try {
    const fichas = await prisma.ficha.findMany({
      orderBy: { fechaCreacion: 'desc' }
    });
    res.json(fichas);
  } catch (error) {
    console.error('Error al obtener fichas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva ficha (Solo administradores/gestores)
router.post('/', verifyToken, requireRole(['gestor']), async (req: Request, res: Response) => {
  try {
    const { nombre, descripcion, categoria, estado, ubicacion, multimediaUrl } = req.body;
    
    // Validación básica
    if (!nombre || !descripcion || !categoria || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevaFicha = await prisma.ficha.create({
      data: {
        nombre,
        descripcion,
        categoria,
        estado,
        ubicacion: ubicacion ? JSON.stringify(ubicacion) : null,
        multimediaUrl: multimediaUrl ? JSON.stringify(multimediaUrl) : null
      }
    });

    res.status(201).json(nuevaFicha);
  } catch (error) {
    console.error('Error al crear ficha:', error);
    res.status(500).json({ error: 'Error al crear la ficha' });
  }
});

// Actualizar una ficha existente
router.put('/:id', verifyToken, requireRole(['gestor']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria, estado, ubicacion, multimediaUrl } = req.body;

    const fichaActualizada = await prisma.ficha.update({
      where: { id: id as string },
      data: {
        nombre,
        descripcion,
        categoria,
        estado,
        ubicacion: ubicacion ? JSON.stringify(ubicacion) : null,
        multimediaUrl: multimediaUrl ? JSON.stringify(multimediaUrl) : null
      }
    });

    res.json(fichaActualizada);
  } catch (error) {
    console.error('Error al actualizar ficha:', error);
    res.status(500).json({ error: 'Error al actualizar la ficha' });
  }
});

// Cambiar el estado de una ficha (visible/oculto)
router.patch('/:id/estado', verifyToken, requireRole(['gestor']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ error: 'Debe proveer un nuevo estado' });
    }

    const fichaActualizada = await prisma.ficha.update({
      where: { id: id as string },
      data: { estado }
    });

    res.json(fichaActualizada);
  } catch (error) {
    console.error('Error al cambiar estado de ficha:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});

// Eliminar una ficha
router.delete('/:id', verifyToken, requireRole(['gestor']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.ficha.delete({
      where: { id: id as string }
    });

    res.json({ message: 'Ficha eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar ficha:', error);
    res.status(500).json({ error: 'Error al eliminar la ficha' });
  }
});

// Valorar una ficha
router.post('/:id/valoracion', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const fichaId = req.params.id as string;
    const { valoracion } = req.body;
    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!valoracion || valoracion < 1 || valoracion > 5) {
      return res.status(400).json({ error: 'La valoración debe estar entre 1 y 5' });
    }

    // Si ya votó, se actualiza la valoración, si no, se crea una nueva
    await prisma.valoracionFicha.upsert({
      where: {
        usuarioId_fichaId: {
          usuarioId,
          fichaId
        }
      },
      update: { valoracion },
      create: {
        usuarioId,
        fichaId,
        valoracion
      }
    });

    // Recalcular promedio
    const agregacion = await prisma.valoracionFicha.aggregate({
      where: { fichaId: fichaId },
      _avg: { valoracion: true },
      _count: { valoracion: true }
    });

    const nuevoPromedio = (agregacion._avg?.valoracion as number) || 0;
    const countData = agregacion._count as any;
    const total = countData?.valoracion || 0;

    // Actualizar ficha
    const fichaActualizada = await prisma.ficha.update({
      where: { id: fichaId },
      data: {
        valoracionPromedio: nuevoPromedio,
        totalValoraciones: total
      }
    });

    res.json({ message: 'Valoración registrada exitosamente', ficha: fichaActualizada });
  } catch (error) {
    console.error('Error al valorar ficha:', error);
    res.status(500).json({ error: 'Error interno al procesar la valoración' });
  }
});

export default router;
