import { PropuestaCiudadana } from '../types';

// Servicio simulado para obtener propuestas ciudadanas, con datos de ejemplo y un retraso artificial para simular una llamada a API real
export interface PropuestaComunidadGestor {
  id: string;
  titulo: string;
  descripcion: string;
  votos: number;
  categoria: string;
  autor: string;
  fechaPublicacion: Date;
  estado: string;
  comentariosGestor: string[];
}

const MOCK_PROPUESTAS: PropuestaComunidadGestor[] = [
  {
    id: 'p1',
    titulo: 'Taller de Baile',
    descripcion: 'Taller de baile en la plaza principal todos los sábados',
    votos: 150,
    categoria: 'Cultor',
    autor: 'María Sánchez',
    fechaPublicacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    estado: 'pendiente',
    comentariosGestor: []
  },
  {
    id: 'p2',
    titulo: 'Estatua en Plaza',
    descripcion: 'Restauración de la estatua en la plaza central',
    votos: 152,
    categoria: 'E. Patrimonial',
    autor: 'María Soto',
    fechaPublicacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    estado: 'en_revision',
    comentariosGestor: []
  },
  {
    id: 'p3',
    titulo: 'Feria Artesanal Colegio San Diego',
    descripcion: 'Propongo realizar una feria artesanal con diferentes cultores locales en el patio del Colegio San Diego durante los días Sábado y Domingo, entre 11:00 y 16:00 hrs',
    votos: 159,
    categoria: 'Feria',
    autor: 'María Sandoval',
    fechaPublicacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    estado: 'aprobado',
    comentariosGestor: ['Tras alcanzar el umbral y revisarla con cuidado, se aprueba la propuesta y escala a recibir fondos (Por: Héctor Castillo, hace 1 día)']
  },
  {
    id: 'p4',
    titulo: 'Taller de Canto',
    descripcion: 'Clases de canto para niños',
    votos: 19,
    categoria: 'Cultor',
    autor: 'María Silva',
    fechaPublicacion: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    estado: 'rechazado',
    comentariosGestor: []
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const comunidadService = {
  obtenerPropuestasGestor: async (): Promise<PropuestaComunidadGestor[]> => {
    await delay(300);
    return MOCK_PROPUESTAS;
  },

  obtenerPropuestas: async (): Promise<any[]> => {
    await delay(500);
    return MOCK_PROPUESTAS.map(p => ({
      id: p.id,
      idUsuario: 'u1',
      titulo: p.titulo,
      descripcion: p.descripcion,
      votosTotales: p.votos,
      estado: p.estado,
      fechaCreacion: p.fechaPublicacion
    }));
  },
  obtenerPropuestasPopulares: async (): Promise<any[]> => {
    await delay(500);
    return MOCK_PROPUESTAS.map(p => ({
      id: p.id,
      idUsuario: 'u1',
      titulo: p.titulo,
      descripcion: p.descripcion,
      votosTotales: p.votos,
      estado: p.estado,
      fechaCreacion: p.fechaPublicacion
    })).sort((a, b) => b.votosTotales - a.votosTotales).slice(0, 3);
  },
  votarPropuesta: async (idPropuesta: string): Promise<boolean> => {
    await delay(300);
    return true;
  }
};
