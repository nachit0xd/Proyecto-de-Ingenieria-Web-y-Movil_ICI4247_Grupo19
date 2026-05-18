import React from 'react';
import { IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import './CardPatrimonio.css';

// CardPatrimonio es un componente reutilizable que muestra información sobre un patrimonio cultural específico, como una feria cultural, monumento o sitio patrimonial

// Definimos qué datos (Props) necesita recibir esta tarjeta para funcionar
interface CardPatrimonioProps {
  categoria: string;
  titulo: string;
  descripcion: string;
  valoracion: number; // Un número del 0 al 5
  imagenUrl?: string; // Opcional, si no se pasa, se muestra un recuadro blanco en su lugar
}

const CardPatrimonio: React.FC<CardPatrimonioProps> = ({
  categoria,
  titulo,
  descripcion,
  valoracion,
  imagenUrl
}) => {
  
  // Pequeña función para dibujar las 5 estrellas, dependiendo de la valoración
  const renderEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <IonIcon 
          key={i} 
          icon={i <= valoracion ? star : starOutline} 
          className="star-icon" 
        />
      );
    }
    return estrellas;
  };

  return (
    <div className="card-patrimonio">
      
      {/* Mitad Superior: Contenedor de la Imagen */}
      <div 
        className="card-image-container"
        style={{ backgroundImage: imagenUrl ? `url(${imagenUrl})` : 'none' }}
      >
        {/* Muestra un recuadro blanco si no le pasamos una URL de imagen */}
        {!imagenUrl && <div className="img-placeholder"></div>}
      </div>

      {/* Mitad Inferior: Contenido Oscuro */}
      <div className="card-content">
        <span className="card-categoria">{categoria}</span>
        <h4 className="card-titulo">{titulo}</h4>
        <p className="card-descripcion">{descripcion}</p>
        
        <div className="card-footer">
          <div className="card-estrellas">
            {renderEstrellas()}
          </div>
        </div>
      </div>

    </div>
  );
};

export default CardPatrimonio;