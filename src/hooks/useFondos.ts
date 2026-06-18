import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fondosService } from '../services/fondos.service';
import { crearNotificacionGlobal } from './useNotificaciones';

// Hooks personalizados para manejar la lógica de negocio relacionada con los fondos concursables, sus convocatorias y postulaciones.
export const usePostulacionesCiudadano = () => {
  return useQuery({
    queryKey: ['fondos', 'postulaciones', 'ciudadano'],
    queryFn: fondosService.obtenerPostulaciones,
  });
};

export const useConvocatoriasCiudadano = () => {
  return useQuery({
    queryKey: ['fondos', 'convocatorias', 'ciudadano'],
    queryFn: fondosService.obtenerConvocatoriasActivas,
  });
};

export const usePostularFondo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fondosService.postularFondo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fondos', 'postulaciones'] });
    },
  });
};

export const usePostulacionesGestor = () => {
  return useQuery({
    queryKey: ['fondos', 'postulaciones', 'gestor'],
    queryFn: fondosService.obtenerPostulacionesGestor,
  });
};

export const useConvocatoriasGestor = () => {
  return useQuery({
    queryKey: ['fondos', 'convocatorias', 'gestor'],
    queryFn: fondosService.obtenerConvocatoriasGestor,
  });
};

export const useCrearFondo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fondosService.crearFondo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fondos', 'convocatorias', 'gestor'] });
    },
  });
};

export const useEditarFondo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: string, datos: any }) => fondosService.editarFondo(id, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fondos', 'convocatorias', 'gestor'] });
    },
  });
};

export const useEliminarFondo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fondosService.eliminarFondo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fondos', 'convocatorias', 'gestor'] });
    },
  });
};

// Hook para que el gestor pueda actualizar el estado de una postulación (aprobada, rechazada, en revisión) y agregar comentarios.
export const useActualizarEstadoPostulacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string, estado: string }) => fondosService.actualizarEstadoPostulacion(id, estado),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fondos', 'postulaciones', 'gestor'] });
      queryClient.invalidateQueries({ queryKey: ['fondos', 'convocatorias', 'gestor'] });
      
      let estadoLegible = variables.estado;
      if (estadoLegible === 'aprobado') estadoLegible = 'Aprobada';
      if (estadoLegible === 'rechazado') estadoLegible = 'Rechazada';
      if (estadoLegible === 'revision') estadoLegible = 'En revisión';
      
      // Creamos una notificación global para el ciudadano que hizo la postulación, informándole del cambio de estado
      crearNotificacionGlobal({
        titulo: 'Actualización de Fondo',
        mensaje: `Tu postulación a fondo concursable ha sido marcada como: ${estadoLegible}.`,
        tipo: 'fondo',
        para: 'ciudadano'
      });
    },
  });
};
