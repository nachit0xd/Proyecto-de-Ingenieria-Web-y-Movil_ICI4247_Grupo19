import { Router } from 'express';
import prisma from '../db';
import { verifyToken } from '../middleware/auth';

const router = Router();

// GET /api/eventos: Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { fechaInicio: 'asc' },
    });
    res.json(eventos);
  } catch {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// POST /api/eventos: Crear un nuevo evento (Gestor)
router.post('/', verifyToken, async (req, res) => {
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
  } catch {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// PUT /api/eventos/:id: Editar un evento
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, tipo, estado, fechaInicio, fechaFin, direccion, lat, lng } = req.body;
    const eventoActualizado = await prisma.evento.update({
      where: { id: id as string },
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
    res.json(eventoActualizado);
  } catch {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

// DELETE /api/eventos/:id: Eliminar evento
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.evento.delete({ where: { id: id as string } });
    res.json({ message: 'Evento eliminado' });
  } catch {
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

export default router;
