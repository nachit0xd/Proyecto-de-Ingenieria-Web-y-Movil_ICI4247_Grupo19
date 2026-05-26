import { Router } from 'express';
import prisma from '../db';
import { verifyToken } from '../middleware/auth';

const router = Router();

// GET /api/comunidad/populares: Obtener las propuestas más votadas
router.get('/populares', async (req, res) => {
  try {
    const propuestas = await prisma.propuesta.findMany({
      orderBy: { votosTotales: 'desc' },
      take: 10,
    });
    res.json(propuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propuestas populares' });
  }
});

// GET /api/comunidad/todas: Obtener todas las propuestas
router.get('/todas', async (req, res) => {
  try {
    const propuestas = await prisma.propuesta.findMany({
      orderBy: { fechaCreacion: 'desc' },
    });
    res.json(propuestas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener propuestas' });
  }
});

// GET /api/comunidad/mis-votos: Obtener IDs de las propuestas que el usuario ha votado
router.get('/mis-votos', verifyToken, async (req, res) => {
  try {
    const idUsuario = (req as any).user?.id;
    if (!idUsuario) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    const votos = await prisma.votoPropuesta.findMany({
      where: { idUsuario },
      select: { idPropuesta: true }
    });
    res.json(votos.map((v: any) => v.idPropuesta));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mis votos' });
  }
});

// POST /api/comunidad/votar/:id (Protected): Incrementar votos de una propuesta
router.post('/votar/:id', verifyToken, async (req, res) => {
  try {
    const idPropuesta = req.params.id as string;
    const idUsuario = (req as any).user?.id;
    if (!idUsuario) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    
    // Verificar si ya votó
    const existe = await prisma.votoPropuesta.findUnique({
      where: { idUsuario_idPropuesta: { idUsuario, idPropuesta } }
    });
    
    if (existe) {
      res.status(400).json({ error: 'Ya has votado por esta propuesta' });
      return;
    }
    
    // Crear voto y actualizar contador en una transacción
    const result = await prisma.$transaction([
      prisma.votoPropuesta.create({
        data: { idUsuario, idPropuesta }
      }),
      prisma.propuesta.update({
        where: { id: idPropuesta },
        data: { votosTotales: { increment: 1 } },
      })
    ]);
    res.json(result[1]);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el voto' });
  }
});

// POST /api/comunidad/anular-voto/:id (Protected): Decrementar votos de una propuesta
router.post('/anular-voto/:id', verifyToken, async (req, res) => {
  try {
    const idPropuesta = req.params.id as string;
    const idUsuario = (req as any).user?.id;
    if (!idUsuario) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    
    // Verificar si ya votó
    const existe = await prisma.votoPropuesta.findUnique({
      where: { idUsuario_idPropuesta: { idUsuario, idPropuesta } }
    });
    
    if (!existe) {
      res.status(400).json({ error: 'No has votado por esta propuesta' });
      return;
    }
    
    // Eliminar voto y actualizar contador en una transacción
    const result = await prisma.$transaction([
      prisma.votoPropuesta.delete({
        where: { idUsuario_idPropuesta: { idUsuario, idPropuesta } }
      }),
      prisma.propuesta.update({
        where: { id: idPropuesta },
        data: { votosTotales: { decrement: 1 } },
      })
    ]);
    res.json(result[1]);
  } catch (error) {
    res.status(500).json({ error: 'Error al anular el voto' });
  }
});

// POST /api/comunidad/propuesta (Protected): Crear una propuesta ciudadana
router.post('/propuesta', verifyToken, async (req, res) => {
  try {
    const idUsuario = (req as any).user?.id;
    if (!idUsuario) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    
    const { titulo, descripcion } = req.body;
    
    const propuesta = await prisma.propuesta.create({
      data: {
        titulo,
        descripcion,
        estado: 'en_revision',
        idUsuario
      }
    });
    
    res.json(propuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la propuesta' });
  }
});

// PUT /api/comunidad/propuesta/:id (Protected): Actualizar una propuesta
router.put('/propuesta/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { titulo, descripcion, estado } = req.body;
    const propuesta = await prisma.propuesta.update({
      where: { id },
      data: { titulo, descripcion, estado },
    });
    res.json(propuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar propuesta' });
  }
});

// DELETE /api/comunidad/propuesta/:id (Protected): Eliminar una propuesta
router.delete('/propuesta/:id', verifyToken, async (req, res): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    // Check if exists
    const existing = await prisma.propuesta.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Propuesta no encontrada' });
      return;
    }

    await prisma.propuesta.delete({ where: { id } });
    res.json({ message: 'Propuesta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar propuesta' });
  }
});

export default router;
