import dotenv from 'dotenv';
dotenv.config();
import prisma from './src/db';
import bcrypt from 'bcryptjs';

// Este script se puede ejecutar con `ts-node backend/seed.ts` para crear usuarios de prueba en la base de datos
async function main() {
  const email = 'ciudadano@cultura.cl';
  const existing = await prisma.usuario.findUnique({ where: { email } });
  
  if (existing) {
    console.log("El usuario ya existe.");
    return;
  }

  const hashedPassword = await bcrypt.hash('123456', 10);
  
  await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      email,
      password: hashedPassword,
      rol: 'ciudadano'
    }
  });

  const emailGestor = 'gestor@cultura.cl';
  const existingGestor = await prisma.usuario.findUnique({ where: { email: emailGestor } });
  
  if (!existingGestor) {
    await prisma.usuario.create({
      data: {
        nombre: 'María Gómez',
        email: emailGestor,
        password: hashedPassword,
        rol: 'gestor'
      }
    });
  }

  console.log("Usuarios creados exitosamente.");
}

// Ejecutar la función principal y manejar errores
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
