"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_super_seguro_cultura';
// POST /api/auth/register: Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        // Verificar si el email ya está registrado
        const existingUser = await db_1.default.usuario.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'El email ya está registrado' });
            return;
        }
        // Cifrar contraseña
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Crear nuevo usuario
        const newUser = await db_1.default.usuario.create({
            data: {
                nombre,
                email,
                password: hashedPassword,
                rol: rol || 'ciudadano',
            }
        });
        // Crear token JWT
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: newUser.id, nombre: newUser.nombre, rol: newUser.rol } });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});
// POST /api/auth/login: Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Encontrar usuario por email
        const user = await db_1.default.usuario.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        // Verificar contraseña
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
            return;
        }
        // Crear token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
exports.default = router;
