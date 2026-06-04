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
      queryClient.invalidateQueries({ queryKey: ['propuestas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-votos'] });
    },
  });
};

export const useAnularVoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: comunidadService.anularVoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propuestas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-votos'] });
    },
  });
};

export const useMisVotos = () => {
  return useQuery({
    queryKey: ['mis-votos'],
    queryFn: comunidadService.obtenerMisVotos,
  });
};

export const useCrearPropuesta = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: comunidadService.crearPropuesta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propuestas'] });
    },
  });
};

export const useActualizarPropuestaGestor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: { estado?: string, nuevoComentario?: string } }) => 
      comunidadService.actualizarPropuestaGestor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propuestas'] });
    },
  });
};
