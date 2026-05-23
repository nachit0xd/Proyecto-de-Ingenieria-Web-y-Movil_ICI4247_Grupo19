import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET /api/fondos/convocatorias: Obtener todas las convocatorias
router.get('/convocatorias', async (req, res) => {
  try {
    const fondos = await prisma.fondo.findMany({
      orderBy: { creadoEn: 'desc' },
    });
    res.json(fondos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener convocatorias' });
  }
});

// GET /api/fondos/postulaciones: Obtener todas las postulaciones
router.get('/postulaciones', async (req, res) => {
  try {
    const postulaciones = await prisma.postulacion.findMany({
      orderBy: { fechaPostulacion: 'desc' },
    });
    res.json(postulaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener postulaciones' });
  }
});

// POST /api/fondos/postular: Crear una nueva postulación
router.post('/postular', async (req, res) => {
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
        estado: 'pendiente'
      },
    });
    res.json(nuevaPostulacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear postulación' });
  }
});

// PATCH /api/fondos/postulaciones/:id/estado: Actualizar el estado de una postulación
router.patch('/postulaciones/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const postulacion = await prisma.postulacion.update({
      where: { id },
      data: { estado },
    });
    res.json(postulacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

export default router;
