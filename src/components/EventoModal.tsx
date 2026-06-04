import React, { useState, useEffect } from 'react';
import { IonModal, IonIcon, IonToast } from '@ionic/react';
import { closeOutline, calendarOutline, mapOutline, saveOutline, trashOutline } from 'ionicons/icons';
import { useCrearEvento, useEditarEvento, useEliminarEvento } from '../hooks/useEventos';
import { EventoCultural } from '../types';
import './EventoModal.css';

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventoAEditar: EventoCultural | null;
}

// Modal para crear o editar eventos culturales
const EventoModal: React.FC<EventoModalProps> = ({ isOpen, onClose, eventoAEditar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'patrimonio',
    estado: 'activo',
    fechaInicio: '',
    fechaFin: '',
    direccion: '',
    lat: -33.0472, // Coordenadas dummy
    lng: -71.6127,
  });

  const [toastMessage, setToastMessage] = useState('');
  const crearEvento = useCrearEvento();
  const editarEvento = useEditarEvento();
  const eliminarEvento = useEliminarEvento();

  // Cuando se abre el modal para editar, cargar los datos del evento en el formulario
  useEffect(() => {
    if (eventoAEditar) {
      setFormData({
        titulo: eventoAEditar.titulo,
        tipo: eventoAEditar.tipo,
        estado: eventoAEditar.estado,
        fechaInicio: new Date(eventoAEditar.fechaInicio).toISOString().slice(0, 16),
        fechaFin: new Date(eventoAEditar.fechaFin).toISOString().slice(0, 16),
        direccion: eventoAEditar.direccion || '',
        lat: eventoAEditar.lat || -33.0472,
        lng: eventoAEditar.lng || -71.6127,
      });
    } else {
      setFormData({
        titulo: '',
        tipo: 'patrimonio',
        estado: 'activo',
        fechaInicio: '',
        fechaFin: '',
        direccion: '',
        lat: -33.0472,
        lng: -71.6127,
      });
    }
  }, [eventoAEditar, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.fechaInicio || !formData.fechaFin) {
      setToastMessage('Por favor completa los campos obligatorios.');
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: new Date(formData.fechaFin).toISOString(),
      };

      if (eventoAEditar) {
        await editarEvento.mutateAsync({ id: eventoAEditar.id, data: dataToSave });
        setToastMessage('Evento actualizado con éxito');
      } else {
        await crearEvento.mutateAsync(dataToSave);
        setToastMessage('Evento creado con éxito');
      }
      onClose();
    } catch (error) {
      setToastMessage('Error al guardar el evento');
    }
  };

  const handleDelete = async () => {
    if (!eventoAEditar) return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${eventoAEditar.titulo}"?`)) {
      try {
        await eliminarEvento.mutateAsync(eventoAEditar.id);
        setToastMessage('Evento eliminado');
        onClose();
      } catch (error) {
        setToastMessage('Error al eliminar evento');
      }
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="evento-modal">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{eventoAEditar ? 'Editar Evento' : 'Nuevo Evento'}</h2>
          <button className="close-btn" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-group">
            <label>Título del Evento *</label>
            <input 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              placeholder="Ej. Feria Costumbrista..." 
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}>
                <option value="patrimonio">Espacio Patrimonial</option>
                <option value="feria">Feria</option>
                <option value="cultor">Actividad de Cultor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange}>
                <option value="activo">Activo / Próximo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><IonIcon icon={calendarOutline} /> Fecha y Hora de Inicio *</label>
              <input 
                type="datetime-local" 
                name="fechaInicio" 
                value={formData.fechaInicio} 
                onChange={handleChange} 
                required
              />
            </div>
            <div className="form-group">
              <label><IonIcon icon={calendarOutline} /> Fecha y Hora de Fin *</label>
              <input 
                type="datetime-local" 
                name="fechaFin" 
                value={formData.fechaFin} 
                onChange={handleChange} 
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><IonIcon icon={mapOutline} /> Dirección Física</label>
            <input 
              type="text" 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleChange} 
              placeholder="Ej. Plaza de Armas s/n" 
            />
          </div>
        </div>

        <div className="modal-footer">
          {eventoAEditar && (
            <button className="btn-eliminar" onClick={handleDelete} disabled={eliminarEvento.isPending}>
              <IonIcon icon={trashOutline} /> Eliminar
            </button>
          )}
          <div className="spacer"></div>
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button 
            className="btn-guardar" 
            onClick={handleSave} 
            disabled={crearEvento.isPending || editarEvento.isPending}
          >
            <IonIcon icon={saveOutline} /> Guardar
          </button>
        </div>
      </div>

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setToastMessage('')}
        position="bottom"
        color={toastMessage.includes('Error') ? 'danger' : 'success'}
      />
    </IonModal>
  );
};

export default EventoModal;
