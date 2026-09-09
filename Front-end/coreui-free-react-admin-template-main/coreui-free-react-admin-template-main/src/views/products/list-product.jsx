import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'

const ListProduct = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtros y Paginación
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [totalProducts, setTotalProducts] = useState(0)

  // Estado para el Modal de Eliminación
  const [visibleModal, setVisibleModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // 1. Obtener categorías al montar el componente
  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then((res) => res.json())
      .then((data) => {
        const formattedCategories = data.map((cat) => (typeof cat === 'string' ? cat : cat.slug))
        setCategories(formattedCategories)
      })
      .catch((err) => console.error('Error cargando categorías:', err))
  }, [])

  // 2. Cargar productos basados en búsqueda, categoría, orden y paginación
  useEffect(() => {
    setLoading(true)
    setError(null)

    const skip = (currentPage - 1) * itemsPerPage
    let url = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${skip}`

    if (search.trim()) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${itemsPerPage}&skip=${skip}`
    } else if (selectedCategory !== 'all') {
      url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${itemsPerPage}&skip=${skip}`
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con la API')
        return res.json()
      })
      .then((data) => {
        let fetchedProducts = data.products || []

        fetchedProducts.sort((a, b) => {
          let valA = a[sortBy]
          let valB = b[sortBy]

          if (typeof valA === 'string') {
            valA = valA.toLowerCase()
            valB = valB.toLowerCase()
          }

          if (valA < valB) return sortOrder === 'asc' ? -1 : 1
          if (valA > valB) return sortOrder === 'asc' ? 1 : -1
          return 0
        })

        setProducts(fetchedProducts)
        setTotalProducts(data.total || 0)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [search, selectedCategory, sortBy, sortOrder, currentPage, itemsPerPage])

  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const handleSearch = (value) => {
    setSearch(value)
    setSelectedCategory('all')
    setCurrentPage(1)
  }

  const handleCategory = (value) => {
    setSelectedCategory(value)
    setSearch('')
    setCurrentPage(1)
  }

  const handleItemsPerPage = (value) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Funciones para manejar la eliminación
  const openDeleteModal = (product) => {
    setProductToDelete(product)
    setVisibleModal(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    setDeleteLoading(true)
    try {
      const response = await fetch(`https://dummyjson.com/products/${productToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('No se pudo eliminar el producto')

      const data = await response.json()
      console.log('Producto eliminado (Simulado por API):', data)

      // Actualizar el estado localmente removiendo el producto eliminado de la tabla
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      setTotalProducts((prev) => prev - 1)

      setVisibleModal(false)
      setProductToDelete(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          {/* HEADER */}
          <CCardHeader>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>Products Manager</strong>
                <div className="small text-body-secondary">
                  Manage your products from DummyJSON API
                </div>
              </div>

              <CButton color="primary" as={Link} to="/products/new">
                + New product
              </CButton>
            </div>
          </CCardHeader>

          <CCardBody>
            {/* FILTROS */}
            <CRow className="mb-3 g-2">
              <CCol md={5}>
                <CFormInput
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) => handleSearch(event.target.value)}
                />
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  value={selectedCategory}
                  onChange={(event) => handleCategory(event.target.value)}
                >
                  <option value="all">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={2}>
                <CFormSelect
                  value={itemsPerPage}
                  onChange={(event) => handleItemsPerPage(event.target.value)}
                >
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </CFormSelect>
              </CCol>

              <CCol md={2}>
                <CButton
                  color="secondary"
                  variant="outline"
                  className="w-100"
                  onClick={() => {
                    setSearch('')
                    setSelectedCategory('all')
                    setSortBy('id')
                    setSortOrder('asc')
                    setCurrentPage(1)
                  }}
                >
                  Clear filters
                </CButton>
              </CCol>
            </CRow>

            {/* INFO */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-body-secondary small">
                {totalProducts > 0
                  ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
                      currentPage * itemsPerPage,
                      totalProducts,
                    )} of ${totalProducts} products`
                  : 'No products to show'}
              </span>
            </div>

            {error && (
              <div className="alert alert-danger text-center my-3" role="alert">
                {error}
              </div>
            )}

            <div className="table-responsive position-relative" style={{ minHeight: '200px' }}>
              {loading && (
                <div
                  className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
                  style={{ zIndex: 10 }}
                >
                  <CSpinner color="primary" />
                </div>
              )}

              <CTable hover align="middle">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell
                      scope="col"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('id')}
                    >
                      ID {getSortIcon('id')}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('title')}
                    >
                      Product {getSortIcon('title')}
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('price')}
                    >
                      Price {getSortIcon('price')}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      scope="col"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('stock')}
                    >
                      Stock {getSortIcon('stock')}
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Brand</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-end">
                      Actions
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <CTableRow key={product.id}>
                        <CTableHeaderCell scope="row">#{product.id}</CTableHeaderCell>
                        <CTableDataCell>
                          <strong>{product.title}</strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="badge bg-info">{product.category}</span>
                        </CTableDataCell>
                        <CTableDataCell>${product.price?.toFixed(2)}</CTableDataCell>
                        <CTableDataCell>
                          <span
                            className={
                              product.stock < 20
                                ? 'text-danger fw-semibold'
                                : 'text-success'
                            }
                          >
                            {product.stock}
                          </span>
                        </CTableDataCell>
                        <CTableDataCell>{product.brand || 'N/A'}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CButton color="primary" variant="ghost" size="sm" className="me-2" as={Link}
                          to={`/products/edit/${product.id}`}>
                            Edit
                          </CButton>

                          <CButton 
                            color="info" 
                            variant="ghost" 
                            size="sm" 
                            className="me-2 text-white"
                            as={Link}
                            to={`/products/view/${product.id}`}>
                            View
                          </CButton>

                          <CButton
                            color="danger"
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteModal(product)}
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    !loading && (
                      <CTableRow>
                        <CTableDataCell colSpan={7} className="text-center py-5">
                          No products found
                        </CTableDataCell>
                      </CTableRow>
                    )
                  )}
                </CTableBody>
              </CTable>
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <CPagination>
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </CPaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1),
                    )
                    .map((page, idx, arr) => {
                      return (
                        <React.Fragment key={page}>
                          {idx > 0 && arr[idx - 1] !== page - 1 && (
                            <CPaginationItem disabled>...</CPaginationItem>
                          )}
                          <CPaginationItem
                            active={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </CPaginationItem>
                        </React.Fragment>
                      )
                    })}

                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </div>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
        <CModalHeader onClose={() => setVisibleModal(false)}>
          <CModalTitle>Confirm Delete</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the product{' '}
          <strong>{productToDelete?.title}</strong>? This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            variant="outline"
            onClick={() => setVisibleModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </CButton>
          <CButton color="danger" onClick={confirmDelete} disabled={deleteLoading}>
            {deleteLoading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListProduct