import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patrimonioService } from '../services/patrimonio.service';

// Hooks personalizados para manejar la lógica de negocio relacionada con las fichas de patrimonio, incluyendo obtener fichas, crear, editar, cambiar estado, eliminar y valorar fichas.
export const useFichasPatrimonio = () => {
  return useQuery({
    queryKey: ['patrimonio', 'fichas'],
    queryFn: patrimonioService.obtenerFichas,
  });
};

export const useCrearFicha = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patrimonioService.crearFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio', 'fichas'] });
    },
  });
};

export const useEditarFicha = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => patrimonioService.editarFicha(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio', 'fichas'] });
    },
  });
};

export const useCambiarEstadoFicha = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: string, estado: string }) => patrimonioService.cambiarEstadoFicha(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio', 'fichas'] });
    },
  });
};

export const useEliminarFicha = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patrimonioService.eliminarFicha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio', 'fichas'] });
    },
  });
};

export const useValorarFicha = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, valoracion }: { id: string, valoracion: number }) => 
      patrimonioService.valorarFicha(id, valoracion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patrimonio', 'fichas'] });
    },
  });
};
