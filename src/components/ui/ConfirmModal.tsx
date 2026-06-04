import React from 'react';
import { IonModal, IonIcon } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import './ConfirmModal.css';

// Props para el ConfirmModal, con valores por defecto para la mayoría de las propiedades para facilitar su uso en casos comunes.
interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirmar Acción',
  message = '¿Estás seguro de que deseas realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  icon = alertCircleOutline
}) => {
  return (
    <IonModal 
      isOpen={isOpen} 
      onDidDismiss={onCancel} 
      className="ui-confirm-modal" 
      style={{ '--height': 'auto', '--width': '400px', '--border-radius': '12px' }}
    >
      <div className="ui-confirm-modal-content">
        <IonIcon icon={icon} className="ui-modal-icon" />
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="ui-modal-actions">
          <button className="ui-btn-cancel" onClick={onCancel}>{cancelText}</button>
          <button className="ui-btn-confirm" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </IonModal>
  );
};

export default ConfirmModal;
