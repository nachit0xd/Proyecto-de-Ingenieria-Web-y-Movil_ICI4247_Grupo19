import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventoService } from '../services/evento.service';

// Hooks personalizados para manejar la lógica de negocio relacionada con los eventos y su gestión.
export const useEventos = () => {
  return useQuery({
    queryKey: ['eventos'],
    queryFn: eventoService.obtenerEventos,
  });
};

export const useProximosEventos = () => {
  return useQuery({
    queryKey: ['eventos', 'proximos'],
    queryFn: eventoService.obtenerProximosEventos,
  });
};

export const useCrearEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventoService.crearEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
    },
  });
};

export const useEditarEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => eventoService.editarEvento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
    },
  });
};

export const useEliminarEvento = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eventoService.eliminarEvento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventos'] });
    },
  });
};
