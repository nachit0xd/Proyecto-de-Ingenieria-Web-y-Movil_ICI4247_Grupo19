"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/fondos/convocatorias: Obtener todas las convocatorias
router.get('/convocatorias', async (req, res) => {
    try {
        const fondos = await db_1.default.fondo.findMany({
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
    }
    catch {
        res.status(500).json({ error: 'Error al obtener convocatorias' });
    }
});
// GET /api/fondos/postulaciones: Obtener todas las postulaciones
router.get('/postulaciones', async (req, res) => {
    try {
        const postulaciones = await db_1.default.postulacion.findMany({
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
    }
    catch {
        res.status(500).json({ error: 'Error al obtener postulaciones' });
    }
});
// POST /api/fondos/postular: Crear una nueva postulación
router.post('/postular', async (req, res) => {
    try {
        const data = req.body;
        const nuevaPostulacion = await db_1.default.postulacion.create({
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
    }
    catch {
        res.status(500).json({ error: 'Error al crear postulación' });
    }
});
// PATCH /api/fondos/postulaciones/:id/estado: Actualizar el estado de una postulación
router.patch('/postulaciones/:id/estado', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const postulacion = await db_1.default.postulacion.update({
            where: { id: id },
            data: { estado },
        });
        res.json(postulacion);
    }
    catch {
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
});
// POST /api/fondos/convocatoria (Gestor): Crear un nuevo fondo
router.post('/convocatoria', auth_1.verifyToken, async (req, res) => {
    try {
        const { titulo, descripcion, montoMaximo, presupuesto, cupos, estado } = req.body;
        const nuevoFondo = await db_1.default.fondo.create({
            data: { titulo, descripcion, montoMaximo, presupuesto, cupos, estado }
        });
        res.json(nuevoFondo);
    }
    catch {
        res.status(500).json({ error: 'Error al crear fondo' });
    }
});
// PUT /api/fondos/convocatoria/:id (Gestor): Editar un fondo existente
router.put('/convocatoria/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, montoMaximo, presupuesto, cupos, estado } = req.body;
        const fondoActualizado = await db_1.default.fondo.update({
            where: { id: id },
            data: { titulo, descripcion, montoMaximo, presupuesto, cupos, estado }
        });
        res.json(fondoActualizado);
    }
    catch {
        res.status(500).json({ error: 'Error al actualizar fondo' });
    }
});
// DELETE /api/fondos/convocatoria/:id (Gestor): Eliminar un fondo
router.delete('/convocatoria/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.fondo.delete({ where: { id: id } });
        res.json({ message: 'Fondo eliminado' });
    }
    catch {
        res.status(500).json({ error: 'Error al eliminar fondo' });
    }
});
exports.default = router;
