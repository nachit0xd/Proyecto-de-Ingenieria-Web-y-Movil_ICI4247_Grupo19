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
  visible: boolean;
}

import api from './api';

export const transparenciaService = {
  obtenerKPIs: async (): Promise<KPI_Transparencia> => {
    const response = await api.get('/transparencia/kpis');
    return response.data;
  },
  
  obtenerPublicaciones: async (): Promise<PublicacionPanel[]> => {
    // Keep mock for publications for now since it's not in the backend yet
    return [
      { id: '1', fecha: '15-05-26', mensaje: 'Nuevo Fondo de Nuevos Emprendedores disponible', visible: true }
    ];
  }
};
