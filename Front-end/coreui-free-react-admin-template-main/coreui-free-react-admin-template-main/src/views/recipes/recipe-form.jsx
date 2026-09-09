import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CSpinner,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSave, cilX, cilPlus } from '@coreui/icons'

const RecipeForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Listas dinámicas extraídas directamente de la API de recetas
  const [availableTags, setAvailableTags] = useState([])
  const [availableMealTypes, setAvailableMealTypes] = useState([])
  const [availableDifficulties, setAvailableDifficulties] = useState([])

  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    servings: '',
    difficulty: '', // Se inicializa vacío para llenarse de forma dinámica
    cuisine: '',
    caloriesPerServing: '',
    tags: [],      // Array para múltiples chips
    mealType: [],  // Array para múltiples chips de mealType
    userId: '',
    image: '',
  })

  useEffect(() => {
    // 1. Obtener tags oficiales desde el endpoint de la documentación: /recipes/tags
    fetch('https://dummyjson.com/recipes/tags')
      .then((res) => res.json())
      .then((data) => setAvailableTags(data))
      .catch((err) => console.error('Error al cargar tags:', err))

    // 2. Extraer dinámicamente meal types y difficulties consultando todas las recetas (/recipes)
    fetch('https://dummyjson.com/recipes?limit=0')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.recipes) {
          // Extraer meal types únicos
          const uniqueMeals = [...new Set(data.recipes.flatMap((r) => r.mealType || []))]
          setAvailableMealTypes(uniqueMeals)

          // Extraer dificultades únicas de forma dinámica
          const uniqueDifficulties = [...new Set(data.recipes.map((r) => r.difficulty).filter(Boolean))]
          setAvailableDifficulties(uniqueDifficulties)
        }
      })
      .catch((err) => console.error('Error al extraer datos dinámicos:', err))

    // 3. Si estamos editando, cargar los datos de la receta
    if (isEditMode) {
      setLoading(true)
      fetch(`https://dummyjson.com/recipes/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('No se pudo obtener la información de la receta.')
          return res.json()
        })
        .then((data) => {
          setFormData({
            name: data.name || '',
            ingredients: Array.isArray(data.ingredients) ? data.ingredients.join('\n') : '',
            instructions: Array.isArray(data.instructions) ? data.instructions.join('\n') : '',
            prepTimeMinutes: data.prepTimeMinutes || '',
            cookTimeMinutes: data.cookTimeMinutes || '',
            servings: data.servings || '',
            difficulty: data.difficulty || '',
            cuisine: data.cuisine || '',
            caloriesPerServing: data.caloriesPerServing || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            mealType: Array.isArray(data.mealType) ? data.mealType : data.mealType ? [data.mealType] : [],
            userId: data.userId || '',
            image: data.image || '',
          })
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Funciones para manejar los Chips de Tags
  const handleAddTag = (tagToAdd) => {
    if (tagToAdd && !formData.tags.includes(tagToAdd)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagToAdd] }))
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }))
  }

  // Funciones para manejar los Chips de Meal Type
  const handleAddMealType = (mealToAdd) => {
    if (mealToAdd && !formData.mealType.includes(mealToAdd)) {
      setFormData((prev) => ({ ...prev, mealType: [...prev.mealType, mealToAdd] }))
    }
  }

  const handleRemoveMealType = (mealToRemove) => {
    setFormData((prev) => ({
      ...prev,
      mealType: prev.mealType.filter((m) => m !== mealToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const url = isEditMode 
      ? `https://dummyjson.com/recipes/${id}` 
      : 'https://dummyjson.com/recipes/add'
    
    const method = isEditMode ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          ingredients: formData.ingredients.split('\n').filter(Boolean),
          instructions: formData.instructions.split('\n').filter(Boolean),
          prepTimeMinutes: Number(formData.prepTimeMinutes),
          cookTimeMinutes: Number(formData.cookTimeMinutes),
          servings: Number(formData.servings),
          difficulty: formData.difficulty,
          cuisine: formData.cuisine,
          caloriesPerServing: Number(formData.caloriesPerServing),
          tags: formData.tags,
          mealType: formData.mealType,
          userId: Number(formData.userId),
          image: formData.image,
        }),
      })

      if (!response.ok) throw new Error(isEditMode ? 'Error al actualizar la receta.' : 'Error al crear la receta.')

      alert(isEditMode ? '¡Receta actualizada con éxito!' : '¡Receta creada con éxito!')
      navigate('/recipes')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow className="g-4">
      <CCol xs={12} className="d-flex justify-content-between align-items-center">
        <div>
          <h3 className="fw-bold mb-0 text-primary">
            {isEditMode ? 'Editar Receta' : 'Nueva Receta'}
          </h3>
          <span className="text-muted small">
            {isEditMode ? `Modificando registro ID: ${id}` : 'Completa el formulario para registrar una nueva receta'}
          </span>
        </div>
        <CButton color="secondary" variant="outline" size="sm" as={Link} to="/recipes">
          <CIcon icon={cilArrowLeft} className="me-2" /> Volver
        </CButton>
      </CCol>

      {error && (
        <CCol xs={12}>
          <div className="alert alert-danger" role="alert">{error}</div>
        </CCol>
      )}

      <CCol xs={12}>
        <CCard className="shadow-sm border-0">
          <CCardHeader className="bg-light fw-bold text-primary">
            📝 {isEditMode ? `Actualizar Receta #${id}` : 'Formulario de Creación'}
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit} className="row g-3">
              
              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Nombre</CFormLabel>
                <CFormInput name="name" value={formData.name} onChange={handleChange} required />
              </CCol>

              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Tipo de Cocina (Cuisine)</CFormLabel>
                <CFormInput name="cuisine" value={formData.cuisine} onChange={handleChange} required />
              </CCol>

              {/* SECCIÓN DE CHIPS PARA DIFFICULTY (Dinámica y más intuitiva) */}
              <CCol md={4} xs={12}>
                <CFormLabel className="small fw-bold">Dificultad (Difficulty)</CFormLabel>
                
                {/* 1. Recuadro de Selección Actual */}
                <div className="p-2 border rounded bg-white mb-2" style={{ minHeight: '50px' }}>
                  {!formData.difficulty ? (
                    <span className="text-muted small fst-italic p-2">Ninguna seleccionada.</span>
                  ) : (
                    <CBadge color="warning" className="d-flex align-items-center justify-content-between p-2 text-dark">
                      {formData.difficulty}
                      <CIcon 
                        icon={cilX} 
                        size="sm" 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => setFormData((prev) => ({ ...prev, difficulty: '' }))} 
                      />
                    </CBadge>
                  )}
                </div>

                {/* 2. Recuadro de Opciones Disponibles */}
                <div className="d-flex flex-wrap gap-2">
                  {availableDifficulties.map((diff, index) => (
                    <CBadge 
                      key={index}
                      color={formData.difficulty === diff ? "warning" : "secondary"}
                      className="p-2"
                      style={{ 
                        cursor: 'pointer', 
                        opacity: formData.difficulty === diff ? 1 : 0.6,
                        border: formData.difficulty === diff ? '1px solid #000' : 'none'
                      }}
                      onClick={() => setFormData((prev) => ({ ...prev, difficulty: diff }))}
                    >
                      {diff}
                    </CBadge>
                  ))}
                </div>
              </CCol>

              <CCol md={4} xs={6}>
                <CFormLabel className="small fw-bold">Prep. (Min)</CFormLabel>
                <CFormInput type="number" name="prepTimeMinutes" value={formData.prepTimeMinutes} onChange={handleChange} required />
              </CCol>

              <CCol md={4} xs={6}>
                <CFormLabel className="small fw-bold">Cocción (Min)</CFormLabel>
                <CFormInput type="number" name="cookTimeMinutes" value={formData.cookTimeMinutes} onChange={handleChange} required />
              </CCol>

              <CCol md={4} xs={6}>
                <CFormLabel className="small fw-bold">Porciones</CFormLabel>
                <CFormInput type="number" name="servings" value={formData.servings} onChange={handleChange} required />
              </CCol>

              <CCol md={4} xs={6}>
                <CFormLabel className="small fw-bold">Calorías / Porción</CFormLabel>
                <CFormInput type="number" name="caloriesPerServing" value={formData.caloriesPerServing} onChange={handleChange} required />
              </CCol>

              <CCol md={4} xs={12}>
                <CFormLabel className="small fw-bold">ID del Usuario Creador (userId)</CFormLabel>
                <CFormInput type="number" name="userId" value={formData.userId} onChange={handleChange} required />
              </CCol>

              <CCol xs={12}>
                <CFormLabel className="small fw-bold">URL de la Imagen</CFormLabel>
                <CFormInput type="url" name="image" value={formData.image} onChange={handleChange} required />
              </CCol>

              {/* SECCIÓN DE CHIPS PARA TAGS */}
              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Etiquetas (Tags)</CFormLabel>
                <div className="d-flex flex-wrap gap-2 mb-2 p-2 border rounded bg-light" style={{ minHeight: '50px' }}>
                  {formData.tags.length === 0 ? (
                    <span className="text-muted small fst-italic">Sin etiquetas seleccionadas.</span>
                  ) : (
                    formData.tags.map((tag, index) => (
                      <CBadge key={index} color="primary" className="d-flex align-items-center gap-1 p-2">
                        {tag}
                        <CIcon icon={cilX} size="sm" style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
                      </CBadge>
                    ))
                  )}
                </div>
                <div className="d-flex flex-wrap gap-1" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  <span className="small text-muted align-self-center me-2">Disponibles:</span>
                  {availableTags
                    .filter((t) => !formData.tags.includes(t))
                    .map((tag, index) => (
                      <CButton 
                        key={index} 
                        color="secondary" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddTag(tag)}
                        className="py-0 px-2 small mb-1"
                      >
                        <CIcon icon={cilPlus} size="sm" className="me-1" /> {tag}
                      </CButton>
                    ))}
                </div>
              </CCol>

              {/* SECCIÓN DE CHIPS PARA MEAL TYPE (Dinámico desde la API) */}
              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Tipo de Comida (Meal Type)</CFormLabel>
                <div className="d-flex flex-wrap gap-2 mb-2 p-2 border rounded bg-light" style={{ minHeight: '50px' }}>
                  {formData.mealType.length === 0 ? (
                    <span className="text-muted small fst-italic">Sin tipos seleccionados.</span>
                  ) : (
                    formData.mealType.map((meal, index) => (
                      <CBadge key={index} color="success" className="d-flex align-items-center gap-1 p-2">
                        {meal}
                        <CIcon 
                          icon={cilX} 
                          size="sm" 
                          style={{ cursor: 'pointer' }} 
                          onClick={() => handleRemoveMealType(meal)} 
                        />
                      </CBadge>
                    ))
                  )}
                </div>
                <div className="d-flex flex-wrap gap-1" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                  <span className="small text-muted align-self-center me-2">Disponibles:</span>
                  {availableMealTypes
                    .filter((m) => !formData.mealType.includes(m))
                    .map((meal, index) => (
                      <CButton 
                        key={index} 
                        color="secondary" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddMealType(meal)}
                        className="py-0 px-2 small mb-1"
                      >
                        <CIcon icon={cilPlus} size="sm" className="me-1" /> {meal}
                      </CButton>
                    ))}
                </div>
              </CCol>

              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Ingredientes (Uno por línea)</CFormLabel>
                <CFormTextarea name="ingredients" rows={5} value={formData.ingredients} onChange={handleChange} required />
              </CCol>

              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Instrucciones (Un paso por línea)</CFormLabel>
                <CFormTextarea name="instructions" rows={5} value={formData.instructions} onChange={handleChange} required />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" variant="outline" as={Link} to="/recipes" disabled={submitting}>
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit" disabled={submitting}>
                  {submitting ? <CSpinner size="sm" /> : <><CIcon icon={cilSave} className="me-2" /> {isEditMode ? 'Actualizar Receta' : 'Crear Receta'}</>}
                </CButton>
              </CCol>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RecipeForm