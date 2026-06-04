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
  desglose: string;
  documentos?: string;
}

export const fondosService = {
  obtenerPostulacionesGestor: async (): Promise<any[]> => {
    const response = await api.get('/fondos/postulaciones');
    return response.data.map((d: any) => ({
      ...d,
      descripcionIniciativa: d.descripcion
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
      descripcionIniciativa: d.descripcion
    }));
  },
  
  obtenerConvocatoriasActivas: async () => {
    const response = await api.get('/fondos/convocatorias');
    return response.data.filter((f: any) => f.estado === 'abierto' || f.estado === 'Abierto');
  },

  postularFondo: async (datos: any): Promise<any> => {
    const response = await api.post('/fondos/postular', datos);
    return response.data;
  },

  crearFondo: async (datos: any): Promise<any> => {
    const response = await api.post('/fondos/convocatoria', datos);
    return response.data;
  },

  editarFondo: async (id: string, datos: any): Promise<any> => {
    const response = await api.put(`/fondos/convocatoria/${id}`, datos);
    return response.data;
  },

  eliminarFondo: async (id: string): Promise<any> => {
    const response = await api.delete(`/fondos/convocatoria/${id}`);
    return response.data;
  },

  actualizarEstadoPostulacion: async (id: string, estado: string): Promise<any> => {
    const response = await api.patch(`/fondos/postulaciones/${id}/estado`, { estado });
    return response.data;
  }
};
