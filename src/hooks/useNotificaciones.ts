import { useState, useEffect } from 'react';

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  tipo: 'propuesta' | 'fondo' | 'sistema';
  para: 'ciudadano' | 'gestor' | 'todos';
}

// Hook personalizado para manejar notificaciones, almacenándolas en localStorage para persistencia y sincronización entre pestañas.
// Proporciona funciones para marcar notificaciones como leídas individualmente o todas a la vez, y para crear nuevas notificaciones globales.

// Módulo independiente para crear notificaciones sin necesidad de usar el Hook (útil en funciones de mutación)
export const crearNotificacionGlobal = (notif: Omit<Notificacion, 'id' | 'fecha' | 'leida'>) => {
  const stored = localStorage.getItem('app_notificaciones');
  const all = stored ? JSON.parse(stored) : [];
  const nueva: Notificacion = {
    ...notif,
    id: Math.random().toString(36).substr(2, 9),
    fecha: new Date().toISOString(),
    leida: false
  };
  all.unshift(nueva);
  localStorage.setItem('app_notificaciones', JSON.stringify(all));
  window.dispatchEvent(new Event('storage'));
};

export const useNotificaciones = (rol: 'ciudadano' | 'gestor') => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const loadNotifs = () => {
    const stored = localStorage.getItem('app_notificaciones');
    if (stored) {
      const all = JSON.parse(stored) as Notificacion[];
      setNotificaciones(all.filter(n => n.para === rol || n.para === 'todos'));
    }
  };

  useEffect(() => {
    loadNotifs();
    // Escuchamos eventos storage para sincronización entre pestañas (Gestor aprueba -> Ciudadano recibe)
    window.addEventListener('storage', loadNotifs);
    return () => window.removeEventListener('storage', loadNotifs);
  }, [rol]);

  const marcarComoLeida = (id: string) => {
    const stored = localStorage.getItem('app_notificaciones');
    if (stored) {
      const all = JSON.parse(stored) as Notificacion[];
      const updated = all.map(n => n.id === id ? { ...n, leida: true } : n);
      localStorage.setItem('app_notificaciones', JSON.stringify(updated));
      setNotificaciones(updated.filter(n => n.para === rol || n.para === 'todos'));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const marcarTodasComoLeidas = () => {
    const stored = localStorage.getItem('app_notificaciones');
    if (stored) {
      const all = JSON.parse(stored) as Notificacion[];
      const updated = all.map(n => (n.para === rol || n.para === 'todos') ? { ...n, leida: true } : n);
      localStorage.setItem('app_notificaciones', JSON.stringify(updated));
      loadNotifs();
      window.dispatchEvent(new Event('storage'));
    }
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  return { notificaciones, noLeidas, marcarComoLeida, marcarTodasComoLeidas, crearNotificacion: crearNotificacionGlobal };
};
