import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

// Mock de CSS para evitar errores de importación en pruebas
describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Prueba</Badge>);
    expect(screen.getByText('Prueba')).toBeInTheDocument();
  });

  it('applies the correct default variant class', () => {
    const { container } = render(<Badge>Neutral</Badge>);
    expect(container.firstChild).toHaveClass('badge-neutral');
  });

  it('applies the specified variant class', () => {
    const { container } = render(<Badge variant="success">Aprobado</Badge>);
    expect(container.firstChild).toHaveClass('badge-success');
  });

  it('renders a dot when dot prop is true', () => {
    const { container } = render(<Badge dot>Con Punto</Badge>);
    // Buscar la clase del punto dentro del badge
    const dotElement = container.querySelector('.badge-dot');
    expect(dotElement).toBeInTheDocument();
  });
});
