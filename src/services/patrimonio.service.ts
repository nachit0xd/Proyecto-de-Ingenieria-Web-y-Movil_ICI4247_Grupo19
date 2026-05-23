import { FichaPatrimonio } from '../types';

// Servicio simulado para obtener fichas de patrimonio, con datos de ejemplo y un retraso artificial para simular una llamada a API real

const MOCK_FICHAS: FichaPatrimonio[] = [
  {
    id: 'f1',
    nombre: 'Tejeduría en telar',
    descripcion: 'Técnica ancestral mapuche transmitida por generaciones',
    categoria: 'oficio',
    estado: 'publicado',
    fechaCreacion: new Date('2023-01-15'),
    fechaActualizacion: new Date('2023-05-20'),
  },
  {
    id: 'f2',
    nombre: 'Alfarería en greda',
    descripcion: 'Cerámica artesanal con técnicas prehispánicas locales',
    categoria: 'cultor',
    estado: 'publicado',
    fechaCreacion: new Date('2023-02-10'),
    fechaActualizacion: new Date('2023-06-11'),
  },
  {
    id: 'f3',
    nombre: 'Música folclórica',
    descripcion: 'Cueca chora interpretada por músicos locales',
    categoria: 'expresion',
    estado: 'publicado',
    fechaCreacion: new Date('2023-03-05'),
    fechaActualizacion: new Date('2023-07-22'),
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const patrimonioService = {
  obtenerFichas: async (): Promise<FichaPatrimonio[]> => {
    await delay(500);
    return MOCK_FICHAS;
  },
  
  obtenerFichasDestacadas: async (): Promise<FichaPatrimonio[]> => {
    await delay(500);
    // Simular que las primeras 3 son destacadas
    return MOCK_FICHAS.slice(0, 3);
  }
};
