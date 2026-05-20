// Servicio simulado de Transparencia para obtener KPIs y publicaciones del panel

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

const MOCK_KPIS: KPI_Transparencia = {
  ejecucionPresupuestaria: '$2,4 M',
  ejecucionMeta: 'de $10 M mensuales',
  tasaAprobacion: '42%',
  tasaAprobacionMeta: 'este mes',
  tiempoRespuesta: '5 días',
  tiempoRespuestaMeta: 'promedio en evaluar propuesta',
  participacionCiudadana: '1,204',
  participacionMeta: 'usuarios únicos activos este mes'
};

const MOCK_PUBLICACIONES: PublicacionPanel[] = [
  { id: '1', fecha: '15-05-26', mensaje: 'Nuevo Fondo de Nuevos Emprendedores disponible desde hoy hasta el 15 de Junio', visible: true },
  { id: '2', fecha: '14-05-26', mensaje: 'Propuesta "Feria Artesanal" escalada a convocatoria de fondos', visible: false },
  { id: '3', fecha: '13-05-26', mensaje: 'Nuevo Fondo Feria Libre disponible desde hoy hasta fin de mes', visible: true },
  { id: '4', fecha: '13-05-26', mensaje: 'Fondo de Artes 2026: resultados y planes futuros', visible: true },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transparenciaService = {
  obtenerKPIs: async (): Promise<KPI_Transparencia> => {
    await delay(300);
    return MOCK_KPIS;
  },
  
  obtenerPublicaciones: async (): Promise<PublicacionPanel[]> => {
    await delay(300);
    return MOCK_PUBLICACIONES;
  }
};
