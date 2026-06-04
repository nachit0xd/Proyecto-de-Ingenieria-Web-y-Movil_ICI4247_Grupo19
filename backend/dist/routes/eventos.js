"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/eventos: Obtener todos los eventos
router.get('/', async (req, res) => {
    try {
        const eventos = await db_1.default.evento.findMany({
            orderBy: { fechaInicio: 'asc' },
        });
        res.json(eventos);
    }
    catch {
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
});
// POST /api/eventos: Crear un nuevo evento (Gestor)
router.post('/', auth_1.verifyToken, async (req, res) => {
    try {
        const { titulo, tipo, estado, fechaInicio, fechaFin, direccion, lat, lng } = req.body;
        const nuevoEvento = await db_1.default.evento.create({
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
    }
    catch {
        res.status(500).json({ error: 'Error al crear evento' });
    }
});
// PUT /api/eventos/:id: Editar un evento
router.put('/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, tipo, estado, fechaInicio, fechaFin, direccion, lat, lng } = req.body;
        const eventoActualizado = await db_1.default.evento.update({
            where: { id: id },
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
    }
    catch {
        res.status(500).json({ error: 'Error al actualizar evento' });
    }
});
// DELETE /api/eventos/:id: Eliminar un evento
router.delete('/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.evento.delete({ where: { id: id } });
        res.json({ message: 'Evento eliminado' });
    }
    catch {
        res.status(500).json({ error: 'Error al eliminar evento' });
    }
});
exports.default = router;
