import { Router } from 'express';
import prisma from '../db';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/kpis', verifyToken, requireRole(['gestor']), async (req, res) => {
  try {
    const [postulacionesPendientes, propuestasPorModerar, fichasActivas] = await Promise.all([
      prisma.postulacion.count({ where: { estado: 'pendiente' } }),
      prisma.propuesta.count({ where: { estado: 'revision' } }),
      prisma.ficha.count({ where: { estado: 'publicado' } })
    ]);

    // Calcular eventosSemana (eventos de esta semana)
    const startOfWeek = new Date();
    startOfWeek.setHours(0,0,0,0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    const eventosSemana = await prisma.evento.count({
      where: {
        fechaInicio: {
          gte: startOfWeek,
          lte: endOfWeek
        }
      }
    });

    res.json({
      postulacionesPendientes,
      propuestasPorModerar,
      fichasActivas,
      eventosSemana
    });
  } catch (error) {
    console.error('Error fetching dashboard KPIs:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/actividad', verifyToken, requireRole(['gestor']), async (req, res) => {
  try {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7); 

    // Obtener Postulaciones recientes
    const postulaciones = await prisma.postulacion.findMany({
      where: { fechaPostulacion: { gte: dateLimit } },
      include: { fondo: true },
      orderBy: { fechaPostulacion: 'desc' },
      take: 10
    });

    // Obtener Propuestas recientes
    const propuestas = await prisma.propuesta.findMany({
      where: { fechaCreacion: { gte: dateLimit } },
      include: { usuario: true },
      orderBy: { fechaCreacion: 'desc' },
      take: 10
    });

    // Transformar a formato ActividadReciente
    const actividadPostulaciones = postulaciones.map(p => ({
      id: `post_${p.id}`,
      fecha: p.fechaPostulacion,
      usuario: p.nombreRepresentante,
      accion: 'Postulación',
      titulo: p.fondo.titulo,
      estado: p.estado
    }));

    const actividadPropuestas = propuestas.map(p => ({
      id: `prop_${p.id}`,
      fecha: p.fechaCreacion,
      usuario: p.usuario.nombre,
      accion: 'Propuesta',
      titulo: p.titulo,
      estado: p.estado
    }));

    // Mezclar y ordenar por fecha descendente y tomar las 10 más recientes
    const actividad = [...actividadPostulaciones, ...actividadPropuestas]
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      .slice(0, 10);

    res.json(actividad);
  } catch (error) {
    console.error('Error fetching dashboard actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/ciudadano/:id', verifyToken, requireRole(['gestor']), async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      fichasPublicadas,
      fichasMes,
      propuestasActivas,
      propuestasMes,
      eventosRealizados,
      eventosMes,
      sumPostulaciones,
      postulacionesAprobadas
    ] = await Promise.all([
      prisma.ficha.count({ where: { estado: 'publicado' } }),
      prisma.ficha.count({
        where: {
          estado: 'publicado',
          fechaCreacion: { gte: startOfMonth }
        }
      }),
      prisma.propuesta.count({ where: { estado: 'revision' } }),
      prisma.propuesta.count({
        where: {
          fechaCreacion: { gte: startOfMonth }
        }
      }),
      prisma.evento.count({ where: { estado: 'finalizado' } }),
      prisma.evento.count({
        where: {
          estado: 'finalizado',
          fechaInicio: { gte: startOfMonth }
        }
      }),
      prisma.postulacion.aggregate({
        where: { estado: 'aprobado' },
        _sum: { presupuestoEstimado: true }
      }),
      prisma.postulacion.count({ where: { estado: 'aprobado' } })
    ]);

    const monto = sumPostulaciones._sum.presupuestoEstimado || 0;

    let fondosAdjudicados = `$${(monto / 1000000).toFixed(1)}M`;
    if (monto < 1000000) {
      if (monto >= 1000) {
        fondosAdjudicados = `$${(monto / 1000).toFixed(0)}K`;
      } else {
        fondosAdjudicados = `$${monto}`;
      }
    }

    res.json({
      fichasPublicadas,
      crecimientoFichas: `+${fichasMes} este mes`,
      fondosAdjudicados,
      crecimientoFondos: `+${postulacionesAprobadas} iniciativas`,
      propuestasActivas,
      votosTotales: `+${propuestasMes} este mes`,
      eventosRealizados,
      crecimientoEventos: `+${eventosMes} este mes`
    });
  } catch (error) {
    console.error('Error fetching dashboard ciudadano:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
