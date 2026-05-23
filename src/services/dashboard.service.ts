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

const MOCK_RESUMEN: ResumenGestion = {
  fichasPublicadas: 23,
  crecimientoFichas: '+4 este mes',
  fondosAdjudicados: '$3.2M',
  crecimientoFondos: '+5 iniciativas',
  propuestasActivas: 19,
  votosTotales: '1,710 votos',
  eventosRealizados: 10,
  crecimientoEventos: '+3 vs mes anterior'
};

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
  estado: 'Pendiente de revisión' | 'Aprobado' | 'Rechazado';
}

const MOCK_KPIS: KpisGestor = {
  postulacionesPendientes: 19,
  propuestasPorModerar: 4,
  fichasActivas: 12,
  eventosSemana: 2
};

const MOCK_ACTIVIDAD: ActividadReciente[] = [
  { id: '1', fecha: new Date('2026-05-14'), usuario: 'seba_gonzales', accion: 'Postulación', titulo: 'Fondo Cultural Mayo 2026', estado: 'Pendiente de revisión' },
  { id: '2', fecha: new Date('2026-05-14'), usuario: 'Maria_Soto', accion: 'Propuesta', titulo: 'Evento música folclórica', estado: 'Pendiente de revisión' },
  { id: '3', fecha: new Date('2026-05-12'), usuario: 'Ignacio_Ca', accion: 'Postulación', titulo: 'Fondo Cultural Mayo 2026', estado: 'Aprobado' },
  { id: '4', fecha: new Date('2026-05-11'), usuario: 'matias_ramirez', accion: 'Postulación', titulo: 'Fondo Cultural Mayo 2026', estado: 'Pendiente de revisión' },
  { id: '5', fecha: new Date('2026-05-09'), usuario: 'seba_gonzales', accion: 'Propuesta', titulo: 'Mural artístico plaza Central', estado: 'Aprobado' }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  obtenerResumenGestion: async (): Promise<ResumenGestion> => {
    await delay(500);
    return MOCK_RESUMEN;
  },
  obtenerKpisGestor: async (): Promise<KpisGestor> => {
    await delay(500);
    return MOCK_KPIS;
  },
  obtenerActividadReciente: async (): Promise<ActividadReciente[]> => {
    await delay(500);
    return MOCK_ACTIVIDAD;
  }
};
