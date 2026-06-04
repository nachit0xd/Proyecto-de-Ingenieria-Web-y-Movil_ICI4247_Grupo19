import { Router } from 'express';
import prisma from '../db';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Obtener KPIs para el Gestor
router.get('/kpis-gestor', verifyToken, async (req, res) => {
  try {
    const totalPostulaciones = await prisma.postulacion.count();
    const aprobadas = await prisma.postulacion.count({ where: { estado: 'aprobado' } });
    const tasaAprobacion = totalPostulaciones > 0 ? Math.round((aprobadas / totalPostulaciones) * 100) : 0;

    const votosPropuestas = await prisma.votoPropuesta.count();
    const valoracionesFichas = await prisma.valoracionFicha.count();
    const participacion = votosPropuestas + valoracionesFichas;

    // Calcular ejecución presupuestaria
    const fondos = await prisma.fondo.findMany();
    let totalPresupuesto = 0;
    fondos.forEach(f => totalPresupuesto += f.presupuesto);

    const postulacionesAprobadas = await prisma.postulacion.findMany({ where: { estado: 'aprobado' } });
    let totalAsignado = 0;
    postulacionesAprobadas.forEach(p => totalAsignado += p.presupuestoEstimado);

    const ejecucion = totalPresupuesto > 0 ? Math.round((totalAsignado / totalPresupuesto) * 100) : 0;

    res.json({
      ejecucionPresupuestaria: `${ejecucion}%`,
      ejecucionMeta: `Meta: 90% (Asignado: $${totalAsignado.toLocaleString('es-CL')})`,
      tasaAprobacion: `${tasaAprobacion}%`,
      tasaAprobacionMeta: `Meta: 70%`,
      tiempoRespuesta: `5 días`,
      tiempoRespuestaMeta: `Meta: < 7 días`,
      participacionCiudadana: `+${participacion}`,
      participacionMeta: `Votos y valoraciones`
    });
  } catch {
    res.status(500).json({ error: 'Error obteniendo KPIs gestor' });
  }
});

// Obtener KPIs para Ciudadano
router.get('/kpis-ciudadano', async (req, res) => {
  try {
    const fichasPublicadas = await prisma.ficha.count({ where: { estado: 'publicado' } });
    
    const postulacionesAprobadas = await prisma.postulacion.findMany({ where: { estado: 'aprobado' } });
    let totalAsignado = 0;
    postulacionesAprobadas.forEach(p => totalAsignado += p.presupuestoEstimado);

    const propuestasActivas = await prisma.propuesta.count({ where: { estado: 'revision' } });
    const eventosRealizados = await prisma.evento.count();

    res.json({
      fichasPublicadas: fichasPublicadas.toString(),
      crecimientoFichas: 'Catálogo de patrimonio vivo',
      fondosAdjudicados: `$${totalAsignado.toLocaleString('es-CL')}`,
      crecimientoFondos: 'Entregados a la comunidad',
      propuestasActivas: propuestasActivas.toString(),
      votosTotales: 'En debate ciudadano',
      eventosRealizados: eventosRealizados.toString(),
      crecimientoEventos: 'Eventos y ferias'
    });
  } catch {
    res.status(500).json({ error: 'Error obteniendo KPIs ciudadano' });
  }
});

// Obtener publicaciones (Público)
router.get('/publicaciones', async (req, res) => {
  try {
    const publicaciones = await prisma.publicacionTransparencia.findMany({
      orderBy: { fecha: 'desc' }
    });
    res.json(publicaciones.map(p => ({
      id: p.id,
      mensaje: p.mensaje,
      tipo: p.tipo,
      visible: p.visible,
      fecha: p.fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' })
    })));
  } catch {
    res.status(500).json({ error: 'Error obteniendo publicaciones' });
  }
});

// Crear publicación
router.post('/publicaciones', verifyToken, async (req, res) => {
  try {
    const { mensaje, tipo } = req.body;
    const pub = await prisma.publicacionTransparencia.create({
      data: { mensaje, tipo: tipo || 'General', visible: true }
    });
    res.json(pub);
  } catch {
    res.status(500).json({ error: 'Error creando publicacion' });
  }
});

// Actualizar visibilidad publicación
router.patch('/publicaciones/:id/visibilidad', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { visible } = req.body;
    const pub = await prisma.publicacionTransparencia.update({
      where: { id: id as string },
      data: { visible }
    });
    res.json(pub);
  } catch {
    res.status(500).json({ error: 'Error actualizando publicacion' });
  }
});

// Obtener Gráficos para el Gestor
router.get('/graficos-gestor', verifyToken, async (req, res) => {
  try {
    const postulaciones = await prisma.postulacion.findMany({
      select: { fechaPostulacion: true, estado: true, areaCultural: true, presupuestoEstimado: true }
    });

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Data para gráfico de barras y líneas
    const postPorMes = new Map<string, { mes: string; postulaciones: number; aprobaciones: number }>();
    meses.forEach(m => postPorMes.set(m, { mes: m, postulaciones: 0, aprobaciones: 0 }));

    // Data para gráfico de pastel
    const presPorArea = new Map<string, number>();

    postulaciones.forEach(p => {
      const mesStr = meses[p.fechaPostulacion.getMonth()];
      const item = postPorMes.get(mesStr);
      if (item) {
        item.postulaciones++;
        if (p.estado === 'aprobado') {
          item.aprobaciones++;
        }
      }

      if (p.estado === 'aprobado') {
        const area = p.areaCultural || 'General';
        const current = presPorArea.get(area) || 0;
        presPorArea.set(area, current + p.presupuestoEstimado);
      }
    });

    res.json({
      postulacionesPorMes: Array.from(postPorMes.values()),
      presupuestoPorArea: Array.from(presPorArea.entries()).map(([area, presupuesto]) => ({ area, presupuesto }))
    });
  } catch {
    res.status(500).json({ error: 'Error obteniendo gráficos gestor' });
  }
});

// Obtener Gráficos para el Ciudadano
router.get('/graficos-ciudadano', async (req, res) => {
  try {
    const postulaciones = await prisma.postulacion.findMany({
      select: { fechaPostulacion: true, areaCultural: true }
    });

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Data para gráfico de barras
    const postPorMes = new Map<string, { mes: string; cantidad: number }>();
    meses.forEach(m => postPorMes.set(m, { mes: m, cantidad: 0 }));

    // Data para gráfico de pastel
    const distCat = new Map<string, number>();

    postulaciones.forEach(p => {
      const mesStr = meses[p.fechaPostulacion.getMonth()];
      const item = postPorMes.get(mesStr);
      if (item) {
        item.cantidad++;
      }

      const area = p.areaCultural || 'General';
      const current = distCat.get(area) || 0;
      distCat.set(area, current + 1);
    });

    res.json({
      postulacionesPorMes: Array.from(postPorMes.values()),
      distribucionCategorias: Array.from(distCat.entries()).map(([name, value]) => ({ name, value }))
    });
  } catch {
    res.status(500).json({ error: 'Error obteniendo gráficos ciudadano' });
  }
});

export default router;
