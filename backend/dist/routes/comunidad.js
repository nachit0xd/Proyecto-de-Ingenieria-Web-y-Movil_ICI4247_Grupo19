"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/comunidad/populares: Obtener propuestas más votadas
router.get('/populares', async (req, res) => {
    try {
        const propuestas = await db_1.default.propuesta.findMany({
            orderBy: { votosTotales: 'desc' },
            take: 10,
        });
        res.json(propuestas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener propuestas populares' });
    }
});
// GET /api/comunidad/todas: Obtener todas las propuestas
router.get('/todas', async (req, res) => {
    try {
        const propuestas = await db_1.default.propuesta.findMany({
            orderBy: { fechaCreacion: 'desc' },
        });
        res.json(propuestas);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener propuestas' });
    }
});
// POST /api/comunidad/votar/:id (Protected): Votar por una propuesta
router.post('/votar/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const propuesta = await db_1.default.propuesta.update({
            where: { id },
            data: { votosTotales: { increment: 1 } },
        });
        res.json(propuesta);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al registrar el voto' });
    }
});
// PUT /api/comunidad/propuesta/:id (Protected): Actualizar una propuesta
router.put('/propuesta/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo, descripcion, estado } = req.body;
        const propuesta = await db_1.default.propuesta.update({
            where: { id },
            data: { titulo, descripcion, estado },
        });
        res.json(propuesta);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al actualizar propuesta' });
    }
});
// DELETE /api/comunidad/propuesta/:id (Protected): Eliminar una propuesta
router.delete('/propuesta/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        // Verificar si la propuesta existe
        const existing = await db_1.default.propuesta.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Propuesta no encontrada' });
            return;
        }
        await db_1.default.propuesta.delete({ where: { id } });
        res.json({ message: 'Propuesta eliminada exitosamente' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al eliminar propuesta' });
    }
});
exports.default = router;
