import dotenv from 'dotenv';
dotenv.config();
import prisma from './src/db';

// Este script se puede ejecutar con `ts-node backend/check_users.ts` para verificar los usuarios en la base de datos
async function main() {
  const users = await prisma.usuario.findMany();
  console.log(users);
}

main().finally(() => prisma.$disconnect());
