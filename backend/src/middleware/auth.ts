import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware de autenticación para proteger rutas
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

// Interfaz extendida para incluir información del usuario autenticado
export interface AuthRequest extends Request {
  user?: { id: string; email: string; rol: string };
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
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; rol: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado.' });
    return;
  }
};

// Middleware para verificar que el usuario tenga un rol específico
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.rol) {
      res.status(401).json({ error: 'Acceso denegado. Usuario no autenticado.' });
      return;
    }

    if (!roles.includes(req.user.rol)) {
      res.status(403).json({ error: 'Acceso denegado. Permisos insuficientes.' });
      return;
    }

    next();
  };
};
