import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

// Hooks personalizados para manejar la lógica de negocio relacionada con el dashboard y sus métricas.
export const useResumenGestion = () => {
  return useQuery({
    queryKey: ['dashboard', 'resumen'],
    queryFn: dashboardService.obtenerResumenGestion,
  });
};

export const useKpisGestor = () => {
  return useQuery({
    queryKey: ['dashboard', 'kpis', 'gestor'],
    queryFn: dashboardService.obtenerKpisGestor,
    staleTime: 0,
    refetchOnMount: 'always'
  });
};

export const useActividadReciente = () => {
  return useQuery({
    queryKey: ['dashboard', 'actividad'],
    queryFn: dashboardService.obtenerActividadReciente,
    staleTime: 0,
    refetchOnMount: 'always'
  });
};
