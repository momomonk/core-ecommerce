import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilInfo, cilPencil, cilTrash, cilFilter } from '@coreui/icons'

const CleanCardRecipeManager = () => {
  // 1. Estados principales y de Paginación en Servidor
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [totalApiRecipes, setTotalApiRecipes] = useState(0)

  // 2. Sistema de Pestañas y Filtros
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedMealTypes, setSelectedMealTypes] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState('rating-desc')

  // Listas de opciones disponibles cargadas desde la API
  const [availableMealTypes, setAvailableMealTypes] = useState([])
  const [availableTags, setAvailableTags] = useState([])

  // Estado para controlar qué tarjeta muestra el panel flotante de detalles
  const [expandedCardId, setExpandedCardId] = useState(null)

  // Cierra el panel flotante si se hace clic fuera
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.recipe-card-container')) {
        setExpandedCardId(null)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  // Cargar lista completa de Meal Types y Tags al iniciar para los botones de filtro
  useEffect(() => {
    fetch('https://dummyjson.com/recipes?limit=0')
      .then((res) => res.json())
      .then((data) => {
        const all = data.recipes || []
        const mealTypesSet = new Set()
        const tagsSet = new Set()

        all.forEach((r) => {
          if (Array.isArray(r.mealType)) r.mealType.forEach((mt) => mealTypesSet.add(mt))
          if (Array.isArray(r.tags)) r.tags.forEach((t) => tagsSet.add(t))
        })

        setAvailableMealTypes(Array.from(mealTypesSet))
        setAvailableTags(Array.from(tagsSet))
      })
      .catch((err) => console.error('Error cargando metadatos:', err))
  }, [])

  // 3. Consulta dinámica a la API en tiempo real (Soporta Tags, MealTypes, Búsqueda y Paginación)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    const skip = (currentPage - 1) * itemsPerPage
    let url = `https://dummyjson.com/recipes?limit=${itemsPerPage}&skip=${skip}`

    // Prioridad 1: Búsqueda por texto
    if (search.trim()) {
      url = `https://dummyjson.com/recipes/search?q=${encodeURIComponent(search.trim())}&limit=${itemsPerPage}&skip=${skip}`
    } 
    // Prioridad 2: Filtro por Tag específico de la API (ej: /recipes/tag/Pakistani)
    else if (selectedTags.length > 0) {
      // Usamos el primer tag seleccionado para la consulta por endpoint de la API
      url = `https://dummyjson.com/recipes/tag/${encodeURIComponent(selectedTags[0])}?limit=${itemsPerPage}&skip=${skip}`
    } 
    // Prioridad 3: Filtro por Meal Type específico de la API (ej: /recipes/meal-type/Dinner)
    else if (selectedMealTypes.length > 0) {
      url = `https://dummyjson.com/recipes/meal-type/${encodeURIComponent(selectedMealTypes[0])}?limit=${itemsPerPage}&skip=${skip}`
    }

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con la API de recetas')
        return res.json()
      })
      .then((data) => {
        const enriched = (data.recipes || []).map((recipe) => ({
          ...recipe,
          estimatedPrice: (3.5 + (recipe.caloriesPerServing || 200) / 120).toFixed(2)
        }))
        setRecipes(enriched)
        setTotalApiRecipes(data.total || enriched.length)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [currentPage, itemsPerPage, search, selectedTags, selectedMealTypes])

  // 4. Filtrado local complementario (Pestañas adicionales y Ordenamiento)
  const processedRecipes = useMemo(() => {
    let result = [...recipes]

    if (activeTab === 'low-cal') {
      result = result.filter((recipe) => (recipe.caloriesPerServing || 0) <= 400)
    } else if (activeTab === 'express') {
      result = result.filter((recipe) => (recipe.prepTimeMinutes + recipe.cookTimeMinutes) <= 10)
    }

    if (sortBy === 'az') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'za') {
      result.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'calories-asc') {
      result.sort((a, b) => (a.caloriesPerServing || 0) - (b.caloriesPerServing || 0))
    } else if (sortBy === 'calories-desc') {
      result.sort((a, b) => (b.caloriesPerServing || 0) - (a.caloriesPerServing || 0))
    } else if (sortBy === 'servings-desc') {
      result.sort((a, b) => (b.servings || 0) - (a.servings || 0))
    } else if (sortBy === 'servings-asc') {
      result.sort((a, b) => (a.servings || 0) - (b.servings || 0))
    }

    return result
  }, [recipes, activeTab, sortBy])

  const totalPages = Math.ceil(totalApiRecipes / itemsPerPage) || 1

  // 5. Paginación Compacta
  const getCompactPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages = []
    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    pages.push(1)
    if (rangeStart > 2) pages.push('...')
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i !== 1 && i !== totalPages) pages.push(i)
    }
    if (rangeEnd < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  // 6. Modal de Eliminación
  const [visibleModal, setVisibleModal] = useState(false)
  const [recipeToDelete, setRecipeToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const confirmDelete = async () => {
    if (!recipeToDelete) return
    setDeleteLoading(true)
    try {
      const response = await fetch(`https://dummyjson.com/recipes/${recipeToDelete.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('No se pudo eliminar la receta')

      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id))
      setTotalApiRecipes((prev) => prev - 1)
      setVisibleModal(false)
      setRecipeToDelete(null)
      alert('Receta eliminada con éxito')
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const startItemIndex = totalApiRecipes === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
  const endItemIndex = Math.min(currentPage * itemsPerPage, totalApiRecipes)

  return (
    <CRow className="g-3">
      {/* ENCABEZADO Y PESTAÑAS */}
      <CCol xs={12} className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-1">
        <div>
          <h4 className="fw-bold mb-0">🍳 Gestor de Recetas Profesional</h4>
          <span className="small text-muted">Consultas dinámicas por Tags y Meal Types en Servidor</span>
        </div>
        <CButton color="primary" size="sm" as={Link} to="/recipes/new">
          + Nueva Receta
        </CButton>
      </CCol>

      <CCol xs={12}>
        <CNav variant="tabs" className="border-bottom-0">
          <CNavItem>
            <CNavLink
              active={activeTab === 'all'}
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              style={{ cursor: 'pointer' }}
            >
              📋 Todas las Recetas
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'low-cal'}
              onClick={() => { setActiveTab('low-cal'); setCurrentPage(1); }}
              style={{ cursor: 'pointer' }}
            >
              🥗 Bajas en Calorías (&le; 400 kcal)
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 'express'}
              onClick={() => { setActiveTab('express'); setCurrentPage(1); }}
              style={{ cursor: 'pointer' }}
            >
              ⚡ Express Total (&le; 10 min)
            </CNavLink>
          </CNavItem>
        </CNav>
      </CCol>

      {/* SIDEBAR DE FILTROS */}
      <CCol lg={3} xs={12}>
        <CCard className="shadow-sm border-0 mb-3">
          <CCardHeader className="bg-light fw-bold d-flex align-items-center gap-2 py-3">
            <CIcon icon={cilFilter} /> Filtros por API
          </CCardHeader>
          <CCardBody className="small">
            <div className="mb-3">
              <label className="fw-semibold mb-1 text-secondary">Búsqueda general</label>
              <CFormInput
                size="sm"
                placeholder="Buscar receta..."
                value={search}
                onChange={(e) => { 
                  setSearch(e.target.value)
                  setSelectedTags([])
                  setSelectedMealTypes([])
                  setCurrentPage(1) 
                }}
              />
            </div>

            <div className="mb-3">
              <label className="fw-semibold mb-1 text-secondary">Ordenar por</label>
              <select
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating-desc">Mayor Calificación</option>
                <option value="calories-asc">Menor Caloría (kcal)</option>
                <option value="calories-desc">Mayor Caloría (kcal)</option>
                <option value="servings-desc">Mayor Número de Porciones</option>
                <option value="servings-asc">Menor Número de Porciones</option>
                <option value="az">Nombre (A - Z)</option>
                <option value="za">Nombre (Z - A)</option>
              </select>
            </div>

            <hr className="my-2" />

            <div className="mb-3">
              <label className="fw-semibold mb-1 text-secondary d-block">Categorías (Meal Types)</label>
              <div className="d-flex flex-wrap gap-1 mt-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {availableMealTypes.map((mt) => {
                  const isSelected = selectedMealTypes.includes(mt)
                  return (
                    <button
                      key={mt}
                      type="button"
                      className={`btn btn-xs px-2 py-1 rounded-pill fw-semibold border ${
                        isSelected ? 'bg-success text-white border-success' : 'bg-white text-dark'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                      onClick={() => {
                        setSearch('')
                        setSelectedTags([])
                        setSelectedMealTypes(isSelected ? [] : [mt]) // Selección única para endpoint de API
                        setCurrentPage(1)
                      }}
                    >
                      {mt} {isSelected && '✓'}
                    </button>
                  )
                })}
              </div>
            </div>

            {availableTags.length > 0 && (
              <div className="mb-2">
                <label className="fw-semibold mb-1 text-secondary d-block">Tags de API (ej: Pakistani)</label>
                <div className="d-flex flex-wrap gap-1 mt-2" style={{ maxHeight: '140px', overflowY: 'auto' }}>
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`btn btn-xs px-2 py-1 rounded-pill border ${
                          isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-muted'
                        }`}
                        style={{ fontSize: '0.65rem' }}
                        onClick={() => {
                          setSearch('')
                          setSelectedMealTypes([])
                          setSelectedTags(isSelected ? [] : [tag]) // Selección única para endpoint /tag/
                          setCurrentPage(1)
                        }}
                      >
                        {tag} {isSelected && '✓'}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {(search || selectedMealTypes.length > 0 || selectedTags.length > 0) && (
              <div className="mt-3 pt-2 border-top text-center">
                <CButton
                  color="link"
                  size="sm"
                  className="text-danger p-0 text-decoration-none"
                  onClick={() => {
                    setSearch('')
                    setSelectedMealTypes([])
                    setSelectedTags([])
                    setCurrentPage(1)
                  }}
                >
                  Limpiar filtros de API
                </CButton>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* CONTENIDO PRINCIPAL */}
      <CCol lg={9} xs={12}>
        <CCard className="shadow-sm border-0">
          <CCardBody className="position-relative min-vh-50 d-flex flex-column">
            
            {error && <div className="alert alert-danger">{error}</div>}

            {loading && (
              <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75 top-0 start-0" style={{ zIndex: 10 }}>
                <CSpinner color="primary" />
              </div>
            )}

            {/* GRILLA DE RECETAS */}
            <div className="row g-3 flex-grow-1">
              {processedRecipes.length > 0 ? (
                processedRecipes.map((recipe) => {
                  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)
                  const isExpanded = expandedCardId === recipe.id

                  return (
                    <div key={recipe.id} className="col-xl-4 col-md-6 col-12 d-flex recipe-card-container">
                      <div className="card w-100 shadow-sm border-0 rounded-3 overflow-hidden d-flex flex-column">
                        <div 
                          className="position-relative" 
                          style={{ height: '140px', backgroundColor: '#f8f9fa', cursor: 'pointer' }}
                          onClick={() => setExpandedCardId(isExpanded ? null : recipe.id)}
                          title="Haz clic para ver/ocultar detalles"
                        >
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-100 h-100 object-fit-cover"
                          />
                          
                          {isExpanded && (
                            <div 
                              className="position-absolute inset-0 bg-dark bg-opacity-85 text-white p-2 d-flex flex-column justify-between animate-fadeIn top-0 start-0 w-100 h-100"
                              style={{ zIndex: 5, backdropFilter: 'blur(2px)' }}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-1 align-items-center">
                                  <span className="badge bg-light text-dark font-monospace" style={{ fontSize: '0.7rem' }}>
                                    #{recipe.id}
                                  </span>
                                  <span className="badge bg-success text-white fw-bold" style={{ fontSize: '0.75rem' }}>
                                    ${recipe.estimatedPrice}
                                  </span>
                                </div>
                                <span className="small text-light opacity-75" style={{ fontSize: '0.65rem' }}>Cierra afuera ✕</span>
                              </div>

                              <div className="text-center my-auto">
                                <span className="small d-block text-light" style={{ fontSize: '0.8rem' }}>
                                  👥 {recipe.servings || 1} porciones
                                </span>
                              </div>

                              <div className="d-flex justify-content-between align-items-center pt-1 border-top border-secondary">
                                <span className="text-danger small" style={{ fontSize: '0.75rem' }}>
                                  🔥 {recipe.caloriesPerServing || 0} kcal
                                </span>
                                <div className="d-flex gap-1" onClick={(e) => e.stopPropagation()}>
                                  <Link 
                                    to={`/recipes/view/${recipe.id}`}
                                    className="btn btn-sm btn-light p-1 border-0 shadow-sm"
                                    title="Ver detalles"
                                  >
                                    <CIcon icon={cilInfo} size="sm" className="text-primary" />
                                  </Link>
                                  <CDropdown alignment="end">
                                    <CDropdownToggle color="light" size="sm" className="p-1 border-0 shadow-sm">
                                      <CIcon icon={cilOptions} size="sm" />
                                    </CDropdownToggle>
                                    <CDropdownMenu style={{ fontSize: '0.8rem' }}>
                                      <CDropdownItem as={Link} to={`/recipes/edit/${recipe.id}`}>
                                        <CIcon icon={cilPencil} className="me-2" /> Editar
                                      </CDropdownItem>
                                      <CDropdownItem onClick={() => { setRecipeToDelete(recipe); setVisibleModal(true); }} className="text-danger">
                                        <CIcon icon={cilTrash} className="me-2" /> Eliminar
                                      </CDropdownItem>
                                    </CDropdownMenu>
                                  </CDropdown>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="card-body d-flex flex-column p-3 flex-grow-1">
                          <h6 className="card-title fw-bold text-truncate mb-2" style={{ fontSize: '1.05rem' }} title={recipe.name}>
                            {recipe.name}
                          </h6>

                          <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
                            <span className="text-success fw-semibold">
                              ⏱️ {totalTime} min
                            </span>
                            <span className="text-warning fw-bold">
                              ★ {recipe.rating}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )
                })
              ) : (
                !loading && (
                  <div className="text-center py-5 col-12">
                    <p className="text-muted mb-1">No se encontraron recetas bajo estos criterios.</p>
                  </div>
                )
              )}
            </div>

            {/* ZONA INFERIOR CON PAGINACIÓN */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4 pt-3 border-top">
              
              <div className="text-muted small">
                Mostrando del <strong>{startItemIndex}</strong> al <strong>{endItemIndex}</strong> de{' '}
                <strong>{totalApiRecipes}</strong> recetas en el servidor
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="text-muted small">Elementos por página:</span>
                <select
                  className="form-select form-select-sm w-auto"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>

              {totalPages > 1 && (
                <CPagination size="sm" className="mb-0">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
                  >
                    &lt;
                  </CPaginationItem>

                  {getCompactPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <CPaginationItem key={`dots-${index}`} disabled>
                          ...
                        </CPaginationItem>
                      )
                    }
                    return (
                      <CPaginationItem
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                        style={{ cursor: 'pointer' }}
                      >
                        {page}
                      </CPaginationItem>
                    )
                  })}

                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
                  >
                    &gt;
                  </CPaginationItem>
                </CPagination>
              )}

            </div>

          </CCardBody>
        </CCard>
      </CCol>

      {/* MODAL DE ELIMINACIÓN */}
      <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <CModalHeader onClose={() => setVisibleModal(false)}>
          <CModalTitle>Confirmar Eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          ¿Deseas eliminar permanentemente la receta <strong>{recipeToDelete?.name}</strong> (ID: #{recipeToDelete?.id})?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" variant="outline" onClick={() => setVisibleModal(false)} disabled={deleteLoading}>
            Cancelar
          </CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? <CSpinner size="sm" /> : 'Eliminar'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default CleanCardRecipeManager