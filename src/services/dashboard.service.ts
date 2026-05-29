// Servicio para manejar las operaciones relacionadas con el dashboard del gestor, como obtener resúmenes, KPIs y actividad reciente

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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const dashboardService = {
  obtenerResumenGestion: async (): Promise<ResumenGestion> => {
    const res = await fetch(`${API_URL}/dashboard/ciudadano`);
    if (!res.ok) throw new Error('Error al obtener resumen de gestión');
    return res.json();
  },
  obtenerKpisGestor: async (): Promise<KpisGestor> => {
    const res = await fetch(`${API_URL}/dashboard/kpis`);
    if (!res.ok) throw new Error('Error al obtener KPIs');
    return res.json();
  },
  obtenerActividadReciente: async (): Promise<ActividadReciente[]> => {
    const res = await fetch(`${API_URL}/dashboard/actividad`);
    if (!res.ok) throw new Error('Error al obtener actividad');
    return res.json();
  }
};
