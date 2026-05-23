import { Router } from 'express';
import prisma from '../db';

const router = Router();

// GET /api/transparencia/kpis: Obtener KPIs clave de transparencia
router.get('/kpis', async (req, res) => {
  try {
    // En un contexto real, estos KPIs se calcularían dinámicamente a partir de la base de datos (POR IMPLEMENTAR)
    const kpis = {
      ejecucionPresupuestaria: "85%",
      ejecucionMeta: "Meta: 90%",
      tasaAprobacion: "65%",
      tasaAprobacionMeta: "Meta: 70%",
      tiempoRespuesta: "12 días",
      tiempoRespuestaMeta: "Meta: < 15 días",
      participacionCiudadana: "+2,450",
      participacionMeta: "Votos este mes"
    };
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener KPIs' });
  }
});

export default router;
