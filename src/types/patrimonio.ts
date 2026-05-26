// Tipos relacionados con el patrimonio cultural, incluyendo fichas de patrimonio, categorías y estados de publicación

export type CategoriaPatrimonio = 'oficio' | 'lugar' | 'cultor' | 'expresion';

export type EstadoPublicacion = 'borrador' | 'publicado' | 'inactivo';

export interface UbicacionGeografica {
  latitud: number;
  longitud: number;
  direccion?: string;
}

export interface FichaPatrimonio {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaPatrimonio;
  ubicacion?: UbicacionGeografica;
  multimediaUrl?: string[]; // URLs a imágenes, audios o videos
  estado: EstadoPublicacion;
  valoracionPromedio?: number;
  totalValoraciones?: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
