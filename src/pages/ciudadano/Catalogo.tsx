import React, { useState, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>('valorados');

  const handleCategoryChange = (category: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleRatingChange = (rating: number, isChecked: boolean) => {
    if (isChecked) {
      setMinRating(rating);
    } else {
      if (minRating === rating) setMinRating(0);
    }
  };

  const filteredAndSortedFichas = useMemo(() => {
    let result = [...fichas];

    // Búsqueda por texto
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(f => 
        f.nombre.toLowerCase().includes(term) || 
        f.descripcion.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (selectedCategories.length > 0) {
      result = result.filter(f => selectedCategories.includes(f.categoria));
    }

    // Filtro por valoración
    if (minRating > 0) {
      result = result.filter(f => (f.valoracionPromedio || 0) >= minRating);
    }

    // Ordenamiento
    if (sortOption === 'valorados') {
      result.sort((a, b) => (b.valoracionPromedio || 0) - (a.valoracionPromedio || 0));
    } else if (sortOption === 'recientes') {
      result.sort((a, b) => new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime());
    } else if (sortOption === 'az') {
      result.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return result;
  }, [fichas, searchTerm, selectedCategories, minRating, sortOption]);

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
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" checked={selectedCategories.includes('oficio')} onIonChange={e => handleCategoryChange('oficio', e.detail.checked)} />
                    <IonLabel>Oficios</IonLabel>
                  </IonItem>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" checked={selectedCategories.includes('cultor')} onIonChange={e => handleCategoryChange('cultor', e.detail.checked)} />
                    <IonLabel>Cultores</IonLabel>
                  </IonItem>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" checked={selectedCategories.includes('lugar')} onIonChange={e => handleCategoryChange('lugar', e.detail.checked)} />
                    <IonLabel>Lugares Patrimoniales</IonLabel>
                  </IonItem>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" checked={selectedCategories.includes('expresion')} onIonChange={e => handleCategoryChange('expresion', e.detail.checked)} />
                    <IonLabel>Expresiones</IonLabel>
                  </IonItem>
                </div>

                <div className="filtro-grupo">
                  <h3>Valoración Mínima</h3>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" checked={minRating === 5} onIonChange={e => handleRatingChange(5, e.detail.checked)} />
                    <IonLabel className="stars-label">
                      5 <IonIcon icon={star} className="star-filter"/>
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" checked={minRating === 4} onIonChange={e => handleRatingChange(4, e.detail.checked)} />
                    <IonLabel className="stars-label">
                      4 <IonIcon icon={star} className="star-filter"/> y más
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none" className="filtro-item">
                    <IonCheckbox slot="start" checked={minRating === 3} onIonChange={e => handleRatingChange(3, e.detail.checked)} />
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

                <IonSearchbar 
                  placeholder="Buscar..." 
                  className="custom-searchbar"
                  value={searchTerm}
                  onIonInput={e => setSearchTerm(e.detail.value!)}
                ></IonSearchbar>
                
                <IonSelect 
                  interface="popover" 
                  value={sortOption}
                  onIonChange={e => setSortOption(e.detail.value)}
                  className="custom-sort"
                >
                  <IonSelectOption value="valorados">Más valorados</IonSelectOption>
                  <IonSelectOption value="recientes">Más recientes</IonSelectOption>
                  <IonSelectOption value="az">Alfabético A-Z</IonSelectOption>
                </IonSelect>
              </div>

              <h3 className="resultados-count">{loading ? 'Cargando...' : `${filteredAndSortedFichas.length} elementos encontrados`}</h3>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <IonRow className="fichas-grid-container">
                  {filteredAndSortedFichas.map(ficha => (
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
