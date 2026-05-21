import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButton from './ActionButton';

// Mock de CSS para evitar errores de importación en pruebas
describe('ActionButton Component', () => {
  it('renders children correctly', () => {
    render(<ActionButton>Click Me</ActionButton>);
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<ActionButton onClick={handleClick}>Acción</ActionButton>);
    
    const button = screen.getByRole('button', { name: 'Acción' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary and md classes by default', () => {
    const { container } = render(<ActionButton>Default</ActionButton>);
    expect(container.firstChild).toHaveClass('btn-primary');
    expect(container.firstChild).toHaveClass('btn-size-md');
  });

  it('applies custom variant and size classes', () => {
    const { container } = render(
      <ActionButton variant="danger" size="lg">Eliminar</ActionButton>
    );
    expect(container.firstChild).toHaveClass('btn-danger');
    expect(container.firstChild).toHaveClass('btn-size-lg');
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    const { container } = render(<ActionButton fullWidth>Bloque</ActionButton>);
    expect(container.firstChild).toHaveClass('btn-full-width');
  });

  it('passes standard HTML attributes correctly', () => {
    render(<ActionButton disabled type="submit">Enviar</ActionButton>);
    const button = screen.getByRole('button', { name: 'Enviar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'submit');
  });
});
