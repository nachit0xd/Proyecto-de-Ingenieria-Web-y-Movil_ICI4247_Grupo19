import { EventoCultural } from '../types';

// Servicio simulado para el dashboard del gestor municipal, proporcionando datos de resumen de gestión, KPIs clave y actividad reciente con retrasos artificiales para simular llamadas a API reales
const MOCK_EVENTOS: EventoCultural[] = [
  {
    id: 'e1',
    titulo: 'Feria del libro usado',
    descripcion: 'Venta e intercambio de libros.',
    tipo: 'feria',
    fechaInicio: new Date('2024-06-25T12:00:00'),
    fechaFin: new Date('2024-06-25T18:00:00'),
    organizador: 'Municipalidad',
    destacado: true,
    estado: 'activo',
    ubicacion: { latitud: -33.4, longitud: -70.6, direccion: 'Parque Libertad' }
  },
  {
    id: 'e2',
    titulo: 'Taller de canto chileno',
    descripcion: 'Taller para aprender técnicas vocales.',
    tipo: 'taller',
    fechaInicio: new Date('2024-07-06T14:00:00'),
    fechaFin: new Date('2024-07-06T18:00:00'),
    organizador: 'Centro Cultural',
    destacado: true,
    estado: 'activo',
    ubicacion: { latitud: -33.41, longitud: -70.61, direccion: 'Centro Recreacional' }
  },
  {
    id: 'e3',
    titulo: 'Inauguración Monumento de la Memoria',
    descripcion: 'Ceremonia de inauguración del nuevo monumento.',
    tipo: 'otro',
    fechaInicio: new Date('2024-07-21T12:00:00'),
    fechaFin: new Date('2024-07-21T14:00:00'),
    organizador: 'Corporación',
    destacado: true,
    estado: 'activo',
    ubicacion: { latitud: -33.42, longitud: -70.62, direccion: 'Parque Centro' }
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventoService = {
  obtenerEventos: async (): Promise<EventoCultural[]> => {
    await delay(500);
    return MOCK_EVENTOS;
  },

  obtenerProximosEventos: async (): Promise<EventoCultural[]> => {
    await delay(500);
    return MOCK_EVENTOS.filter(e => e.estado === 'activo').slice(0, 3);
  }
};
