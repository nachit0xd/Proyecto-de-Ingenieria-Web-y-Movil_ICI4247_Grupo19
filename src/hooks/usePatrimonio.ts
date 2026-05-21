import { useQuery } from '@tanstack/react-query';
import { patrimonioService } from '../services/patrimonio.service';

// Hooks personalizados para manejar la lógica de negocio relacionada con el patrimonio cultural y sus fichas.
export const useFichasPatrimonio = () => {
  return useQuery({
    queryKey: ['patrimonio', 'fichas'],
    queryFn: patrimonioService.obtenerFichas,
  });
};
