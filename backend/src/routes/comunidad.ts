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

// POST /api/comunidad/votar/:id (Protected): Incrementar votos de una propuesta
router.post('/votar/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id as string;
    const propuesta = await prisma.propuesta.update({
      where: { id },
      data: { votosTotales: { increment: 1 } },
    });
    res.json(propuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el voto' });
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
