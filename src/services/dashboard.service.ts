// Servicio para manejar las operaciones relacionadas con el dashboard del gestor, como obtener resúmenes, KPIs y actividad reciente
import api from './api';

export interface ResumenGestion {
  fichasPublicadas: number;
  crecimientoFichas: string;
  fondosAdjudicados: string;
  crecimientoFondos: string;
  propuestasActivas: number;
  votosTotales: string;
  eventosRealizados: number;
  crecimientoEventos: string;
}

export interface KpisGestor {
  postulacionesPendientes: number;
  propuestasPorModerar: number;
  fichasActivas: number;
  eventosSemana: number;
}

export interface ActividadReciente {
  id: string;
  fecha: Date;
  usuario: string;
  accion: 'Postulación' | 'Propuesta';
  titulo: string;
  estado: string;
}

// Función para obtener el resumen de gestión del dashboard, incluyendo KPIs y actividad reciente
export const dashboardService = {
  obtenerResumenGestion: async (): Promise<ResumenGestion> => {
    const res = await api.get('/dashboard/ciudadano');
    return res.data;
  },
  obtenerKpisGestor: async (): Promise<KpisGestor> => {
    const res = await api.get('/dashboard/kpis');
    return res.data;
  },
  obtenerActividadReciente: async (): Promise<ActividadReciente[]> => {
    const res = await api.get('/dashboard/actividad');
    return res.data;
  }
};
