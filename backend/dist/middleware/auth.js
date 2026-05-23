"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret_super_seguro_cultura';
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Se espera token en formato "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
        return;
    }
};
exports.verifyToken = verifyToken;
