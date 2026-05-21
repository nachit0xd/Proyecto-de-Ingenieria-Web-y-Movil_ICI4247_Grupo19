import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import { personCircleOutline, searchOutline, createOutline, eyeOutline, trashOutline, arrowUpOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import './Catalogo.css';

import { useFichasPatrimonio } from '../../hooks/usePatrimonio';
import { FichaPatrimonio } from '../../types';

// Componente principal de la página de Catálogo para gestores municipales
// Muestra una tabla con fichas de patrimonio cultural y permite gestionar su visibilidad, edición y eliminación
const CatalogoGestor: React.FC = () => {
  const { data: fichasData = [], isLoading: loading } = useFichasPatrimonio();
  
  const [fichas, setFichas] = useState<FichaPatrimonio[]>([]);

  useEffect(() => {
    if (fichasData.length > 0) {
      setFichas(fichasData);
    }
  }, [fichasData]);

  const toggleVisibilidad = (id: string) => {
    setFichas(fichas.map(f => f.id === id ? { ...f, estado: f.estado === 'publicado' ? 'borrador' : 'publicado' } : f));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
  };

  return (
    <IonPage>
      <header className="gestor-header">
        <div className="gestor-brand">
          <h1>Cultura Municipal</h1>
          <span className="gestor-role-badge">Gestor Municipal</span>
        </div>
        <div className="gestor-user-menu">
          <IonIcon icon={personCircleOutline} className="avatar-icon" />
        </div>
      </header>

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          
          <GestorSidebar />

          <main className="gestor-main-content">
            
            <div className="catalogo-header-row">
              <div>
                <h2 className="section-title">Gestión del Catálogo</h2>
                <p className="section-subtitle-count">{loading ? 'Cargando fichas...' : `Mostrando ${fichas.length} fichas publicadas`}</p>
              </div>
              <button className="btn-crear-ficha">+ Crear nueva ficha</button>
            </div>

            <div className="catalogo-toolbar">
              <div className="search-box-container">
                <IonIcon icon={searchOutline} className="search-icon-inside" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, cultor, palabra clave..." 
                  className="toolbar-search-input"
                />
              </div>
              
              <select className="toolbar-select" defaultValue="todas">
                <option value="todas">Todas las categorías</option>
                <option value="cultor">Cultor</option>
                <option value="patrimonio">Patrimonio</option>
                <option value="feria">Feria</option>
              </select>

              <button className="btn-exportar-catalogo" title="Exportar datos">
                <IonIcon icon={arrowUpOutline} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <div className="table-scroll-container">
                <table className="catalogo-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}></th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th style={{ width: '150px', textAlign: 'center' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fichas.map((ficha, index) => (
                      <tr key={`${ficha.id}-${index}`}>
                        <td className="cell-avatar">
                          <div className="avatar-placeholder-blue">🧵</div>
                        </td>
                        <td className="cell-name"><strong>{ficha.nombre}</strong></td>
                        <td>
                          <span className="badge-categoria-cultor">{ficha.categoria}</span>
                        </td>
                        <td className="cell-date">{formatDate(ficha.fechaCreacion)}</td>
                        <td>
                          <button 
                            className={`btn-status-toggle ${ficha.estado === 'publicado' ? 'v-visible' : 'v-oculto'}`}
                            onClick={() => toggleVisibilidad(ficha.id)}
                          >
                            {ficha.estado === 'publicado' ? 'Visible' : 'Oculto'}
                          </button>
                        </td>
                        <td className="cell-actions">
                          <button className="action-icon-btn" title="Editar"><IonIcon icon={createOutline} /></button>
                          <button className="action-icon-btn" title="Ver Vista Pública"><IonIcon icon={eyeOutline} /></button>
                          <button className="action-icon-btn delete-btn" title="Eliminar"><IonIcon icon={trashOutline} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CatalogoGestor;