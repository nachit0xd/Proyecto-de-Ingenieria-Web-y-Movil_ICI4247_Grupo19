import api from './api';

// Servicio para manejar las operaciones relacionadas con la comunidad, como obtener propuestas y votar

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

export const comunidadService = {
  obtenerPropuestasGestor: async (): Promise<any[]> => {
    const response = await api.get('/comunidad/todas');
    return response.data;
  },

  obtenerPropuestas: async (): Promise<any[]> => {
    const response = await api.get('/comunidad/todas');
    return response.data;
  },

  obtenerPropuestasPopulares: async (): Promise<any[]> => {
    const response = await api.get('/comunidad/populares');
    return response.data;
  },

  votarPropuesta: async (idPropuesta: string): Promise<boolean> => {
    await api.post(`/comunidad/votar/${idPropuesta}`);
    return true;
  }
};
