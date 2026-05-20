import { PostulacionFondo } from '../types';

export interface PostulacionFondoGestor {
  id: string;
  idUsuario: string;
  nombreOrganizacion: string;
  descripcionIniciativa: string;
  areaCultural: string;
  presupuestoEstimado: number;
  estado: string;
  fechaPostulacion: Date;
  fondoNombre: string;
  rutRepresentante: string;
  nombreRepresentante: string;
  desglose: { tipo: string, monto: number }[];
}

const MOCK_POSTULACIONES_GESTOR: PostulacionFondoGestor[] = [
  {
    id: 'f1',
    idUsuario: 'u1',
    nombreOrganizacion: 'Fondo Organizaciones Comuna',
    descripcionIniciativa: 'Deseamos postular al fondo para financiar la realización de una feria de ropa artesanal hecha por mujeres, con una duración de 1 mes',
    areaCultural: 'Feria',
    presupuestoEstimado: 250000,
    estado: 'pendiente',
    fechaPostulacion: new Date('2026-05-15'),
    fondoNombre: 'Feria de ropa artesanal',
    rutRepresentante: '12.345.678-9',
    nombreRepresentante: 'María Silva',
    desglose: [
      { tipo: 'Alquiler de inmobiliario', monto: 100000 },
      { tipo: 'Publicidad', monto: 50000 },
      { tipo: 'Alimentos, luz, otros...', monto: 100000 }
    ]
  },
  {
    id: 'f2',
    idUsuario: 'u2',
    nombreOrganizacion: 'Agrupación Folclórica',
    descripcionIniciativa: 'Taller de Cueca Chilena',
    areaCultural: 'Música',
    presupuestoEstimado: 150000,
    estado: 'pendiente',
    fechaPostulacion: new Date('2026-05-18'),
    fondoNombre: 'Fondo Cultural Chilenidad 2026',
    rutRepresentante: '11.222.333-4',
    nombreRepresentante: 'María Sánchez',
    desglose: [
      { tipo: 'Vestuario', monto: 150000 }
    ]
  },
  {
    id: 'f3',
    idUsuario: 'u3',
    nombreOrganizacion: 'Junta de Vecinos',
    descripcionIniciativa: 'Mural Artístico',
    areaCultural: 'Artes Visuales',
    presupuestoEstimado: 100000,
    estado: 'pendiente',
    fechaPostulacion: new Date('2026-05-17'),
    fondoNombre: 'Fondo Arte Libre 2026',
    rutRepresentante: '9.876.543-2',
    nombreRepresentante: 'María Soto',
    desglose: [
      { tipo: 'Pintura', monto: 100000 }
    ]
  }
];

const MOCK_POSTULACIONES: PostulacionFondo[] = [
  {
    id: 'f1',
    idUsuario: 'u1',
    nombreOrganizacion: 'Junta de Vecinos #4',
    descripcionIniciativa: 'Taller de rescate patrimonial barrial',
    areaCultural: 'Patrimonio',
    presupuestoEstimado: 500000,
    impactoEsperado: 'Capacitar a 50 vecinos',
    estado: 'en_revision',
    fechaPostulacion: new Date('2024-05-10')
  },
  {
    id: 'f2',
    idUsuario: 'u2',
    nombreOrganizacion: 'Agrupación Folclórica',
    descripcionIniciativa: 'Adquisición de instrumentos musicales',
    areaCultural: 'Música',
    presupuestoEstimado: 1200000,
    impactoEsperado: 'Mejorar calidad de presentaciones',
    estado: 'aprobada',
    fechaPostulacion: new Date('2024-04-15')
  }
];

const MOCK_CONVOCATORIAS = [
  { id: 'c1', titulo: 'Fondo Concursable Artes 2026', periodo: '15 May - 15 Jul', presupuesto: 6000000, montoMaximo: 200000, postulaciones: 34, cupos: 30, estado: 'Abierta', fechaCierre: new Date('2026-07-15') },
  { id: 'c2', titulo: 'Fondo Fiestas Patrias 2026', periodo: '01 Ago - 31 Ago', presupuesto: 12000000, montoMaximo: 1000000, postulaciones: 0, cupos: 12, estado: 'Abierta', fechaCierre: new Date('2026-08-31') },
  { id: 'c3', titulo: 'Fondo Nuevos Empresarios', periodo: '18 May - 31 Jul', presupuesto: 10000000, montoMaximo: 1000000, postulaciones: 25, cupos: 10, estado: 'Abierta', fechaCierre: new Date('2026-07-31') },
  { id: 'c4', titulo: 'Fondo Cultural Julio 2026', periodo: '03 Jun - 28 Jun', presupuesto: 5000000, montoMaximo: 250000, postulaciones: 0, cupos: 20, estado: 'Abierta', fechaCierre: new Date('2026-06-28') }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fondosService = {
  obtenerPostulacionesGestor: async (): Promise<PostulacionFondoGestor[]> => {
    await delay(300);
    return MOCK_POSTULACIONES_GESTOR;
  },
  
  obtenerConvocatoriasGestor: async () => {
    await delay(300);
    return MOCK_CONVOCATORIAS;
  },

  obtenerPostulaciones: async (): Promise<PostulacionFondo[]> => {
    await delay(500);
    return MOCK_POSTULACIONES;
  },
  
  obtenerConvocatoriasActivas: async () => {
    await delay(500);
    return MOCK_CONVOCATORIAS;
  }
};
