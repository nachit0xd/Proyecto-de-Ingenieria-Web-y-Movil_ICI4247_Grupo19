"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// Obtener todas las fichas
router.get('/', async (req, res) => {
    try {
        const fichas = await db_1.default.ficha.findMany({
            orderBy: { fechaCreacion: 'desc' }
        });
        res.json(fichas);
    }
    catch (error) {
        console.error('Error al obtener fichas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Crear nueva ficha (Solo gestores)
router.post('/', auth_1.verifyToken, async (req, res) => {
    try {
        const { nombre, descripcion, categoria, estado, ubicacion, multimediaUrl } = req.body;
        // Validación básica
        if (!nombre || !descripcion || !categoria || !estado) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const nuevaFicha = await db_1.default.ficha.create({
            data: {
                nombre,
                descripcion,
                categoria,
                estado,
                ubicacion: ubicacion ? JSON.stringify(ubicacion) : null,
                multimediaUrl: multimediaUrl ? JSON.stringify(multimediaUrl) : null
            }
        });
        res.status(201).json(nuevaFicha);
    }
    catch (error) {
        console.error('Error al crear ficha:', error);
        res.status(500).json({ error: 'Error al crear la ficha' });
    }
});
// Actualizar una ficha existente
router.put('/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, categoria, estado, ubicacion, multimediaUrl } = req.body;
        const fichaActualizada = await db_1.default.ficha.update({
            where: { id: id },
            data: {
                nombre,
                descripcion,
                categoria,
                estado,
                ubicacion: ubicacion ? JSON.stringify(ubicacion) : null,
                multimediaUrl: multimediaUrl ? JSON.stringify(multimediaUrl) : null
            }
        });
        res.json(fichaActualizada);
    }
    catch (error) {
        console.error('Error al actualizar ficha:', error);
        res.status(500).json({ error: 'Error al actualizar la ficha' });
    }
});
// Cambiar el estado de una ficha (visible/oculto)
router.patch('/:id/estado', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        if (!estado) {
            return res.status(400).json({ error: 'Debe proveer un nuevo estado' });
        }
        const fichaActualizada = await db_1.default.ficha.update({
            where: { id: id },
            data: { estado }
        });
        res.json(fichaActualizada);
    }
    catch (error) {
        console.error('Error al cambiar estado de ficha:', error);
        res.status(500).json({ error: 'Error al actualizar el estado' });
    }
});
// Eliminar una ficha
router.delete('/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db_1.default.ficha.delete({
            where: { id: id }
        });
        res.json({ message: 'Ficha eliminada exitosamente' });
    }
    catch (error) {
        console.error('Error al eliminar ficha:', error);
        res.status(500).json({ error: 'Error al eliminar la ficha' });
    }
});
// Valorar una ficha
router.post('/:id/valoracion', auth_1.verifyToken, async (req, res) => {
    try {
        const fichaId = req.params.id;
        const { valoracion } = req.body;
        const usuarioId = req.user?.id;
        if (!usuarioId) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }
        if (!valoracion || valoracion < 1 || valoracion > 5) {
            return res.status(400).json({ error: 'La valoración debe estar entre 1 y 5' });
        }
        // Si ya votó, se actualiza la valoración. Si no, se crea una nueva
        await db_1.default.valoracionFicha.upsert({
            where: {
                usuarioId_fichaId: {
                    usuarioId,
                    fichaId
                }
            },
            update: { valoracion },
            create: {
                usuarioId,
                fichaId,
                valoracion
            }
        });
        // Recalcular promedio
        const agregacion = await db_1.default.valoracionFicha.aggregate({
            where: { fichaId: fichaId },
            _avg: { valoracion: true },
            _count: { valoracion: true }
        });
        const nuevoPromedio = agregacion._avg?.valoracion || 0;
        const countData = agregacion._count;
        const total = countData?.valoracion || 0;
        // Actualizar ficha
        const fichaActualizada = await db_1.default.ficha.update({
            where: { id: fichaId },
            data: {
                valoracionPromedio: nuevoPromedio,
                totalValoraciones: total
            }
        });
        res.json({ message: 'Valoración registrada exitosamente', ficha: fichaActualizada });
    }
    catch (error) {
        console.error('Error al valorar ficha:', error);
        res.status(500).json({ error: 'Error interno al procesar la valoración' });
    }
});
exports.default = router;
