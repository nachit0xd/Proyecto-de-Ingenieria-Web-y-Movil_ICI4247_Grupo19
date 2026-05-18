import React from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, 
  IonSearchbar, IonSelect, IonSelectOption, IonCheckbox, IonItem, IonLabel, IonButton, IonIcon
} from '@ionic/react';
import { filterOutline, star } from 'ionicons/icons';
import CardPatrimonio from '../../components/CardPatrimonio';
import './Catalogo.css';

// La página de catálogo muestra un listado de actividades culturales con filtros y opciones de búsqueda
const Catalogo: React.FC = () => {
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
                  {/* UX FIX: Cuadrados (Checkbox) para consistencia */}
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

              <h3 className="resultados-count">24 elementos encontrados</h3>

              <IonRow className="fichas-grid-container">
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <CardPatrimonio categoria="Oficio tradicional" titulo="Tejeduría en telar" descripcion="Técnica ancestral mapuche transmitida por generaciones" valoracion={4} />
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <CardPatrimonio categoria="Cultor local" titulo="Alfarería en greda" descripcion="Cerámica artesanal con técnicas prehispánicas locales" valoracion={3} />
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <CardPatrimonio categoria="Expresión cultural" titulo="Música folclórica" descripcion="Cueca chora interpretada por músicos locales de la comuna" valoracion={4} />
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <CardPatrimonio categoria="Expresión cultural" titulo="Obra de teatro" descripcion="Obra teatral interpretada por grupo juvenil basada en historia local" valoracion={4} />
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <CardPatrimonio categoria="Cultor local" titulo="Telar mapuche" descripcion="Tejido en telar vertical, basado en técnicas de la comunidad" valoracion={4} />
                </IonCol>
                <IonCol size="12" sizeMd="6" sizeLg="4">
                  <CardPatrimonio categoria="Cultor local" titulo="Tallado en madera" descripcion="Tallado artesanal con diferentes tips para crear figuras" valoracion={4} />
                </IonCol>
              </IonRow>

            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Catalogo;