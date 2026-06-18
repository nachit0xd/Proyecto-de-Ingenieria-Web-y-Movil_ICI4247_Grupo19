import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import xss from 'xss';

// Cargar variables de entorno
dotenv.config();

import authRoutes from './routes/auth';
import comunidadRoutes from './routes/comunidad';
import eventosRoutes from './routes/eventos';
import fondosRoutes from './routes/fondos';
import transparenciaRoutes from './routes/transparencia';
import fichasRoutes from './routes/fichas';
import dashboardRoutes from './routes/dashboard';
import uploadRoutes from './routes/upload';

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Configuración segura de CORS (con Whitelist, que permite solo orígenes específicos)
const allowedOrigins = ['http://localhost:5173', 'http://localhost:8100', 'capacitor://localhost', 'http://localhost:8080'];
app.use(cors({
  origin: (origin, callback) => {
    // Se permite origin undefined para llamadas de servidor a servidor o herramientas de desarrollo locales
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Seguridad de cabeceras HTTP, incluyendo Content Security Policy (CSP) para prevenir ataques XSS
app.use(helmet());

// Prevención de ataques XSS limpiando el cuerpo de las peticiones HTTP
const xssClean = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
};
app.use(xssClean);

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
app.use('/api/upload', uploadRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
