import { useQuery } from '@tanstack/react-query';
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
