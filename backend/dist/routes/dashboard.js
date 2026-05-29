"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/kpis', async (req, res) => {
    try {
        const [postulacionesPendientes, propuestasPorModerar, fichasActivas] = await Promise.all([
            db_1.default.postulacion.count({ where: { estado: 'pendiente' } }),
            db_1.default.propuesta.count({ where: { estado: 'revision' } }),
            db_1.default.ficha.count({ where: { estado: 'publicado' } })
        ]);
        // Calcular eventosSemana (eventos de esta semana)
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Domingo inicio
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        const eventosSemana = await db_1.default.evento.count({
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
    }
    catch (error) {
        console.error('Error fetching dashboard KPIs:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.get('/actividad', async (req, res) => {
    try {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - 7); // Últimos 7 días
        // Obtener Postulaciones recientes
        const postulaciones = await db_1.default.postulacion.findMany({
            where: { fechaPostulacion: { gte: dateLimit } },
            include: { fondo: true },
            orderBy: { fechaPostulacion: 'desc' },
            take: 10
        });
        // Obtener Propuestas recientes
        const propuestas = await db_1.default.propuesta.findMany({
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
        // Mezclar, ordenar por fecha descendente y tomar las 10 más recientes
        const actividad = [...actividadPostulaciones, ...actividadPropuestas]
            .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
            .slice(0, 10);
        res.json(actividad);
    }
    catch (error) {
        console.error('Error fetching dashboard actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
router.get('/ciudadano', async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const [fichasPublicadas, fichasMes, propuestasActivas, propuestasMes, eventosRealizados, eventosMes, sumPostulaciones, postulacionesAprobadas] = await Promise.all([
            db_1.default.ficha.count({ where: { estado: 'publicado' } }),
            db_1.default.ficha.count({
                where: {
                    estado: 'publicado',
                    fechaCreacion: { gte: startOfMonth }
                }
            }),
            db_1.default.propuesta.count({ where: { estado: 'revision' } }),
            db_1.default.propuesta.count({
                where: {
                    fechaCreacion: { gte: startOfMonth }
                }
            }),
            db_1.default.evento.count({ where: { estado: 'finalizado' } }),
            db_1.default.evento.count({
                where: {
                    estado: 'finalizado',
                    fechaInicio: { gte: startOfMonth }
                }
            }),
            db_1.default.postulacion.aggregate({
                where: { estado: 'aprobado' },
                _sum: { presupuestoEstimado: true }
            }),
            db_1.default.postulacion.count({ where: { estado: 'aprobado' } })
        ]);
        const monto = sumPostulaciones._sum.presupuestoEstimado || 0;
        let fondosAdjudicados = `$${(monto / 1000000).toFixed(1)}M`;
        if (monto < 1000000) {
            if (monto >= 1000) {
                fondosAdjudicados = `$${(monto / 1000).toFixed(0)}K`;
            }
            else {
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
    }
    catch (error) {
        console.error('Error fetching dashboard ciudadano:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.default = router;
