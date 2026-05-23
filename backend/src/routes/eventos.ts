import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET /api/eventos: Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { fechaInicio: 'asc' },
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// POST /api/eventos: Crear un nuevo evento
router.post('/', async (req, res) => {
  try {
    const { titulo, tipo, estado, fechaInicio, fechaFin, direccion, lat, lng } = req.body;
    const nuevoEvento = await prisma.evento.create({
      data: {
        titulo,
        tipo,
        estado,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        direccion,
        lat,
        lng,
      },
    });
    res.json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

export default router;
