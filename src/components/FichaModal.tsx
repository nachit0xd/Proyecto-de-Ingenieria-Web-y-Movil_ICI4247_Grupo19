import React, { useState } from 'react';
import { IonModal, IonIcon, IonToast } from '@ionic/react';
import { star, starOutline, closeOutline } from 'ionicons/icons';
import { FichaPatrimonio } from '../types/patrimonio';
import { useValorarFicha } from '../hooks/usePatrimonio';
import './FichaModal.css';

interface FichaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ficha: FichaPatrimonio | null;
}

// Componente de modal para mostrar los detalles de una ficha de patrimonio cultural, incluyendo su nombre, descripción, categoría y valoración promedio. Permite a los usuarios valorar la ficha con estrellas y muestra el número total de valoraciones.
const FichaModal: React.FC<FichaModalProps> = ({ isOpen, onClose, ficha }) => {
  const valorarFicha = useValorarFicha();
  const [toastMessage, setToastMessage] = useState('');
  
  if (!ficha) return null;

  const renderEstrellas = () => {
    // Si la ficha no tiene valoracionPromedio, se asume que es 0
    const rating = Math.round(ficha.valoracionPromedio || 0);
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <button 
          key={i} 
          className="star-btn"
          onClick={() => handleRate(i)}
          disabled={valorarFicha.isPending}
        >
          <IonIcon 
            icon={i <= rating ? star : starOutline} 
            className={`star-icon-modal ${i <= rating ? 'active' : ''}`}
          />
        </button>
      );
    }
    return estrellas;
  };

  const handleRate = async (estrellas: number) => {
    try {
      await valorarFicha.mutateAsync({ id: ficha.id, valoracion: estrellas });
      setToastMessage('¡Gracias por tu valoración!');
    } catch (error) {
      setToastMessage('Error al enviar la valoración.');
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="public-ficha-modal">
      <div className="public-modal-wrapper">
        <div className="public-modal-header">
          <button className="close-modal-btn" onClick={onClose}>
            <IonIcon icon={closeOutline} />
          </button>
        </div>

        <div className="public-modal-body">
          <div className="ficha-hero">
            {/* Si no hay imagen, un recuadro de color representativo */}
            <div className="ficha-image-container">
            </div>
          </div>
          
          <div className="ficha-content">
            <span className="ficha-badge">{ficha.categoria}</span>
            <h2 className="ficha-title">{ficha.nombre}</h2>
            
            <p className="ficha-description">{ficha.descripcion}</p>

            <div className="ficha-rating-section">
              <h4>¿Qué te parece?</h4>
              <div className="rating-stars-container">
                {renderEstrellas()}
              </div>
              <p className="rating-count">
                {ficha.totalValoraciones || 0} {(ficha.totalValoraciones === 1) ? 'valoración' : 'valoraciones'} 
                {ficha.valoracionPromedio ? ` (${ficha.valoracionPromedio.toFixed(1)}/5)` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage}
        duration={2000}
        onDidDismiss={() => setToastMessage('')}
        color={toastMessage.includes('Error') ? 'danger' : 'success'}
        position="bottom"
      />
    </IonModal>
  );
};

export default FichaModal;
