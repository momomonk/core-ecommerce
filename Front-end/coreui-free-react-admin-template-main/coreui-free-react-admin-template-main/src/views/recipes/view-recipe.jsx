import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CBadge,
  CListGroup,
  CListGroupItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilClock, cilFire, cilUser, cilStar, cilTag, cilListNumbered, cilCheckCircle } from '@coreui/icons'

const ViewRecipe = () => {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`https://dummyjson.com/recipes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar la información de la receta.')
        return res.json()
      })
      .then((data) => {
        setRecipe(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error} <br />
        <CButton color="primary" size="sm" as={Link} to="/recipes" className="mt-3">
          Volver al listado
        </CButton>
      </div>
    )
  }

  if (!recipe) return null

  return (
    <CRow className="g-4">
      {/* Cabecera y botón de retorno */}
      <CCol xs={12} className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold mb-0 text-primary">Detalle de Receta</h3>
          <span className="text-muted small">Información completa obtenida desde el servidor</span>
        </div>
        <CButton color="secondary" variant="outline" size="sm" as={Link} to="/recipes">
          <CIcon icon={cilArrowLeft} className="me-2" /> Volver
        </CButton>
      </CCol>

      {/* Tarjeta Principal / Imagen y Datos Rápidos */}
      <CCol lg={4} xs={12}>
        <CCard className="shadow-sm border-0 mb-4">
          <div className="position-relative" style={{ height: '260px', backgroundColor: '#f8f9fa' }}>
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-100 h-100 object-fit-cover rounded-top"
            />
          </div>
          <CCardBody>
            <h4 className="fw-bold mb-2">{recipe.name}</h4>
            <div className="d-flex align-items-center gap-2 mb-3">
              <CBadge color="info">{recipe.cuisine || 'General'}</CBadge>
              <CBadge color={recipe.difficulty === 'Easy' ? 'success' : recipe.difficulty === 'Medium' ? 'warning' : 'danger'}>
                {recipe.difficulty}
              </CBadge>
            </div>

            <hr className="text-muted opacity-25" />

            {/* Estadísticas clave */}
            <div className="d-flex flex-column gap-2 text-secondary small">
              <div className="d-flex justify-content-between align-items-center">
                <span><CIcon icon={cilStar} className="text-warning me-2" /> Puntuación:</span>
                <strong className="text-dark">{recipe.rating} ({recipe.reviewCount} opiniones)</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span><CIcon icon={cilClock} className="text-primary me-2" /> Prep. / Cocción:</span>
                <strong className="text-dark">{recipe.prepTimeMinutes}m / {recipe.cookTimeMinutes}m</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span><CIcon icon={cilUser} className="text-success me-2" /> Porciones:</span>
                <strong className="text-dark">{recipe.servings} personas</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span><CIcon icon={cilFire} className="text-danger me-2" /> Calorías:</span>
                <strong className="text-dark">{recipe.caloriesPerServing} kcal / porción</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span><CIcon icon={cilUser} className="text-secondary me-2" /> Creador ID:</span>
                <strong className="text-dark">User #{recipe.userId}</strong>
              </div>
            </div>

            <hr className="text-muted opacity-25" />

            {/* Tipos de Comida y Tags */}
            <div className="mb-2">
              <span className="small fw-bold text-muted d-block mb-1">Tipos de Comida (Meal Type):</span>
              <div className="d-flex flex-wrap gap-1">
                {recipe.mealType?.map((meal, index) => (
                  <CBadge key={index} color="dark" shape="rounded-pill" className="px-2 py-1" style={{ fontSize: '0.7rem' }}>
                    {meal}
                  </CBadge>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <span className="small fw-bold text-muted d-block mb-1"><CIcon icon={cilTag} className="me-1" /> Etiquetas:</span>
              <div className="d-flex flex-wrap gap-1">
                {recipe.tags?.map((tag, index) => (
                  <CBadge key={index} color="light" textColor="dark" className="border px-2 py-1" style={{ fontSize: '0.7rem' }}>
                    {tag}
                  </CBadge>
                ))}
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Ingredientes e Instrucciones */}
      <CCol lg={8} xs={12}>
        <CRow className="g-4">
          {/* Ingredientes */}
          <CCol xs={12}>
            <CCard className="shadow-sm border-0">
              <CCardHeader className="bg-light fw-bold text-primary">
                🛒 Ingredientes ({recipe.ingredients?.length || 0})
              </CCardHeader>
              <CCardBody>
                <CListGroup flush>
                  {recipe.ingredients?.map((ingredient, index) => (
                    <CListGroupItem key={index} className="d-flex align-items-center gap-2 py-2">
                      <CIcon icon={cilCheckCircle} className="text-success flex-shrink-0" />
                      <span>{ingredient}</span>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              </CCardBody>
            </CCard>
          </CCol>

          {/* Instrucciones */}
          <CCol xs={12}>
            <CCard className="shadow-sm border-0">
              <CCardHeader className="bg-light fw-bold text-primary">
                👨‍🍳 Instrucciones de Preparación ({recipe.instructions?.length || 0} pasos)
              </CCardHeader>
              <CCardBody>
                <div className="d-flex flex-column gap-3">
                  {recipe.instructions?.map((step, index) => (
                    <div key={index} className="d-flex align-items-start gap-3 p-2 bg-light rounded border border-opacity-10">
                      <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold flex-shrink-0" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                        {index + 1}
                      </div>
                      <p className="mb-0 text-dark small pt-1" style={{ lineHeight: '1.5' }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCol>
    </CRow>
  )
}

export default ViewRecipe