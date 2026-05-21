import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comunidadService } from '../services/comunidad.service';

// Hooks personalizados para manejar la lógica de negocio relacionada con la comunidad y sus propuestas.
export const usePropuestasGestor = () => {
  return useQuery({
    queryKey: ['propuestas', 'gestor'],
    queryFn: comunidadService.obtenerPropuestasGestor,
  });
};

export const usePropuestasCiudadano = () => {
  return useQuery({
    queryKey: ['propuestas', 'ciudadano'],
    queryFn: comunidadService.obtenerPropuestas,
  });
};

export const usePropuestasPopulares = () => {
  return useQuery({
    queryKey: ['propuestas', 'populares'],
    queryFn: comunidadService.obtenerPropuestasPopulares,
  });
};

export const useVotarPropuesta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: comunidadService.votarPropuesta,
    onSuccess: () => {
      // Invalidate queries so they refetch the updated vote counts
      queryClient.invalidateQueries({ queryKey: ['propuestas'] });
    },
  });
};
