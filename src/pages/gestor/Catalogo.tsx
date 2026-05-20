import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { personCircleOutline, searchOutline, createOutline, eyeOutline, trashOutline, arrowUpOutline
} from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import './Catalogo.css';

// La página de catálogo del gestor municipal es el espacio donde los gestores pueden administrar las fichas culturales que se muestran en el catálogo público 
// Aquí pueden ver una lista de todas las fichas, con información básica como nombre, categoría, fecha de creación, y estado de visibilidad 
// Los gestores pueden editar cada ficha para actualizar su información, cambiar su estado de visible/oculto, o eliminarla si ya no es relevante. También hay opciones para crear nuevas fichas y exportar los datos del catálogo para análisis o reportes

// Base de datos simulada del catálogo para el Gestor Municipal, con campos básicos para mostrar en la tabla de gestión
const FICHAS_MOCK = [
  { id: 1, nombre: 'Tejeduría en telar', categoria: 'Cultor', fecha: '09-04-26', visible: true },
  { id: 2, nombre: 'Tejeduría en telar', categoria: 'Cultor', fecha: '09-04-26', visible: false },
  { id: 3, nombre: 'Tejeduría en telar', categoria: 'Cultor', fecha: '09-04-26', visible: true },
  { id: 4, nombre: 'Tejeduría en telar', categoria: 'Cultor', fecha: '09-04-26', visible: false },
  { id: 5, nombre: 'Tejeduría en telar', categoria: 'Cultor', fecha: '09-04-26', visible: true },
  { id: 6, nombre: 'Tejeduría en telar', categoria: 'Cultor', fecha: '09-04-26', visible: false },
  { id: 7, nombre: 'Tejeduría en telar', categoria: 'Cultor', fecha: '09-04-26', visible: true },
];

const CatalogoGestor: React.FC = () => {
  const [fichas, setFichas] = useState(FICHAS_MOCK);

  // Función simulada para cambiar visibilidad (Switch)
  const toggleVisibilidad = (id: number) => {
    setFichas(fichas.map(f => f.id === id ? { ...f, visible: !f.visible } : f));
  };

  return (
    <IonPage>
      {/* HEADER GLOBAL DEL GESTOR */}
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

          {/* ÁREA PRINCIPAL DE CONTENIDO */}
          <main className="gestor-main-content">
            
            {/* Encabezado de la Sección */}
            <div className="catalogo-header-row">
              <div>
                <h2 className="section-title">Gestión del Catálogo</h2>
                <p className="section-subtitle-count">Mostrando 17 de 23 fichas publicadas</p>
              </div>
              <button className="btn-crear-ficha">+ Crear nueva ficha</button>
            </div>

            {/* BARRA DE HERRAMIENTAS (Buscador y Filtros) */}
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

            {/* TABLA DE DATOS OPERATIVA */}
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
                      <td className="cell-date">{ficha.fecha}</td>
                      <td>
                        <button 
                          className={`btn-status-toggle ${ficha.visible ? 'v-visible' : 'v-oculto'}`}
                          onClick={() => toggleVisibilidad(ficha.id)}
                        >
                          {ficha.visible ? 'Visible' : 'Oculto'}
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

          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CatalogoGestor;