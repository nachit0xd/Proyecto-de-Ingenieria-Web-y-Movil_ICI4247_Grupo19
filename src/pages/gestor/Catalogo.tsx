import React, { useState, useMemo } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, IonModal, IonInput, IonTextarea, IonSelect, IonSelectOption, IonToast } from '@ionic/react';
import { searchOutline, createOutline, eyeOutline, trashOutline, arrowUpOutline, closeOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import GestorHeader from '../../components/GestorHeader';
import './Catalogo.css';

import { useFichasPatrimonio, useCrearFicha, useEditarFicha, useCambiarEstadoFicha, useEliminarFicha } from '../../hooks/usePatrimonio';
import { FichaPatrimonio } from '../../types';

// La página de catálogo del gestor municipal muestra una tabla con todas las fichas patrimoniales, permitiendo crear, editar, cambiar estado y eliminar fichas
const CatalogoGestor: React.FC = () => {
  const { data: fichasData = [], isLoading: loading } = useFichasPatrimonio();
  
  const crearFicha = useCrearFicha();
  const editarFicha = useEditarFicha();
  const cambiarEstado = useCambiarEstadoFicha();
  const eliminarFicha = useEliminarFicha();

  // Filtros de búsqueda y categoría
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');

  // Estados para modales y edición
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingFicha, setEditingFicha] = useState<FichaPatrimonio | null>(null);
  
  const [toastOptions, setToastOptions] = useState({ show: false, message: '', color: 'success' });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    estado: 'publicado'
  });

  const filteredFichas = useMemo(() => {
    return fichasData.filter((ficha: FichaPatrimonio) => {
      const matchSearch = ficha.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ficha.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'todas' || ficha.categoria === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [fichasData, searchTerm, categoryFilter]);

  const toggleVisibilidad = async (ficha: FichaPatrimonio) => {
    const nuevoEstado = ficha.estado === 'publicado' ? 'borrador' : 'publicado';
    try {
      await cambiarEstado.mutateAsync({ id: ficha.id, estado: nuevoEstado });
      setToastOptions({ show: true, message: `La ficha ha cambiado a estado ${nuevoEstado === 'publicado' ? 'Visible' : 'Oculto'}.`, color: 'success' });
    } catch (error) {
      setToastOptions({ show: true, message: 'Error al cambiar estado.', color: 'danger' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta ficha? Esta acción no se puede deshacer.')) {
      try {
        await eliminarFicha.mutateAsync(id);
        setToastOptions({ show: true, message: 'Ficha eliminada correctamente.', color: 'success' });
      } catch (error) {
        setToastOptions({ show: true, message: 'Error al eliminar ficha.', color: 'danger' });
      }
    }
  };

  const handleOpenModal = (ficha?: FichaPatrimonio) => {
    if (ficha) {
      setEditingFicha(ficha);
      setFormData({
        nombre: ficha.nombre,
        descripcion: ficha.descripcion,
        categoria: ficha.categoria,
        estado: ficha.estado
      });
    } else {
      setEditingFicha(null);
      setFormData({ nombre: '', descripcion: '', categoria: '', estado: 'publicado' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setEditingFicha(null);
      setFormData({ nombre: '', descripcion: '', categoria: '', estado: 'publicado' });
    }, 300);
  };

  const handleSaveFicha = async () => {
    if (!formData.nombre || !formData.descripcion || !formData.categoria) {
      setToastOptions({ show: true, message: 'Por favor complete todos los campos obligatorios.', color: 'warning' });
      return;
    }

    try {
      if (editingFicha) {
        await editarFicha.mutateAsync({ id: editingFicha.id, data: formData as Partial<FichaPatrimonio> });
        setToastOptions({ show: true, message: 'Ficha actualizada correctamente.', color: 'success' });
      } else {
        await crearFicha.mutateAsync(formData as Partial<FichaPatrimonio>);
        setToastOptions({ show: true, message: 'Ficha creada correctamente.', color: 'success' });
      }
      handleCloseModal();
    } catch (error) {
      setToastOptions({ show: true, message: 'Error al guardar la ficha.', color: 'danger' });
    }
  };

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
  };

  return (
    <IonPage className="catalogo-gestor-page">
      <GestorHeader />

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          
          <GestorSidebar />

          <main className="gestor-main-content">
            
            <div className="catalogo-header-row">
              <div>
                <h2 className="section-title">Gestión del Catálogo</h2>
                <p className="section-subtitle-count">{loading ? 'Cargando fichas...' : `Mostrando ${filteredFichas.length} fichas`}</p>
              </div>
              <button className="btn-crear-ficha" onClick={() => handleOpenModal()}>+ Crear nueva ficha</button>
            </div>

            <div className="catalogo-toolbar">
              <div className="search-box-container">
                <IonIcon icon={searchOutline} className="search-icon-inside" />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, descripción..." 
                  className="toolbar-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select className="toolbar-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="todas">Todas las categorías</option>
                <option value="cultor">Cultor</option>
                <option value="patrimonio">Patrimonio</option>
                <option value="feria">Feria</option>
                <option value="oficio">Oficio</option>
                <option value="expresion">Expresión</option>
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
                    {filteredFichas.map((ficha: FichaPatrimonio) => (
                      <tr key={ficha.id}>
                        <td className="cell-avatar">
                          <div className="avatar-placeholder-blue">🧵</div>
                        </td>
                        <td className="cell-name"><strong>{ficha.nombre}</strong></td>
                        <td>
                          <span className="badge-categoria-cultor" style={{ textTransform: 'capitalize' }}>{ficha.categoria}</span>
                        </td>
                        <td className="cell-date">{formatDate(ficha.fechaCreacion)}</td>
                        <td>
                          <button 
                            className={`btn-status-toggle ${ficha.estado === 'publicado' ? 'v-visible' : 'v-oculto'}`}
                            onClick={() => toggleVisibilidad(ficha)}
                          >
                            {ficha.estado === 'publicado' ? 'Visible' : 'Oculto'}
                          </button>
                        </td>
                        <td className="cell-actions">
                          <button className="action-icon-btn" title="Editar" onClick={() => handleOpenModal(ficha)}><IonIcon icon={createOutline} /></button>
                          <button className="action-icon-btn" title="Ver Vista Pública" onClick={() => {
                            setEditingFicha(ficha);
                            setShowViewModal(true);
                          }}><IonIcon icon={eyeOutline} /></button>
                          <button className="action-icon-btn delete-btn" title="Eliminar" onClick={() => handleDelete(ficha.id)}><IonIcon icon={trashOutline} /></button>
                        </td>
                      </tr>
                    ))}
                    {filteredFichas.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                          No se encontraron fichas que coincidan con la búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </main>
        </div>

        {/* Modal Crear/Editar Ficha */}
        <IonModal isOpen={showModal} onDidDismiss={handleCloseModal} className="wizard-modal">
          <div className="modal-content-wrapper" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>{editingFicha ? 'Editar Ficha' : 'Crear Nueva Ficha'}</h2>
              <button className="action-icon-btn" onClick={handleCloseModal}><IonIcon icon={closeOutline} /></button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Nombre de la ficha *</label>
                <IonInput className="custom-modal-input" placeholder="Ej: Tejeduría en telar" value={formData.nombre} onIonInput={(e) => setFormData({...formData, nombre: e.detail.value!})} />
              </div>
              <div className="input-group">
                <label>Descripción *</label>
                <IonTextarea className="custom-modal-input" rows={4} placeholder="Descripción detallada..." value={formData.descripcion} onIonInput={(e) => setFormData({...formData, descripcion: e.detail.value!})} />
              </div>
              <div className="input-group">
                <label>Categoría *</label>
                <IonSelect interface="popover" placeholder="Seleccione categoría" className="custom-modal-select" value={formData.categoria} onIonChange={(e) => setFormData({...formData, categoria: e.detail.value})}>
                  <IonSelectOption value="oficio">Oficio</IonSelectOption>
                  <IonSelectOption value="cultor">Cultor</IonSelectOption>
                  <IonSelectOption value="patrimonio">Patrimonio</IonSelectOption>
                  <IonSelectOption value="feria">Feria</IonSelectOption>
                  <IonSelectOption value="expresion">Expresión</IonSelectOption>
                </IonSelect>
              </div>
              <div className="input-group">
                <label>Estado de Publicación</label>
                <IonSelect interface="popover" className="custom-modal-select" value={formData.estado} onIonChange={(e) => setFormData({...formData, estado: e.detail.value})}>
                  <IonSelectOption value="publicado">Publicado (Visible)</IonSelectOption>
                  <IonSelectOption value="borrador">Borrador (Oculto)</IonSelectOption>
                </IonSelect>
              </div>
              
              <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <button className="btn-modal btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button className="btn-modal btn-primary" onClick={handleSaveFicha} disabled={crearFicha.isPending || editarFicha.isPending}>
                  {crearFicha.isPending || editarFicha.isPending ? 'Guardando...' : 'Guardar Ficha'}
                </button>
              </div>
            </div>
          </div>
        </IonModal>

        {/* Modal Vista Pública (Previsualización) */}
        <IonModal isOpen={showViewModal} onDidDismiss={() => setShowViewModal(false)} className="wizard-modal">
          <div className="modal-content-wrapper" style={{ padding: '0', overflow: 'hidden' }}>
            {editingFicha && (
              <>
                <div style={{ height: '200px', backgroundColor: '#e37e33', position: 'relative' }}>
                  <button className="action-icon-btn" style={{ position: 'absolute', top: '15px', right: '15px', color: 'white', background: 'rgba(0,0,0,0.3)', borderRadius: '50%' }} onClick={() => setShowViewModal(false)}>
                    <IonIcon icon={closeOutline} />
                  </button>
                </div>
                <div style={{ padding: '30px', textAlign: 'center' }}>
                  <span className="badge-categoria-cultor" style={{ textTransform: 'capitalize', marginBottom: '15px', display: 'inline-block' }}>{editingFicha.categoria}</span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 15px 0', color: '#1f2937' }}>{editingFicha.nombre}</h2>
                  <p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1.1rem' }}>{editingFicha.descripcion}</p>
                  <p style={{ marginTop: '20px', color: '#9ca3af', fontSize: '0.9rem' }}>Estado actual: {editingFicha.estado}</p>
                </div>
              </>
            )}
          </div>
        </IonModal>

        <IonToast
          isOpen={toastOptions.show}
          onDidDismiss={() => setToastOptions({ ...toastOptions, show: false })}
          message={toastOptions.message}
          duration={3000}
          color={toastOptions.color}
          position="bottom"
        />

      </IonContent>
    </IonPage>
  );
};

export default CatalogoGestor;
