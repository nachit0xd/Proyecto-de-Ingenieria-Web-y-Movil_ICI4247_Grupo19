"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/comunidad/populares: Obtener las propuestas más votadas
router.get('/populares', async (req, res) => {
    try {
        const propuestas = await db_1.default.propuesta.findMany({
            orderBy: { votosTotales: 'desc' },
            take: 10,
            include: { usuario: { select: { nombre: true } } }
        });
        const mapped = propuestas.map(p => ({
            id: p.id,
            titulo: p.titulo,
            descripcion: p.descripcion,
            votos: p.votosTotales,
            votosTotales: p.votosTotales,
            categoria: 'Comunidad',
            autor: p.usuario?.nombre || 'Anónimo',
            fechaPublicacion: p.fechaCreacion,
            estado: p.estado,
            comentariosGestor: p.comentariosGestor
        }));
        res.json(mapped);
    }
    catch {
        res.status(500).json({ error: 'Error al obtener propuestas populares' });
    }
});
// GET /api/comunidad/todas: Obtener todas las propuestas
router.get('/todas', async (req, res) => {
    try {
        const propuestas = await db_1.default.propuesta.findMany({
            orderBy: { fechaCreacion: 'desc' },
            include: { usuario: { select: { nombre: true } } }
        });
        const mapped = propuestas.map(p => ({
            id: p.id,
            titulo: p.titulo,
            descripcion: p.descripcion,
            votos: p.votosTotales,
            votosTotales: p.votosTotales,
            categoria: 'Comunidad',
            autor: p.usuario?.nombre || 'Anónimo',
            fechaPublicacion: p.fechaCreacion,
            estado: p.estado,
            comentariosGestor: p.comentariosGestor
        }));
        res.json(mapped);
    }
    catch {
        res.status(500).json({ error: 'Error al obtener propuestas' });
    }
});
// GET /api/comunidad/mis-votos: Obtener IDs de las propuestas que el usuario ha votado
router.get('/mis-votos', auth_1.verifyToken, async (req, res) => {
    try {
        const idUsuario = req.user?.id;
        if (!idUsuario) {
            res.status(401).json({ error: 'No autorizado' });
            return;
        }
        const votos = await db_1.default.votoPropuesta.findMany({
            where: { idUsuario },
            select: { idPropuesta: true }
        });
        res.json(votos.map((v) => v.idPropuesta));
    }
    catch {
        res.status(500).json({ error: 'Error al obtener mis votos' });
    }
});
// POST /api/comunidad/votar/:id (Protected): Incrementar votos de una propuesta
router.post('/votar/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const idPropuesta = req.params.id;
        const idUsuario = req.user?.id;
        if (!idUsuario) {
            res.status(401).json({ error: 'No autorizado' });
            return;
        }
        // Verificar si ya votó
        const existe = await db_1.default.votoPropuesta.findUnique({
            where: { idUsuario_idPropuesta: { idUsuario, idPropuesta } }
        });
        if (existe) {
            res.status(400).json({ error: 'Ya has votado por esta propuesta' });
            return;
        }
        // Crear voto y actualizar contador en una transacción
        const result = await db_1.default.$transaction([
            db_1.default.votoPropuesta.create({
                data: { idUsuario, idPropuesta }
            }),
            db_1.default.propuesta.update({
                where: { id: idPropuesta },
                data: { votosTotales: { increment: 1 } },
            })
        ]);
        res.json(result[1]);
    }
    catch {
        res.status(500).json({ error: 'Error al registrar el voto' });
    }
});
// POST /api/comunidad/anular-voto/:id (Protected): Disminuir votos de una propuesta
router.post('/anular-voto/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const idPropuesta = req.params.id;
        const idUsuario = req.user?.id;
        if (!idUsuario) {
            res.status(401).json({ error: 'No autorizado' });
            return;
        }
        // Verificar si ya votó
        const existe = await db_1.default.votoPropuesta.findUnique({
            where: { idUsuario_idPropuesta: { idUsuario, idPropuesta } }
        });
        if (!existe) {
            res.status(400).json({ error: 'No has votado por esta propuesta' });
            return;
        }
        // Eliminar voto y actualizar contador en una transacción
        const result = await db_1.default.$transaction([
            db_1.default.votoPropuesta.delete({
                where: { idUsuario_idPropuesta: { idUsuario, idPropuesta } }
            }),
            db_1.default.propuesta.update({
                where: { id: idPropuesta },
                data: { votosTotales: { decrement: 1 } },
            })
        ]);
        res.json(result[1]);
    }
    catch {
        res.status(500).json({ error: 'Error al anular el voto' });
    }
});
// POST /api/comunidad/propuesta (Protected): Crear una propuesta ciudadana
router.post('/propuesta', auth_1.verifyToken, async (req, res) => {
    try {
        const idUsuario = req.user?.id;
        if (!idUsuario) {
            res.status(401).json({ error: 'No autorizado' });
            return;
        }
        const { titulo, descripcion } = req.body;
        const propuesta = await db_1.default.propuesta.create({
            data: {
                titulo,
                descripcion,
                estado: 'en_revision',
                idUsuario
            }
        });
        res.json(propuesta);
    }
    catch {
        res.status(500).json({ error: 'Error al crear la propuesta' });
    }
});
// PUT /api/comunidad/propuesta/:id (Protected): Actualizar una propuesta
router.put('/propuesta/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo, descripcion, estado, nuevoComentario } = req.body;
        const updateData = {};
        if (titulo !== undefined)
            updateData.titulo = titulo;
        if (descripcion !== undefined)
            updateData.descripcion = descripcion;
        if (estado !== undefined)
            updateData.estado = estado;
        if (nuevoComentario) {
            updateData.comentariosGestor = { push: nuevoComentario };
        }
        const propuesta = await db_1.default.propuesta.update({
            where: { id },
            data: updateData,
        });
        res.json(propuesta);
    }
    catch {
        res.status(500).json({ error: 'Error al actualizar propuesta' });
    }
});
// DELETE /api/comunidad/propuesta/:id (Protected): Eliminar una propuesta
router.delete('/propuesta/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        // Verificar si la propuesta existe antes de eliminarla
        const existing = await db_1.default.propuesta.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: 'Propuesta no encontrada' });
            return;
        }
        await db_1.default.propuesta.delete({ where: { id } });
        res.json({ message: 'Propuesta eliminada exitosamente' });
    }
    catch {
        res.status(500).json({ error: 'Error al eliminar propuesta' });
    }
});
exports.default = router;
