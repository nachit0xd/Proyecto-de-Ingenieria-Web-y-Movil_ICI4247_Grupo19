"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// GET /api/eventos: Obtener todos los eventos
router.get('/', async (req, res) => {
    try {
        const eventos = await db_1.default.evento.findMany({
            orderBy: { fechaInicio: 'asc' },
        });
        res.json(eventos);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener eventos' });
    }
});
// POST /api/eventos: Crear un nuevo evento
router.post('/', async (req, res) => {
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
    catch (error) {
        res.status(500).json({ error: 'Error al crear evento' });
    }
});
exports.default = router;
