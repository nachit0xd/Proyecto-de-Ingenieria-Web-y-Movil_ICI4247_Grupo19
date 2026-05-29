import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

import authRoutes from './routes/auth';
import comunidadRoutes from './routes/comunidad';
import eventosRoutes from './routes/eventos';
import fondosRoutes from './routes/fondos';
import transparenciaRoutes from './routes/transparencia';
import fichasRoutes from './routes/fichas';
import dashboardRoutes from './routes/dashboard';

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/comunidad', comunidadRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/fondos', fondosRoutes);
app.use('/api/transparencia', transparenciaRoutes);
app.use('/api/fichas', fichasRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
