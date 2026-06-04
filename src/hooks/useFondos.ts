import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fondosService } from '../services/fondos.service';

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

export const useActualizarEstadoPostulacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string, estado: string }) => fondosService.actualizarEstadoPostulacion(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fondos', 'postulaciones', 'gestor'] });
      queryClient.invalidateQueries({ queryKey: ['fondos', 'convocatorias', 'gestor'] });
    },
  });
};
