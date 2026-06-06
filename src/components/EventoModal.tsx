import React, { useState, useEffect } from 'react';
import { IonModal, IonIcon, IonToast, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonDatetime, IonButton } from '@ionic/react';
import { closeOutline, calendarOutline, mapOutline, saveOutline, trashOutline } from 'ionicons/icons';
import { useCrearEvento, useEditarEvento, useEliminarEvento } from '../hooks/useEventos';
import { EventoCultural } from '../types';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './EventoModal.css';

// Importamos los íconos de Leaflet para evitar problemas con Vite y React-Leaflet en modales
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuración de los íconos de Leaflet para que funcionen correctamente en el modal
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = ({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} />;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 250);
  }, [map]);
  return null;
};

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventoAEditar: EventoCultural | null;
}

// Modal para crear o editar eventos culturales, con campos para título, categoría, estado, fechas, dirección y ubicación en el mapa.
// También permite eliminar eventos existentes.
const EventoModal: React.FC<EventoModalProps> = ({ isOpen, onClose, eventoAEditar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'patrimonio',
    estado: 'activo',
    fechaInicio: '',
    fechaFin: '',
    direccion: '',
    lat: -33.4489, 
    lng: -70.6693,
  });

  const [toastMessage, setToastMessage] = useState('');
  const crearEvento = useCrearEvento();
  const editarEvento = useEditarEvento();
  const eliminarEvento = useEliminarEvento();

  // Cuando se abre el modal para editar, carga los datos del evento en el formulario
  useEffect(() => {
    if (eventoAEditar) {
      setFormData({
        titulo: eventoAEditar.titulo,
        tipo: eventoAEditar.tipo,
        estado: eventoAEditar.estado,
        fechaInicio: new Date(eventoAEditar.fechaInicio).toISOString().slice(0, 16),
        fechaFin: new Date(eventoAEditar.fechaFin).toISOString().slice(0, 16),
        direccion: eventoAEditar.direccion || '',
        lat: eventoAEditar.lat || -33.4489,
        lng: eventoAEditar.lng || -70.6693,
      });
    } else {
      setFormData({
        titulo: '',
        tipo: 'patrimonio',
        estado: 'activo',
        fechaInicio: '',
        fechaFin: '',
        direccion: '',
        lat: -33.4489,
        lng: -70.6693,
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

          {/* Mapa para seleccionar ubicación exacta del evento */}
          <div className="form-group">
            <label>Ubicación exacta en el Mapa</label>
            <div style={{ height: '250px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--app-border-color)', marginTop: '10px' }}>
              {isOpen && (
                <MapContainer center={[formData.lat, formData.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapResizer />
                  <LocationPicker 
                    position={[formData.lat, formData.lng]} 
                    setPosition={(pos) => setFormData({...formData, lat: pos[0], lng: pos[1]})} 
                  />
                </MapContainer>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)', marginTop: '5px' }}>
              Haz clic en el mapa para fijar el pin en la ubicación del evento.
            </p>
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
