"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Obtener KPIs para el Gestor
router.get('/kpis-gestor', auth_1.verifyToken, async (req, res) => {
    try {
        const totalPostulaciones = await db_1.default.postulacion.count();
        const aprobadas = await db_1.default.postulacion.count({ where: { estado: 'aprobado' } });
        const tasaAprobacion = totalPostulaciones > 0 ? Math.round((aprobadas / totalPostulaciones) * 100) : 0;
        const votosPropuestas = await db_1.default.votoPropuesta.count();
        const valoracionesFichas = await db_1.default.valoracionFicha.count();
        const participacion = votosPropuestas + valoracionesFichas;
        // Calcular ejecución presupuestaria
        const fondos = await db_1.default.fondo.findMany();
        let totalPresupuesto = 0;
        fondos.forEach(f => totalPresupuesto += f.presupuesto);
        const postulacionesAprobadas = await db_1.default.postulacion.findMany({ where: { estado: 'aprobado' } });
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
    }
    catch {
        res.status(500).json({ error: 'Error obteniendo KPIs gestor' });
    }
});
// Obtener KPIs para Ciudadano
router.get('/kpis-ciudadano', async (req, res) => {
    try {
        const fichasPublicadas = await db_1.default.ficha.count({ where: { estado: 'publicado' } });
        const postulacionesAprobadas = await db_1.default.postulacion.findMany({ where: { estado: 'aprobado' } });
        let totalAsignado = 0;
        postulacionesAprobadas.forEach(p => totalAsignado += p.presupuestoEstimado);
        const propuestasActivas = await db_1.default.propuesta.count({ where: { estado: 'revision' } });
        const eventosRealizados = await db_1.default.evento.count();
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
    }
    catch {
        res.status(500).json({ error: 'Error obteniendo KPIs ciudadano' });
    }
});
// Obtener publicaciones (Público)
router.get('/publicaciones', async (req, res) => {
    try {
        const publicaciones = await db_1.default.publicacionTransparencia.findMany({
            orderBy: { fecha: 'desc' }
        });
        res.json(publicaciones.map(p => ({
            id: p.id,
            mensaje: p.mensaje,
            tipo: p.tipo,
            visible: p.visible,
            fecha: p.fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' })
        })));
    }
    catch {
        res.status(500).json({ error: 'Error obteniendo publicaciones' });
    }
});
// Crear publicación
router.post('/publicaciones', auth_1.verifyToken, async (req, res) => {
    try {
        const { mensaje, tipo } = req.body;
        const pub = await db_1.default.publicacionTransparencia.create({
            data: { mensaje, tipo: tipo || 'General', visible: true }
        });
        res.json(pub);
    }
    catch {
        res.status(500).json({ error: 'Error creando publicacion' });
    }
});
// Actualizar visibilidad publicación
router.patch('/publicaciones/:id/visibilidad', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { visible } = req.body;
        const pub = await db_1.default.publicacionTransparencia.update({
            where: { id: id },
            data: { visible }
        });
        res.json(pub);
    }
    catch {
        res.status(500).json({ error: 'Error actualizando publicacion' });
    }
});
// Obtener gráficos para el Gestor
router.get('/graficos-gestor', auth_1.verifyToken, async (req, res) => {
    try {
        const postulaciones = await db_1.default.postulacion.findMany({
            select: { fechaPostulacion: true, estado: true, areaCultural: true, presupuestoEstimado: true }
        });
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        // Line chart data
        const postPorMes = new Map();
        meses.forEach(m => postPorMes.set(m, { mes: m, postulaciones: 0, aprobaciones: 0 }));
        // Bar chart data
        const presPorArea = new Map();
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
    }
    catch {
        res.status(500).json({ error: 'Error obteniendo gráficos gestor' });
    }
});
// Obtener gráficos para el Ciudadano
router.get('/graficos-ciudadano', async (req, res) => {
    try {
        const postulaciones = await db_1.default.postulacion.findMany({
            select: { fechaPostulacion: true, areaCultural: true }
        });
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        // Bar chart data
        const postPorMes = new Map();
        meses.forEach(m => postPorMes.set(m, { mes: m, cantidad: 0 }));
        // Pie chart data
        const distCat = new Map();
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
    }
    catch {
        res.status(500).json({ error: 'Error obteniendo gráficos ciudadano' });
    }
});
exports.default = router;
