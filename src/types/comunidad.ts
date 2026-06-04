// Tipos relacionados con la comunidad, incluyendo propuestas ciudadanas y valoraciones de eventos o fichas patrimoniales

export type EstadoPropuesta = 'pendiente' | 'aprobada' | 'rechazada' | 'duplicada' | 'escalada_fondo';

export interface PropuestaCiudadana {
  id: string;
  idUsuario: string;
  titulo: string;
  descripcion: string;
  votos: number;
  estado: EstadoPropuesta;
  respuestaGestor?: string;
  fechaCreacion: Date;
}

export type EstadoRevisionValoracion = 'pendiente' | 'aprobada' | 'rechazada';

export interface Valoracion {
  id: string;
  idReferencia: string; // ID del evento o ficha patrimonial
  tipoReferencia: 'ficha' | 'evento';
  idUsuario: string;
  puntuacion: number; // 1 al 5
  comentario: string;
  estadoRevision: EstadoRevisionValoracion;
  fechaCreacion: Date;
}
