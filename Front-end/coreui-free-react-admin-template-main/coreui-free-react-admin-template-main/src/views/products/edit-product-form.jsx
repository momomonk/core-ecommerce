import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

const EditProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
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

  // 1. Cargar categorías desde la API
  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron cargar las categorías')
        return res.json()
      })
      .then((data) => {
        const formattedCategories = data.map((cat) => (typeof cat === 'string' ? cat : cat.slug))
        setCategories(formattedCategories)
        setLoadingCategories(false)
      })
      .catch((err) => {
        console.error('Error al obtener categorías:', err)
        setLoadingCategories(false)
      })
  }, [])

  // 2. Cargar los datos actuales del producto a editar
  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo encontrar el producto')
        return res.json()
      })
      .then((data) => {
        setFormData({
          title: data.title || '',
          category: data.category || '',
          price: data.price ? data.price.toString() : '',
          stock: data.stock !== undefined ? data.stock.toString() : '',
          brand: data.brand || '',
        })
        setLoadingProduct(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoadingProduct(false)
      })
  }, [id])

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

    const updatedProduct = {
      title: formData.title,
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      brand: formData.brand || 'N/A',
    }

    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el producto en el servidor')
      }

      const data = await response.json()
      console.log('Producto actualizado exitosamente (Simulado):', data)

      // Regresar a la vista anterior (listado)
      navigate(-1)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Product ID: #{id} (DummyJSON API)</strong>
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
                      Updating...
                    </>
                  ) : (
                    'Update Product'
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

export default EditProductForm