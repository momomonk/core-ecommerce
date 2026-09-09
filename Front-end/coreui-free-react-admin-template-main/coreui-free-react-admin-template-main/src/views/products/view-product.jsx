import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CBadge,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

const ViewProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar la información del producto')
        return res.json()
      })
      .then((data) => {
        setProduct(data)
        setSelectedImage(data.thumbnail || data.images?.[0] || '')
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
      <div className="alert alert-danger text-center my-4" role="alert">
        {error}
        <div className="mt-3">
          <CButton color="secondary" onClick={() => navigate(-2)}>
            Volver
          </CButton>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Product Details #{product.id}</strong>
              <div className="small text-body-secondary">SKU: {product.sku || 'N/A'}</div>
            </div>
            <div className="d-flex gap-2">
              <CButton color="secondary" variant="outline" size="sm" onClick={() => navigate(-1)}>
                Back to List
              </CButton>
              <CButton
                color="primary"
                size="sm"
                as={Link}
                to={`/products/edit/${product.id}`}
              >
                Edit Product
              </CButton>
            </div>
          </CCardHeader>

          <CCardBody>
            <CRow className="g-4">
              {/* Columna Izquierda: Imágenes */}
              <CCol md={5}>
                <div className="mb-3 text-center border rounded p-3 bg-light">
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="img-fluid rounded"
                    style={{ maxHeight: '350px', objectFit: 'contain' }}
                  />
                </div>
                {/* Miniaturas */}
                {product.images && product.images.length > 1 && (
                  <div className="d-flex gap-2 overflow-auto pb-2">
                    {product.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`thumb-${index}`}
                        className={`border rounded cursor-pointer ${
                          selectedImage === img ? 'border-primary border-2' : ''
                        }`}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setSelectedImage(img)}
                      />
                    ))}
                  </div>
                )}
              </CCol>

              {/* Columna Derecha: Información principal */}
              <CCol md={7}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <CBadge color="info" className="mb-2">
                      {product.category}
                    </CBadge>
                    <h2 className="fw-bold">{product.title}</h2>
                    <p className="text-body-secondary">{product.brand ? `Brand: ${product.brand}` : ''}</p>
                  </div>
                  <div className="text-end">
                    <h3 className="text-success fw-bold">${product.price?.toFixed(2)}</h3>
                    {product.discountPercentage > 0 && (
                      <CBadge color="danger">-{product.discountPercentage}% OFF</CBadge>
                    )}
                  </div>
                </div>

                <p className="mt-3">{product.description}</p>

                <hr />

                {/* Etiquetas (Tags) */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mb-3">
                    <strong>Tags: </strong>
                    {product.tags.map((tag, idx) => (
                      <CBadge key={idx} color="secondary" className="me-1 fw-normal">
                        {tag}
                      </CBadge>
                    ))}
                  </div>
                )}

                {/* Detalles rápidos en tabla pequeña */}
                <CTable small bordered className="mb-3">
                  <CTableBody>
                    <CTableRow>
                      <CTableHeaderCell style={{ width: '30%' }}>Stock</CTableHeaderCell>
                      <CTableDataCell>
                        <span className={product.stock > 0 ? 'text-success fw-semibold' : 'text-danger'}>
                          {product.stock} units ({product.availabilityStatus})
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>Rating</CTableHeaderCell>
                      <CTableDataCell>⭐ {product.rating} / 5.0</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>Minimum Order</CTableHeaderCell>
                      <CTableDataCell>{product.minimumOrderQuantity || 1} units</CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>Weight & Dimensions</CTableHeaderCell>
                      <CTableDataCell>
                        Weight: {product.weight}g <br />
                        Size: {product.dimensions?.width} x {product.dimensions?.height} x {product.dimensions?.depth} cm
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>Warranty & Shipping</CTableHeaderCell>
                      <CTableDataCell>
                        {product.warrantyInformation} <br />
                        {product.shippingInformation}
                      </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell>Return Policy</CTableHeaderCell>
                      <CTableDataCell>{product.returnPolicy}</CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>

            {/* SECCIÓN DE RESEÑAS (REVIEWS) */}
            <hr className="my-4" />
            <h4 className="mb-3">Customer Reviews</h4>
            {product.reviews && product.reviews.length > 0 ? (
              <CRow className="g-3">
                {product.reviews.map((rev, index) => (
                  <CCol md={4} key={index}>
                    <CCard className="h-100 bg-light border-0">
                      <CCardBody>
                        <div className="d-flex justify-content-between mb-2">
                          <strong>{rev.reviewerName || 'Anonymous'}</strong>
                          <span className="text-warning">{'⭐'.repeat(rev.rating)}</span>
                        </div>
                        <p className="small mb-2 fst-italic">"{rev.comment}"</p>
                        <div className="text-body-secondary" style={{ fontSize: '0.75rem' }}>
                          {new Date(rev.date).toLocaleDateString()}
                        </div>
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            ) : (
              <p className="text-body-secondary">No reviews available for this product.</p>
            )}

            {/* METADATOS */}
            {product.meta && (
              <div className="mt-4 pt-3 border-top text-body-secondary small d-flex justify-content-between">
                <span>Barcode: {product.meta.barcode || 'N/A'}</span>
                <span>Created At: {new Date(product.meta.createdAt).toLocaleString()}</span>
                <span>Updated At: {new Date(product.meta.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewProduct