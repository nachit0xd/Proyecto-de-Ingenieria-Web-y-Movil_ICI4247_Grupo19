import { useQuery } from '@tanstack/react-query';
import { transparenciaService } from '../services/transparencia.service';

// Hooks personalizados para manejar la lógica de negocio relacionada con la transparencia y sus métricas.
export const useKPIsTransparencia = () => {
  return useQuery({
    queryKey: ['transparencia', 'kpis'],
    queryFn: transparenciaService.obtenerKPIs,
  });
};

export const usePublicacionesTransparencia = () => {
  return useQuery({
    queryKey: ['transparencia', 'publicaciones'],
    queryFn: transparenciaService.obtenerPublicaciones,
  });
};
