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
  },

  crearEvento: async (evento: any): Promise<any> => {
    const response = await api.post('/eventos', evento);
    return response.data;
  },

  editarEvento: async (id: string, evento: any): Promise<any> => {
    const response = await api.put(`/eventos/${id}`, evento);
    return response.data;
  },

  eliminarEvento: async (id: string): Promise<any> => {
    const response = await api.delete(`/eventos/${id}`);
    return response.data;
  }
};
