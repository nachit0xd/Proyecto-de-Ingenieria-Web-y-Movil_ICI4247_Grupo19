import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonSearchbar, IonSelect, IonSelectOption, IonCheckbox, IonItem, IonLabel, IonButton, IonIcon, IonSpinner
} from '@ionic/react';
import { filterOutline, star } from 'ionicons/icons';
import CardPatrimonio from '../../components/CardPatrimonio';
import FichaModal from '../../components/FichaModal';
import { FichaPatrimonio } from '../../types/patrimonio';
import './Catalogo.css';

import { useFichasPatrimonio } from '../../hooks/usePatrimonio';

// Página de catálogo patrimonial que muestra las fichas aprobadas
const Catalogo: React.FC = () => {
  const { data: fichas = [], isLoading: loading } = useFichasPatrimonio();
  
  const [selectedFicha, setSelectedFicha] = useState<FichaPatrimonio | null>(null);

  return (
    <IonPage>
      <IonContent fullscreen className="catalogo-page">
        <IonGrid className="ion-padding max-width-container">
          <IonRow>
            
            {/* COLUMNA IZQUIERDA: FILTROS */}
            <IonCol size="12" sizeMd="3" className="filtros-sidebar ion-hide-md-down">
              <div className="filtros-container">
                <h2>Filtros</h2>
                
                <div className="filtro-grupo">
                  <h3>Categoría</h3>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" checked /><IonLabel>Oficios</IonLabel></IonItem>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" checked /><IonLabel>Cultores</IonLabel></IonItem>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" /><IonLabel>Ferias</IonLabel></IonItem>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" /><IonLabel>Patrimonio</IonLabel></IonItem>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" checked /><IonLabel>Expresión</IonLabel></IonItem>
                </div>

                <div className="filtro-grupo">
                  <h3>Sector</h3>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" /><IonLabel>Norte</IonLabel></IonItem>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" /><IonLabel>Centro</IonLabel></IonItem>
                  <IonItem lines="none" className="filtro-item"><IonCheckbox slot="start" /><IonLabel>Sur</IonLabel></IonItem>
                </div>

                <div className="filtro-grupo">
                  <h3>Valoración</h3>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" />
                    <IonLabel className="stars-label">
                      5 <IonIcon icon={star} className="star-filter"/>
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" />
                    <IonLabel className="stars-label">
                      4 <IonIcon icon={star} className="star-filter"/> y más
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" />
                    <IonLabel className="stars-label">
                      3 <IonIcon icon={star} className="star-filter"/> y más
                    </IonLabel>
                  </IonItem>
                </div>
              </div>
            </IonCol>

            {/* COLUMNA DERECHA: RESULTADOS */}
            <IonCol size="12" sizeMd="9" className="resultados-container">
              
              <div className="search-sort-bar">
                <IonButton fill="outline" color="dark" className="ion-hide-md-up btn-filtros-movil">
                  <IonIcon icon={filterOutline} slot="start" /> Filtros
                </IonButton>

                <IonSearchbar placeholder="Buscar..." className="custom-searchbar"></IonSearchbar>
                
                <IonSelect interface="popover" placeholder="Más valorados" className="custom-sort">
                  <IonSelectOption value="valorados">Más valorados</IonSelectOption>
                  <IonSelectOption value="recientes">Más recientes</IonSelectOption>
                  <IonSelectOption value="az">Alfabético A-Z</IonSelectOption>
                </IonSelect>
              </div>

              <h3 className="resultados-count">{loading ? 'Cargando...' : `${fichas.length} elementos encontrados`}</h3>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <IonRow className="fichas-grid-container">
                  {fichas.map(ficha => (
                    <IonCol size="12" sizeMd="6" sizeLg="4" key={ficha.id}>
                      <CardPatrimonio 
                        categoria={ficha.categoria} 
                        titulo={ficha.nombre} 
                        descripcion={ficha.descripcion} 
                        valoracion={Math.round(ficha.valoracionPromedio || 0)} 
                        onClick={() => setSelectedFicha(ficha as FichaPatrimonio)}
                      />
                    </IonCol>
                  ))}
                </IonRow>
              )}

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>

      <FichaModal 
        isOpen={!!selectedFicha} 
        onClose={() => setSelectedFicha(null)} 
        ficha={selectedFicha} 
      />
    </IonPage>
  );
};

export default Catalogo;
