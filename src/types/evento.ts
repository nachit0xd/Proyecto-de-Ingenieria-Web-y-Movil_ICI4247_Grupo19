// Definición de tipos relacionados con eventos culturales, incluyendo el tipo de evento, su estructura y estado dentro del sistema

export type TipoEvento = 'feria' | 'taller' | 'festividad' | 'exposicion' | 'otro';

export interface EventoCultural {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  fechaInicio: Date;
  fechaFin: Date;
  direccion?: string;
  lat?: number;
  lng?: number;
  destacado: boolean;
  estado: 'activo' | 'cancelado' | 'finalizado';
}
