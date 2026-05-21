import React from 'react';
import './Badge.css';

// Tipos de variantes para el badge, con valores predefinidos que se pueden extender fácilmente en el futuro.
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '', dot = false }) => {
  return (
    <span className={`ui-badge badge-${variant} ${className}`}>
      {dot && <span className="badge-dot"></span>}
      {children}
    </span>
  );
};

export default Badge;
