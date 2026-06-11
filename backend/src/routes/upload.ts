import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { verifyToken } from '../middleware/auth';

// Este router maneja la subida de imágenes, utilizando Cloudinary si las credenciales están configuradas, o un almacenamiento en memoria como fallback para desarrollo.
const router = Router();

const hasCloudinary = !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET;

// Configuración de Cloudinary solo si las variables de entorno están presentes
if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const cloudStorage = hasCloudinary ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cultura_municipal',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
}) : multer.memoryStorage();

const upload = multer({ storage: cloudStorage });

// POST /api/upload: Endpoint para subir una imagen. El campo del formulario debe llamarse 'image'.
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
       res.status(400).json({ error: 'No se recibió ninguna imagen' });
       return;
    }

    if (hasCloudinary) {
       // Subida real exitosa a Cloudinary (la URL pública viene en req.file.path)
       res.json({ success: true, imageUrl: req.file.path, provider: 'cloudinary' });
    } else {
       // Fallback simulado para que la app frontend funcione antes de configurar el .env (Se empaqueta como base64 pero simulando el contrato de la API)
       const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
       res.json({ success: true, imageUrl: base64, provider: 'local_mock' });
    }
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor al subir la imagen' });
  }
});

export default router;
