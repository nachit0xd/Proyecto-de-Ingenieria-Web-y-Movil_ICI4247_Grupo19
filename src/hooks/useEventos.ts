import { useQuery } from '@tanstack/react-query';
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
