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
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSave } from '@coreui/icons'

const EditRecipe = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Estado con el 100% de las propiedades del API de DummyJSON
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    servings: '',
    difficulty: 'Easy',
    cuisine: '',
    caloriesPerServing: '',
    tags: '',
    userId: '',
    image: '',
    mealType: '',
  })

  useEffect(() => {
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
          difficulty: data.difficulty || 'Easy',
          cuisine: data.cuisine || '',
          caloriesPerServing: data.caloriesPerServing || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          userId: data.userId || '',
          image: data.image || '',
          mealType: Array.isArray(data.mealType) ? data.mealType.join(', ') : '',
        })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`https://dummyjson.com/recipes/${id}`, {
        method: 'PUT',
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
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
          userId: Number(formData.userId),
          image: formData.image,
          mealType: formData.mealType.split(',').map((m) => m.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) throw new Error('Error al actualizar la receta en el servidor.')

      alert('¡Receta actualizada con éxito!')
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
          <h3 className="fw-bold mb-0 text-primary">Editar Receta (Completa)</h3>
          <span className="text-muted small">Todos los campos sincronizados con la API</span>
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
            📝 Modificar Registro ID: {id}
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

              <CCol md={4} xs={12}>
                <CFormLabel className="small fw-bold">Dificultad</CFormLabel>
                <CFormSelect name="difficulty" value={formData.difficulty} onChange={handleChange}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </CFormSelect>
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

              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Etiquetas (Tags - separadas por comas)</CFormLabel>
                <CFormInput name="tags" value={formData.tags} onChange={handleChange} placeholder="Pizza, Italian, Fast Food" />
              </CCol>

              <CCol md={6} xs={12}>
                <CFormLabel className="small fw-bold">Tipos de Comida (Meal Type - separados por comas)</CFormLabel>
                <CFormInput name="mealType" value={formData.mealType} onChange={handleChange} placeholder="Dinner, Lunch" />
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
                  {submitting ? <CSpinner size="sm" /> : <><CIcon icon={cilSave} className="me-2" /> Guardar Todo</>}
                </CButton>
              </CCol>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default EditRecipe