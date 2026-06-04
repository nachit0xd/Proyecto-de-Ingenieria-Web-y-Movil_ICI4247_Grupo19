import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware de autenticación para proteger rutas
const JWT_SECRET = process.env.JWT_SECRET || 'secret_super_seguro_cultura';

// Interfaz extendida para incluir información del usuario autenticado
export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// Middleware para verificar el token JWT
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]; // Esperamos el token en el formato "Bearer <token>"

  // Verificar si el token está presente
  if (!token) {
    res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    return;
  }

  // Verificar y decodificar el token
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
    return;
  }
};
