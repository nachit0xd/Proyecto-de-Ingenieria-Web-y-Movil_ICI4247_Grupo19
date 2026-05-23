"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /api/fondos/convocatorias: Obtener todas las convocatorias
router.get('/convocatorias', async (req, res) => {
    try {
        const fondos = await db_1.default.fondo.findMany({
            orderBy: { creadoEn: 'desc' },
        });
        res.json(fondos);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener convocatorias' });
    }
});
// GET /api/fondos/postulaciones: Obtener todas las postulaciones
router.get('/postulaciones', async (req, res) => {
    try {
        const postulaciones = await db_1.default.postulacion.findMany({
            orderBy: { fechaPostulacion: 'desc' },
        });
        res.json(postulaciones);
    }
    catch (error) {
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
                estado: 'pendiente'
            },
        });
        res.json(nuevaPostulacion);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear postulación' });
    }
});
// PATCH /api/fondos/postulaciones/:id/estado: Actualizar estado de una postulación
router.patch('/postulaciones/:id/estado', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const postulacion = await db_1.default.postulacion.update({
            where: { id },
            data: { estado },
        });
        res.json(postulacion);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
});
exports.default = router;
