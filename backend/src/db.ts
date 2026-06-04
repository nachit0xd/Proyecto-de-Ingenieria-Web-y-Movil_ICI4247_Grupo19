import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Cargar variables de entorno
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Crear instancia de Prisma Client con el adaptador personalizado
const prisma = new PrismaClient({ adapter });

export default prisma;
