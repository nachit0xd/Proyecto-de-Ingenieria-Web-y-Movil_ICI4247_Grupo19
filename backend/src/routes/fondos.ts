import { Router } from 'express';
import prisma from '../db';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// GET /api/fondos/convocatorias: Obtener todas las convocatorias
router.get('/convocatorias', async (req, res) => {
  try {
    const fondos = await prisma.fondo.findMany({
      orderBy: { creadoEn: 'desc' },
      include: {
        _count: { 
          select: { 
            postulaciones: {
              where: { estado: 'aprobado' }
            } 
          } 
        }
      }
    });
    
    const result = fondos.map(f => ({
      id: f.id,
      titulo: f.titulo,
      descripcion: f.descripcion,
      periodo: f.creadoEn.getFullYear().toString(),
      presupuesto: f.presupuesto,
      montoMaximo: f.montoMaximo,
      cupos: f.cupos,
      estado: f.estado,
      postulaciones: f._count.postulaciones
    }));
    
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Error al obtener convocatorias' });
  }
});

// GET /api/fondos/postulaciones: Obtener todas las postulaciones
router.get('/postulaciones', async (req, res) => {
  try {
    const postulaciones = await prisma.postulacion.findMany({
      orderBy: { fechaPostulacion: 'desc' },
      include: {
        fondo: { select: { titulo: true } }
      }
    });
    
    const result = postulaciones.map(p => ({
      id: p.id,
      fondoId: p.fondoId,
      fondoNombre: p.fondo.titulo,
      nombreRepresentante: p.nombreRepresentante,
      rutRepresentante: p.rutRepresentante,
      nombreOrganizacion: p.nombreOrganizacion,
      descripcion: p.descripcion,
      presupuestoEstimado: p.presupuestoEstimado,
      estado: p.estado,
      areaCultural: p.areaCultural,
      desglose: p.desglose,
      documentos: p.documentos,
      fechaPostulacion: p.fechaPostulacion
    }));
    
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
});

// POST /api/fondos/postular: Crear una nueva postulación
router.post('/postular', verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const nuevaPostulacion = await prisma.postulacion.create({
      data: {
        fondoId: data.fondoId,
        nombreRepresentante: data.nombreRepresentante,
        rutRepresentante: data.rutRepresentante,
        nombreOrganizacion: data.nombreOrganizacion,
        descripcion: data.descripcion,
        presupuestoEstimado: data.presupuestoEstimado,
        areaCultural: data.areaCultural,
        desglose: data.desglose,
        documentos: data.documentos,
        estado: 'pendiente'
      },
    });
    res.json(nuevaPostulacion);
  } catch {
    res.status(500).json({ error: 'Error al crear postulación' });
  }
});

// PATCH /api/fondos/postulaciones/:id/estado: Actualizar el estado de una postulación
router.patch('/postulaciones/:id/estado', verifyToken, requireRole(['gestor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const postulacion = await prisma.postulacion.update({
      where: { id: id as string },
      data: { estado },
    });
    res.json(postulacion);
  } catch {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// POST /api/fondos/convocatoria: Crear un nuevo fondo (Gestor)
router.post('/convocatoria', verifyToken, requireRole(['gestor']), async (req, res) => {
  try {
    const { titulo, descripcion, montoMaximo, presupuesto, cupos, estado } = req.body;
    const nuevoFondo = await prisma.fondo.create({
      data: { titulo, descripcion, montoMaximo, presupuesto, cupos, estado }
    });
    res.json(nuevoFondo);
  } catch {
    res.status(500).json({ error: 'Error al crear fondo' });
  }
});

// PUT /api/fondos/convocatoria/:id: Editar un fondo existente (Gestor)
router.put('/convocatoria/:id', verifyToken, requireRole(['gestor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, montoMaximo, presupuesto, cupos, estado } = req.body;
    const fondoActualizado = await prisma.fondo.update({
      where: { id: id as string },
      data: { titulo, descripcion, montoMaximo, presupuesto, cupos, estado }
    });
    res.json(fondoActualizado);
  } catch {
    res.status(500).json({ error: 'Error al actualizar fondo' });
  }
});

// DELETE /api/fondos/convocatoria/:id: Eliminar un fondo (Gestor)
router.delete('/convocatoria/:id', verifyToken, requireRole(['gestor']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.fondo.delete({ where: { id: id as string } });
    res.json({ message: 'Fondo eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar fondo' });
  }
});

export default router;
