// Tipos relacionados con los fondos concursables, incluyendo el estado de las postulaciones y la estructura de una postulación a un fondo

export type EstadoPostulacion = 'en_revision' | 'aprobada' | 'rechazada' | 'requiere_ajustes';

export interface PostulacionFondo {
  id: string;
  idUsuario: string;
  nombreOrganizacion: string;
  descripcionIniciativa: string;
  areaCultural: string;
  presupuestoEstimado: number;
  impactoEsperado: string;
  documentosUrl?: string[]; // URLs a archivos PDF
  estado: EstadoPostulacion;
  observacionesGestor?: string;
  fechaPostulacion: Date;
}
