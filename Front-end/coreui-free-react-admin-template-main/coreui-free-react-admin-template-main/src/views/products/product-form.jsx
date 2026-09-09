import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'

const ProductForm = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState(null)
  
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
  })
  const [validated, setValidated] = useState(false)

  // Cargar categorías desde la API al montar el componente
  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las categorías')
        return res.json()
      })
      .then((data) => {
        // DummyJSON puede devolver strings o objetos con slug, lo manejamos de forma segura
        const formattedCategories = data.map((cat) => (typeof cat === 'string' ? cat : cat.slug))
        setCategories(formattedCategories)
        setLoadingCategories(false)
      })
      .catch((err) => {
        console.error('Error al obtener categorías:', err)
        setLoadingCategories(false)
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }

    setValidated(true)
    setLoading(true)
    setError(null)

    const newProduct = {
      title: formData.title,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      brand: formData.brand || 'N/A',
    }

    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      if (!response.ok) {
        throw new Error('Error al crear el producto en el servidor')
      }

      const data = await response.json()
      console.log('Producto creado exitosamente:', data)

      // Regresar a la vista anterior (listado)
      navigate(-1)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>New Product Form (DummyJSON API)</strong>
          </CCardHeader>
          <CCardBody>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label="Product"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Essence Mascara Lash Princess"
                />
              </CCol>

              <CCol md={6}>
                <CFormSelect
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories ? 'Loading categories...' : 'Choose category...'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="text"
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. Essence"
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="number"
                  step="0.01"
                  label="Price ($)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </CCol>

              <CCol md={6}>
                <CFormInput
                  type="number"
                  label="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="0"
                />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </CButton>
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <CSpinner size="sm" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Product'
                  )}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductForm