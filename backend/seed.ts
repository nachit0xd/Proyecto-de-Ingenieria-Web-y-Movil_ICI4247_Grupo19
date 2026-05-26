import dotenv from 'dotenv';
dotenv.config();
import prisma from './src/db';
import bcrypt from 'bcryptjs';

// Este script se encarga de inyectar datos de prueba en la base de datos utilizando Prisma. 
// Crea usuarios, propuestas, eventos, fondos y postulaciones para facilitar el desarrollo y las pruebas de la aplicación. 
async function main() {
  console.log("Iniciando inyección de datos (Seed)...");

  // 1. Limpiar datos existentes (Opcional, en cascada no configurada puede fallar, pero Prisma puede hacer deleteMany)
  await prisma.postulacion.deleteMany({});
  await prisma.fondo.deleteMany({});
  await prisma.evento.deleteMany({});
  await prisma.propuesta.deleteMany({});
  await prisma.usuario.deleteMany({});

  // 2. Crear Usuarios (Perfiles predefinidos)
  const hashedPassword = await bcrypt.hash('12345678', 10);
  
  const ciudadano = await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez (Ciudadano)',
      email: 'ciudadano@cultura.cl',
      password: hashedPassword,
      rol: 'ciudadano'
    }
  });

  const gestor = await prisma.usuario.create({
    data: {
      nombre: 'María Gómez (Gestor)',
      email: 'gestor@cultura.cl',
      password: hashedPassword,
      rol: 'gestor'
    }
  });

  // 3. Crear Propuestas
  await prisma.propuesta.createMany({
    data: [
      {
        titulo: 'Recuperación del Teatro Municipal',
        descripcion: 'Propongo restaurar la fachada y butacas del teatro histórico de nuestra comuna para albergar obras gratuitas los fines de semana.',
        estado: 'revision',
        votosTotales: 145,
        idUsuario: ciudadano.id
      },
      {
        titulo: 'Feria de Artesanos Locales',
        descripcion: 'Crear un espacio mensual en la plaza de armas para que los cultores y artesanos puedan vender sus obras sin costo de patente.',
        estado: 'aprobado',
        votosTotales: 320,
        idUsuario: ciudadano.id
      },
      {
        titulo: 'Taller de Cueca Escolar',
        descripcion: 'Implementar talleres obligatorios y entretenidos de baile nacional en todas las escuelas públicas de la región.',
        estado: 'rechazado',
        votosTotales: 12,
        idUsuario: ciudadano.id
      }
    ]
  });

  // 4. Crear Eventos
  await prisma.evento.createMany({
    data: [
      {
        titulo: 'Día del Patrimonio Cultural',
        tipo: 'patrimonio',
        estado: 'activo',
        fechaInicio: new Date('2026-06-25T10:00:00Z'),
        fechaFin: new Date('2026-06-25T18:00:00Z'),
        direccion: 'Plaza Sotomayor, Valparaíso',
      },
      {
        titulo: 'Encuentro de Ceramistas',
        tipo: 'cultor',
        estado: 'activo',
        fechaInicio: new Date('2026-07-15T09:00:00Z'),
        fechaFin: new Date('2026-07-17T20:00:00Z'),
        direccion: 'Centro Cultural, Quilpué',
      },
      {
        titulo: 'Feria Costumbrista de Invierno',
        tipo: 'feria',
        estado: 'finalizado',
        fechaInicio: new Date('2025-08-10T11:00:00Z'),
        fechaFin: new Date('2025-08-12T22:00:00Z'),
        direccion: 'Parque Bicentenario',
      }
    ]
  });

  // 5. Crear Fondos
  const fondo1 = await prisma.fondo.create({
    data: {
      titulo: 'Fondo de Desarrollo de las Artes (FONDART)',
      descripcion: 'Apoyo a la creación y difusión de proyectos artísticos regionales.',
      montoMaximo: 5000000,
      presupuesto: 25000000,
      cupos: 5,
      estado: 'abierto'
    }
  });

  await prisma.fondo.create({
    data: {
      titulo: 'Fondo del Patrimonio Cultural',
      descripcion: 'Para la restauración y conservación de inmuebles patrimoniales y rescate de oficios tradicionales.',
      montoMaximo: 15000000,
      presupuesto: 60000000,
      cupos: 4,
      estado: 'cerrado'
    }
  });

  // 6. Crear Postulaciones ficticias al fondo
  await prisma.postulacion.createMany({
    data: [
      {
        fondoId: fondo1.id,
        nombreRepresentante: 'Luis Soto',
        rutRepresentante: '15.234.567-8',
        nombreOrganizacion: 'Agrupación Teatral El Viento',
        descripcion: 'Montaje de obra de teatro callejero.',
        presupuestoEstimado: 4500000,
        estado: 'pendiente'
      },
      {
        fondoId: fondo1.id,
        nombreRepresentante: 'Javiera Mena',
        rutRepresentante: '17.888.999-0',
        nombreOrganizacion: 'Músicos del Valle',
        descripcion: 'Grabación de disco con sonidos folclóricos experimentales.',
        presupuestoEstimado: 3200000,
        estado: 'aprobado'
      }
    ]
  });

  console.log("¡Base de datos inyectada con éxito! Todos los modelos tienen datos.");
  console.log("-----------------------------------------");
  console.log("Credenciales de prueba:");
  console.log("1. Ciudadano: ciudadano@cultura.cl / 12345678");
  console.log("2. Gestor: gestor@cultura.cl / 12345678");
  console.log("-----------------------------------------");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
