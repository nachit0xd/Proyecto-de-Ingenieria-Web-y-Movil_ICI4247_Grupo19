import React, { useState, useEffect } from 'react';
import { IonModal, IonIcon } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import './FondoModal.css';

interface FondoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fondoAEditar?: any;
  onSave: (data: any) => Promise<void>;
}

// Modal para crear o editar un fondo cultural
const FondoModal: React.FC<FondoModalProps> = ({ isOpen, onClose, fondoAEditar, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    montoMaximo: '',
    presupuesto: '',
    cupos: '',
    estado: 'abierto'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (fondoAEditar) {
      setFormData({
        titulo: fondoAEditar.titulo || '',
        descripcion: fondoAEditar.descripcion || '',
        montoMaximo: fondoAEditar.montoMaximo?.toString() || '',
        presupuesto: fondoAEditar.presupuesto?.toString() || '',
        cupos: fondoAEditar.cupos?.toString() || '',
        estado: fondoAEditar.estado || 'abierto'
      });
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        montoMaximo: '',
        presupuesto: '',
        cupos: '',
        estado: 'abierto'
      });
    }
  }, [fondoAEditar, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        montoMaximo: parseInt(formData.montoMaximo) || 0,
        presupuesto: parseInt(formData.presupuesto) || 0,
        cupos: parseInt(formData.cupos) || 0,
        estado: formData.estado
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="fondo-modal">
      <div className="fondo-modal-content">
        <div className="fondo-modal-header">
          <h2>{fondoAEditar ? 'Editar Fondo' : 'Nuevo Fondo'}</h2>
          <button className="btn-close" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="fondo-modal-body">
          <div className="form-group">
            <label>Nombre de la convocatoria</label>
            <input 
              type="text" 
              required
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              placeholder="Ej. Fondo de Creación Artística 2024"
            />
          </div>

          <div className="form-group">
            <label>Descripción y objetivos</label>
            <textarea 
              rows={3}
              required
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Describe el propósito del fondo..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Presupuesto Total ($)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.presupuesto}
                onChange={e => setFormData({...formData, presupuesto: e.target.value})}
                placeholder="Ej. 10000000"
              />
            </div>
            
            <div className="form-group">
              <label>Monto Máx. por Postulante ($)</label>
              <input 
                type="number" 
                required
                min="0"
                value={formData.montoMaximo}
                onChange={e => setFormData({...formData, montoMaximo: e.target.value})}
                placeholder="Ej. 500000"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cupos Estimados</label>
              <input 
                type="number" 
                required
                min="1"
                value={formData.cupos}
                onChange={e => setFormData({...formData, cupos: e.target.value})}
                placeholder="Ej. 20"
              />
            </div>

            <div className="form-group">
              <label>Estado</label>
              <select 
                value={formData.estado}
                onChange={e => setFormData({...formData, estado: e.target.value})}
              >
                <option value="abierto">Abierto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          <div className="fondo-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (fondoAEditar ? 'Guardar Cambios' : 'Crear Fondo')}
            </button>
          </div>
        </form>
      </div>
    </IonModal>
  );
};

export default FondoModal;
