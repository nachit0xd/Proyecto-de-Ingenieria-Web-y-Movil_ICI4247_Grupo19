import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_super_seguro_cultura';

// POST /api/auth/register: Registrar un nuevo usuario
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, rol } = req.body;
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

    // Create user
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: rol || 'ciudadano',
      }
    });

    // Crear token JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: newUser.id, nombre: newUser.nombre, rol: newUser.rol } });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login: Iniciar sesión
router.post('/login', async (req: Request, res: Response): Promise<void> => {
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
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    console.log(`Login successful for: ${email}`);
    res.status(200).json({ token, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;
