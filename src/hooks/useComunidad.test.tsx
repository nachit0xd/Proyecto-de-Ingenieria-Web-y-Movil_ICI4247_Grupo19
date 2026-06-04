import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePropuestasCiudadano } from './useComunidad';
import { AllTheProviders } from '../test-utils';
import { comunidadService } from '../services/comunidad.service';

// Mock de comunidadService para evitar llamadas asíncronas reales a la capa simulada.
vi.mock('../services/comunidad.service', () => ({
  comunidadService: {
    obtenerPropuestas: vi.fn(),
  },
}));

describe('useComunidad Hooks', () => {
  it('usePropuestasCiudadano fetches data successfully', async () => {
    // Definimos el valor falso que retornará nuestro servicio mockeado.
    const mockData = [
      {
        id: '1',
        titulo: 'Festival de Primavera',
        descripcion: 'Un festival de música',
        categoria: 'Música',
        autor: 'Juan Pérez',
        votos: 120,
        fechaPublicacion: new Date('2023-10-01'),
        estado: 'aprobado'
      }
    ];

    (comunidadService.obtenerPropuestas as any).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => usePropuestasCiudadano(), {
      wrapper: AllTheProviders,
    });

    // Al inicio debe estar en estado de carga.
    expect(result.current.isLoading).toBe(true);

    // Esperamos a que la petición se resuelva y `isSuccess` sea verdadero.
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verificamos que los datos devueltos coincidan con el mock.
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });
});
