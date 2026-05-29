import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transparenciaService } from '../services/transparencia.service';

// Hooks personalizados para manejar la lógica de negocio relacionada con la transparencia y sus métricas.
export const useKPIsGestor = () => {
  return useQuery({
    queryKey: ['transparencia', 'kpis-gestor'],
    queryFn: transparenciaService.obtenerKPIsGestor,
  });
};

export const useKPIsCiudadano = () => {
  return useQuery({
    queryKey: ['transparencia', 'kpis-ciudadano'],
    queryFn: transparenciaService.obtenerKPIsCiudadano,
  });
};

export const usePublicacionesTransparencia = () => {
  return useQuery({
    queryKey: ['transparencia', 'publicaciones'],
    queryFn: transparenciaService.obtenerPublicaciones,
  });
};

export const useCrearPublicacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { mensaje: string, tipo: string }) => transparenciaService.crearPublicacion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia', 'publicaciones'] });
    },
  });
};

export const useActualizarVisibilidad = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, visible }: { id: string, visible: boolean }) => transparenciaService.actualizarVisibilidad(id, visible),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparencia', 'publicaciones'] });
    },
  });
};

export const useGraficosGestor = () => {
  return useQuery({
    queryKey: ['transparencia', 'graficos-gestor'],
    queryFn: transparenciaService.obtenerGraficosGestor,
  });
};

export const useGraficosCiudadano = () => {
  return useQuery({
    queryKey: ['transparencia', 'graficos-ciudadano'],
    queryFn: transparenciaService.obtenerGraficosCiudadano,
  });
};
