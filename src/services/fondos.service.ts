import api from './api';

// Servicio para manejar las operaciones relacionadas con los fondos concursables, como obtener postulaciones y convocatorias

export interface PostulacionFondoGestor {
  id: string;
  idUsuario: string;
  nombreOrganizacion: string;
  descripcionIniciativa: string;
  areaCultural: string;
  presupuestoEstimado: number;
  estado: string;
  fechaPostulacion: Date;
  fondoNombre: string;
  rutRepresentante: string;
  nombreRepresentante: string;
  desglose: { tipo: string, monto: number }[];
}

export const fondosService = {
  obtenerPostulacionesGestor: async (): Promise<any[]> => {
    const response = await api.get('/fondos/postulaciones');
    return response.data.map((d: any) => ({
      ...d,
      descripcionIniciativa: d.descripcion,
      areaCultural: 'General',
      fondoNombre: 'Fondo Concursable',
      desglose: []
    }));
  },
  
  obtenerConvocatoriasGestor: async () => {
    const response = await api.get('/fondos/convocatorias');
    return response.data;
  },

  obtenerPostulaciones: async (): Promise<any[]> => {
    const response = await api.get('/fondos/postulaciones');
    return response.data.map((d: any) => ({
      ...d,
      descripcionIniciativa: d.descripcion,
      areaCultural: 'General'
    }));
  },
  
  obtenerConvocatoriasActivas: async () => {
    const response = await api.get('/fondos/convocatorias');
    return response.data;
  }
};
