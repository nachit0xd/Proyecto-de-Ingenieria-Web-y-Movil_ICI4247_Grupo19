import { UbicacionGeografica } from './patrimonio';

// Definición de tipos relacionados con eventos culturales, incluyendo el tipo de evento, su estructura y estado dentro del sistema

export type TipoEvento = 'feria' | 'taller' | 'festividad' | 'exposicion' | 'otro';

export interface EventoCultural {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoEvento;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion?: UbicacionGeografica;
  organizador: string;
  imagenUrl?: string;
  destacado: boolean;
  estado: 'activo' | 'cancelado' | 'finalizado';
}
