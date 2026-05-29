// Servicio para manejar las operaciones relacionadas con la transparencia, como obtener KPIs y publicaciones del panel

export interface KPI_Transparencia {
  ejecucionPresupuestaria: string;
  ejecucionMeta: string;
  tasaAprobacion: string;
  tasaAprobacionMeta: string;
  tiempoRespuesta: string;
  tiempoRespuestaMeta: string;
  participacionCiudadana: string;
  participacionMeta: string;
}

export interface PublicacionPanel {
  id: string;
  fecha: string;
  mensaje: string;
  tipo: string;
  visible: boolean;
}

import api from './api';

export const transparenciaService = {
  obtenerKPIsGestor: async (): Promise<KPI_Transparencia> => {
    const response = await api.get('/transparencia/kpis-gestor');
    return response.data;
  },

  obtenerKPIsCiudadano: async (): Promise<any> => {
    const response = await api.get('/transparencia/kpis-ciudadano');
    return response.data;
  },
  
  obtenerPublicaciones: async (): Promise<PublicacionPanel[]> => {
    const response = await api.get('/transparencia/publicaciones');
    return response.data;
  },

  crearPublicacion: async (data: { mensaje: string, tipo: string }): Promise<any> => {
    const response = await api.post('/transparencia/publicaciones', data);
    return response.data;
  },

  actualizarVisibilidad: async (id: string, visible: boolean): Promise<any> => {
    const response = await api.patch(`/transparencia/publicaciones/${id}/visibilidad`, { visible });
    return response.data;
  },

  obtenerGraficosGestor: async (): Promise<any> => {
    const response = await api.get('/transparencia/graficos-gestor');
    return response.data;
  },

  obtenerGraficosCiudadano: async (): Promise<any> => {
    const response = await api.get('/transparencia/graficos-ciudadano');
    return response.data;
  }
};
