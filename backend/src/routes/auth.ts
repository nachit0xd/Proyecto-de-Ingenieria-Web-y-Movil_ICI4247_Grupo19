import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import rateLimit from 'express-rate-limit';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1);
}

// Rate limiter: sirve para prevenir ataques de fuerza bruta en el inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos de ventana
  max: 5, // Limita cada IP a 5 peticiones por ventana de 15 min
  message: { error: 'Demasiados intentos de inicio de sesión desde esta IP, por favor intenta de nuevo en 15 minutos.' }
});

// POST /api/auth/register: Registrar un nuevo usuario
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password } = req.body;
    console.log(`Register attempt for email: ${email}`);
    
    // Verificar si el email ya está registrado
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`Email already registered: ${email}`);
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    // Contraseña segura con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creamos un usuario nuevo con rol "ciudadano" por defecto para evitar un escalamiento de privilegios
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: 'ciudadano', // Forzamos el rol ciudadano para evitar un escalamiento de privilegios
      }
    });

    // Crear token JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email, rol: newUser.rol }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: newUser.id, nombre: newUser.nombre, rol: newUser.rol } });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login: Iniciar sesión
router.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => { // Aplicamos el rate limiter solo a esta ruta de login
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);
    
    // Encontrar usuario por email
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      console.log(`User not found: ${email}`);
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Verificar contraseña con bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log(`Invalid password for: ${email}`);
      res.status(401).json({ error: 'Contraseña incorrecta' });
      return;
    }

    // Crear token JWT
    const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '1d' });
    console.log(`Login successful for: ${email}`);
    res.status(200).json({ token, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;
