import api from './api';

// Servicio para manejar las operaciones relacionadas con los eventos culturales, como obtener eventos y próximos eventos

export const eventoService = {
  obtenerEventos: async (): Promise<any[]> => {
    const response = await api.get('/eventos');
    return response.data;
  },

  obtenerProximosEventos: async (): Promise<any[]> => {
    const response = await api.get('/eventos');
    return response.data.slice(0, 5); // Simplification for now
  }
};
