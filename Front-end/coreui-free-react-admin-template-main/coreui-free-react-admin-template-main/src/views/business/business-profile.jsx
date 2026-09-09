import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAvatar, CBadge, CButton, CProgress } from '@coreui/react';

const BusinessProfile = () => {
  // Estado para alternar dinámicamente entre las múltiples vistas interactivas
  const [activeTab, setActiveTab] = useState('pizarra');

  return (
    <CRow>
      <CCol xs={12} lg={10} className="mx-auto">
        <CCard className="mb-4 shadow-sm" style={{ backgroundColor: '#2c2a29', color: '#fdfbf7', border: '1px solid #4b5563' }}>
          
          {/* Cabecera unificada del Negocio */}
          <CCardHeader className="d-flex justify-content-between align-items-center py-3" style={{ borderBottom: '1px solid #4b5563' }}>
            <div>
              <h3 className="mb-0 fw-bold">The Local Loop</h3>
              <p className="mb-0 text-muted small fst-italic">"Café de especialidad, artesanías locales y experiencias compartidas."</p>
            </div>
            <CBadge color="primary" shape="rounded-pill" className="px-3 py-2">
              ✔ Proyecto Verificado
            </CBadge>
          </CCardHeader>

          {/* Cuerpo principal */}
          <CCardBody className="p-4">
            <CRow className="align-items-center mb-4">
              
              {/* Información general y manifiesto del proyecto */}
              <CCol xs={12} md={7} className="mb-3 mb-md-0">
                <h5 className="text-warning mb-3">Sobre este espacio</h5>
                <div className="d-flex flex-column gap-2 text-light mb-3">
                  <span>📍 <strong>Ubicación:</strong> Arequipa, Perú</span>
                  <span>🕒 <strong>Dinámica:</strong> Espacio abierto y colaborativo</span>
                </div>
                {/* Mensaje que refuerza la identidad de construir juntos */}
                <div className="p-3 rounded-3" style={{ backgroundColor: '#383534', borderLeft: '4px solid #f59e0b' }}>
                  <small className="text-light fst-italic">
                    "Un espacio impulsado por creadores locales. Cada producto y experiencia es el resultado de sumar talentos."
                  </small>
                </div>
              </CCol>

              {/* Sección de Equipo Colaborativo con Scroll */}
              <CCol xs={12} md={5} className="ps-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-warning mb-0">Manos a la obra</h5>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>Alianza activa ↓</small>
                </div>

                <div 
                  className="d-flex flex-column gap-2 pe-2" 
                  style={{ maxHeight: '160px', overflowY: 'auto' }}
                >
                  
                  {/* Dueño / Impulsor del Proyecto */}
                  <div className="d-flex align-items-center gap-2 bg-dark p-2 rounded-3 border border-secondary">
                    <CAvatar color="primary" textColor="white" size="sm">M</CAvatar>
                    <div>
                      <h6 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>Momomonkk <span className="text-primary">✔</span></h6>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Impulsor / Creador</small>
                    </div>
                  </div>

                  {/* Colaborador 1 */}
                  <div className="d-flex align-items-center gap-2 bg-dark p-2 rounded-3 border border-secondary">
                    <CAvatar color="secondary" textColor="white" size="sm">E</CAvatar>
                    <div>
                      <h6 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>Ela</h6>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Aliada Creativa</small>
                    </div>
                  </div>

                  {/* Colaborador 2 */}
                  <div className="d-flex align-items-center gap-2 bg-dark p-2 rounded-3 border border-secondary">
                    <CAvatar color="secondary" textColor="white" size="sm">Mo</CAvatar>
                    <div>
                      <h6 className="mb-0 text-white" style={{ fontSize: '0.9rem' }}>Momo</h6>
                      <small className="text-muted" style={{ fontSize: '0.7rem' }}>Colaborador de Comunidad</small>
                    </div>
                  </div>

                </div>
              </CCol>

            </CRow>

            {/* SELECTOR DE VISTAS MÚLTIPLES */}
            <div className="pt-3 border-top border-secondary">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <CButton 
                  color={activeTab === 'pizarra' ? 'warning' : 'outline-secondary'} 
                  size="sm" 
                  onClick={() => setActiveTab('pizarra')}
                >
                  📋 Pizarra
                </CButton>
                <CButton 
                  color={activeTab === 'portafolio' ? 'warning' : 'outline-secondary'} 
                  size="sm" 
                  onClick={() => setActiveTab('portafolio')}
                >
                  🏛️ Portafolio
                </CButton>
                <CButton 
                  color={activeTab === 'eventos' ? 'warning' : 'outline-secondary'} 
                  size="sm" 
                  onClick={() => setActiveTab('eventos')}
                >
                  📅 Eventos
                </CButton>
                <CButton 
                  color={activeTab === 'trabajos' ? 'warning' : 'outline-secondary'} 
                  size="sm" 
                  onClick={() => setActiveTab('trabajos')}
                >
                  🤝 Trabajos Grupales
                </CButton>
                <CButton 
                  color={activeTab === 'rutinas' ? 'warning' : 'outline-secondary'} 
                  size="sm" 
                  onClick={() => setActiveTab('rutinas')}
                >
                  ⚡ Rutinas / Clases
                </CButton>
              </div>

              {/* 1. VISTA PIZARRA */}
              {activeTab === 'pizarra' && (
                <div className="p-3 bg-dark rounded-3 border border-secondary">
                  <h6 className="text-warning mb-3" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Menú y Disponibilidad Actual</h6>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary">
                      <span className="text-white font-monospace">🍞 Artisan Sourdough Loaf</span>
                      <span className="text-warning fw-bold">$14.99</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2">
                      <span className="text-white font-monospace">☕ Organic Coffee Beans</span>
                      <span className="text-warning fw-bold">$22.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. VISTA PORTAFOLIO */}
              {activeTab === 'portafolio' && (
                <CRow className="g-3">
                  <CCol xs={12} md={4}>
                    <div className="p-3 bg-dark rounded border border-secondary h-100">
                      <div className="fs-4 mb-2">☕</div>
                      <h6 className="text-white mb-1">Café de Especialidad</h6>
                      <p className="text-muted small mb-0">Barra abierta y granos de origen.</p>
                    </div>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <div className="p-3 bg-dark rounded border border-secondary h-100">
                      <div className="fs-4 mb-2">🛠️</div>
                      <h6 className="text-white mb-1">Talleres</h6>
                      <p className="text-muted small mb-0">Espacios de co-creación y manualidades.</p>
                    </div>
                  </CCol>
                  <CCol xs={12} md={4}>
                    <div className="p-3 bg-dark rounded border border-secondary h-100">
                      <div className="fs-4 mb-2">🌿</div>
                      <h6 className="text-white mb-1">Comunidad</h6>
                      <p className="text-muted small mb-0">Vitrinas de exposición local.</p>
                    </div>
                  </CCol>
                </CRow>
              )}

              {/* 3. VISTA EVENTOS (Punto de reunión y plazo) */}
              {activeTab === 'eventos' && (
                <CRow className="g-3">
                  <CCol xs={12} md={6}>
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-danger">Próximo</span>
                        <small className="text-warning">Cierra inscripciones: 15 Oct</small>
                      </div>
                      <h6 className="text-white mb-1">Cata de Café de Origen</h6>
                      <p className="text-muted small mb-2">Degustación guiada de granos de la región.</p>
                      <div className="border-top border-secondary pt-2 text-light small">
                        📍 <strong>Punto de reunión:</strong> Barra principal del local
                      </div>
                    </div>
                  </CCol>
                  <CCol xs={12} md={6}>
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-success">Abierto</span>
                        <small className="text-warning">Cierra inscripciones: 20 Oct</small>
                      </div>
                      <h6 className="text-white mb-1">Feria de Artesanía Local</h6>
                      <p className="text-muted small mb-2">Exhibición abierta al público de creadores.</p>
                      <div className="border-top border-secondary pt-2 text-light small">
                        📍 <strong>Punto de reunión:</strong> Plaza central del distrito
                      </div>
                    </div>
                  </CCol>
                </CRow>
              )}

              {/* 4. VISTA TRABAJOS GRUPALES (Barra de progreso) */}
              {activeTab === 'trabajos' && (
                <CRow className="g-3">
                  <CCol xs={12} md={6}>
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <h6 className="text-white mb-1">Remodelación de Zona Artesanal</h6>
                      <p className="text-muted small mb-3">Proyecto colectivo para ampliar las vitrinas de exposición.</p>
                      <div className="d-flex justify-content-between small text-light mb-1">
                        <span>Progreso del proyecto</span>
                        <span className="text-warning fw-bold">75%</span>
                      </div>
                      <CProgress value={75} color="warning" className="mb-2" style={{ height: '6px' }} />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>3 de 4 tareas completadas por el equipo</small>
                    </div>
                  </CCol>
                  <CCol xs={12} md={6}>
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <h6 className="text-white mb-1">Lanzamiento Nueva Colección de Tazas</h6>
                      <p className="text-muted small mb-3">Producción conjunta de cerámica utilitaria.</p>
                      <div className="d-flex justify-content-between small text-light mb-1">
                        <span>Progreso del proyecto</span>
                        <span className="text-warning fw-bold">40%</span>
                      </div>
                      <CProgress value={40} color="warning" className="mb-2" style={{ height: '6px' }} />
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>Fase de diseño y modelado</small>
                    </div>
                  </CCol>
                </CRow>
              )}

              {/* 5. VISTA RUTINAS / CLASES (Inscripción mínima) */}
              {activeTab === 'rutinas' && (
                <CRow className="g-3">
                  <CCol xs={12} md={6}>
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-info">Clase Guiada</span>
                        <span className="text-success small">Meta cumplida ✔</span>
                      </div>
                      <h6 className="text-white mb-1">Intro to Bouldering Class</h6>
                      <p className="text-muted small mb-2">Sesión semanal de escalada y técnica básica.</p>
                      <div className="border-top border-secondary pt-2 d-flex justify-content-between align-items-center text-light small">
                        <span>👥 Inscritos: 8 / 10</span>
                        <span className="text-warning" style={{ fontSize: '0.75rem' }}>Mínimo requerido: 5 personas</span>
                      </div>
                    </div>
                  </CCol>
                  <CCol xs={12} md={6}>
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-info">Rutina Semanal</span>
                        <span className="text-warning small">Faltan cupos ⏳</span>
                      </div>
                      <h6 className="text-white mb-1">Taller Abierto de Cerámica</h6>
                      <p className="text-muted small mb-2">Práctica libre supervisada de modelado.</p>
                      <div className="border-top border-secondary pt-2 d-flex justify-content-between align-items-center text-light small">
                        <span>👥 Inscritos: 3 / 6</span>
                        <span className="text-warning" style={{ fontSize: '0.75rem' }}>Mínimo requerido: 4 personas</span>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              )}

            </div>

          </CCardBody>

        </CCard>
      </CCol>
    </CRow>
  );
};

export default BusinessProfile;