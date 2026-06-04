import { FichaPatrimonio } from '../types';

import api from './api';

export const patrimonioService = {
  obtenerFichas: async (): Promise<FichaPatrimonio[]> => {
    const response = await api.get('/fichas');
    return response.data;
  },
  
  obtenerFichasDestacadas: async (): Promise<FichaPatrimonio[]> => {
    const response = await api.get('/fichas');
    const publicadas = response.data.filter((f: FichaPatrimonio) => f.estado === 'publicado');
    return publicadas.slice(0, 3);
  },

  crearFicha: async (data: Partial<FichaPatrimonio>): Promise<FichaPatrimonio> => {
    const response = await api.post('/fichas', data);
    return response.data;
  },

  editarFicha: async (id: string, data: Partial<FichaPatrimonio>): Promise<FichaPatrimonio> => {
    const response = await api.put(`/fichas/${id}`, data);
    return response.data;
  },

  cambiarEstadoFicha: async (id: string, estado: string): Promise<FichaPatrimonio> => {
    const response = await api.patch(`/fichas/${id}/estado`, { estado });
    return response.data;
  },

  eliminarFicha: async (id: string): Promise<void> => {
    await api.delete(`/fichas/${id}`);
  },

  valorarFicha: async (id: string, valoracion: number): Promise<FichaPatrimonio> => {
    const response = await api.post(`/fichas/${id}/valoracion`, { valoracion });
    return response.data.ficha;
  }
};
