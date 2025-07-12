"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"

// Import the image utility functions
import { getImageUrl } from "../../utils/imageUtils.js"
import ImageWithFallback from "../../components/ImageWithFallback"

// Add import for the product utilities
import { standardizeProductName, isValidProductName } from "../../utils/productUtils"

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Red", "Blue"],
    featured: false,
    images: [],
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await axios.get("/api/products")
        const categoriesRes = await axios.get("/api/categories")

        setProducts(productsRes.data)
        setCategories(categoriesRes.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again.")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      countInStock: "",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "White", "Red", "Blue"],
      featured: false,
      images: [],
    })
    setImageFiles([])
    setImagePreviewUrls([])
    setShowAddModal(true)
  }

  const handleEditProduct = (product) => {
    setCurrentProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock,
      sizes: product.sizes || ["S", "M", "L", "XL"],
      colors: product.colors || ["Black", "White", "Red", "Blue"],
      featured: product.featured || false,
      images: product.images || [],
    })
    setImageFiles([])
    setImagePreviewUrls([])
    setShowEditModal(true)
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${id}`)
        setProducts(products.filter((product) => product._id !== id))
      } catch (error) {
        console.error("Error deleting product:", error)
        setError("Failed to delete product. Please try again.")
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)

    // Create preview URLs for the selected images
    const previewUrls = files.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(previewUrls)
  }

  const handleSizeChange = (size) => {
    setFormData((prev) => {
      if (prev.sizes.includes(size)) {
        return {
          ...prev,
          sizes: prev.sizes.filter((s) => s !== size),
        }
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, size],
        }
      }
    })
  }

  const handleColorChange = (color) => {
    setFormData((prev) => {
      if (prev.colors.includes(color)) {
        return {
          ...prev,
          colors: prev.colors.filter((c) => c !== color),
        }
      } else {
        return {
          ...prev,
          colors: [...prev.colors, color],
        }
      }
    })
  }

  const uploadMultipleImages = async (files) => {
    if (!files || files.length === 0) {
      return []
    }

    const formData = new FormData()

    files.forEach((file) => {
      formData.append("images", file)
    })

    try {
      const response = await axios.post("/api/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Upload failed")
      }

      return response.data.imageUrls
    } catch (error) {
      console.error("Error uploading images:", error.response?.data || error.message)
      throw new Error(error.response?.data?.message || "Failed to upload images")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setUploadLoading(true)

    try {
      // Upload images if there are any
      let productImages = formData.images

      if (imageFiles.length > 0) {
        try {
          // Show loading message
          setError("Uploading images, please wait...")

          // Upload all images
          const uploadedImageUrls = await uploadMultipleImages(imageFiles)

          if (uploadedImageUrls && uploadedImageUrls.length > 0) {
            // Combine with existing images if editing
            productImages = showEditModal ? [...formData.images, ...uploadedImageUrls] : uploadedImageUrls
          }
        } catch (uploadError) {
          console.error("Image upload error:", uploadError)
          setError("Image upload failed: " + uploadError.message)
          setUploadLoading(false)
          return // Stop the submission if image upload fails
        }
      }

      // Standardize the product name
      const standardizedTitle = standardizeProductName(formData.title, formData.category)
      if (!isValidProductName(standardizedTitle)) {
        setError("Please enter a valid product name (at least 5 characters)")
        setUploadLoading(false)
        return
      }

      // Update the productData object to use the standardized title
      const productData = {
        ...formData,
        title: standardizedTitle,
        price: Number.parseFloat(formData.price),
        countInStock: Number.parseInt(formData.countInStock),
        images: productImages.length > 0 ? productImages : ["/placeholder.svg"],
      }

      // Clear any error messages
      setError(null)

      // Save the product
      if (showAddModal) {
        const res = await axios.post("/api/products", productData)
        setProducts([...products, res.data])
        setShowAddModal(false)
        alert("Product added successfully!")
      } else if (showEditModal && currentProduct) {
        const res = await axios.put(`/api/products/${currentProduct._id}`, productData)
        setProducts(products.map((product) => (product._id === currentProduct._id ? res.data : product)))
        setShowEditModal(false)
        alert("Product updated successfully!")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      setError(error.response?.data?.message || "Failed to save product. Please try again.")
    } finally {
      setUploadLoading(false)
    }
  }

  const handleRemoveImage = (index) => {
    // Remove from preview URLs if it's a new image
    if (index < imagePreviewUrls.length) {
      const newPreviewUrls = [...imagePreviewUrls]
      newPreviewUrls.splice(index, 1)
      setImagePreviewUrls(newPreviewUrls)

      const newImageFiles = [...imageFiles]
      newImageFiles.splice(index, 1)
      setImageFiles(newImageFiles)
    }
    // Remove from existing images if it's an existing image
    else {
      const existingImageIndex = index - imagePreviewUrls.length
      const newImages = [...formData.images]
      newImages.splice(existingImageIndex, 1)
      setFormData({
        ...formData,
        images: newImages,
      })
    }
  }

  const handleStandardizeAllNames = async () => {
    if (window.confirm("Are you sure you want to standardize all product names?")) {
      setLoading(true)
      setError(null)

      try {
        let updatedCount = 0

        // Process each product
        for (const product of products) {
          const standardizedName = standardizeProductName(product.title, product.category)

          // Only update if the name has changed
          if (standardizedName !== product.title) {
            await axios.put(`/api/products/${product._id}`, {
              ...product,
              title: standardizedName,
            })
            updatedCount++
          }
        }

        // Refresh the product list
        const productsRes = await axios.get("/api/products")
        setProducts(productsRes.data)

        alert(`Successfully standardized ${updatedCount} product names`)
      } catch (err) {
        setError("Error standardizing product names: " + (err.response?.data?.message || err.message))
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Products Management</h1>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={handleStandardizeAllNames}>
              <FaEdit className="me-1" /> Standardize All Names
            </button>
            <button className="btn btn-primary" onClick={handleAddProduct}>
              <FaPlus className="me-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/products" className="nav-link active">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/orders" className="nav-link">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users" className="nav-link">
                Users
              </Link>
            </li>
          </ul>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <ImageWithFallback
                            src={getImageUrl(product.images) || "/placeholder.svg"}
                            alt={product.title}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        </td>
                        <td>{product.title}</td>
                        <td>{product.category}</td>
                        <td>₹{product.price.toFixed(2)}</td>
                        <td>{product.countInStock}</td>
                        <td>{product.featured ? "Yes" : "No"}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditProduct(product)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Product Name*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description*
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">
                        Price (₹)*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="countInStock" className="form-label">
                        Stock*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="countInStock"
                        name="countInStock"
                        value={formData.countInStock}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category*
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Sizes</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <div key={size} className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`size-${size}`}
                            checked={formData.sizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                          />
                          <label className="form-check-label" htmlFor={`size-${size}`}>
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Colors</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink"].map((color) => (
                        <div key={color} className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`color-${color}`}
                            checked={formData.colors.includes(color)}
                            onChange={() => handleColorChange(color)}
                          />
                          <label className="form-check-label" htmlFor={`color-${color}`}>
                            {color}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="featured">
                      Featured Product
                    </label>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="images" className="form-label">
                      Product Images
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="images"
                      multiple
                      onChange={handleImageChange}
                      disabled={uploadLoading}
                    />
                    <small className="text-muted">Upload product images (max 5)</small>

                    {uploadLoading && (
                      <div className="mt-2">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="text-primary">Uploading images...</span>
                      </div>
                    )}

                    {/* Image previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-3">
                        <label className="form-label">Image Previews</label>
                        <div className="d-flex flex-wrap gap-2">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                className="img-thumbnail"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                onClick={() => handleRemoveImage(index)}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={uploadLoading}>
                      {uploadLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Save Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Product Name*
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description*
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="price" className="form-label">
                        Price (₹)*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="countInStock" className="form-label">
                        Stock*
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="countInStock"
                        name="countInStock"
                        value={formData.countInStock}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category*
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Sizes</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <div key={size} className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`size-${size}`}
                            checked={formData.sizes.includes(size)}
                            onChange={() => handleSizeChange(size)}
                          />
                          <label className="form-check-label" htmlFor={`size-${size}`}>
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Colors</label>
                    <div className="d-flex flex-wrap gap-2">
                      {["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink"].map((color) => (
                        <div key={color} className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`color-${color}`}
                            checked={formData.colors.includes(color)}
                            onChange={() => handleColorChange(color)}
                          />
                          <label className="form-check-label" htmlFor={`color-${color}`}>
                            {color}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="featured">
                      Featured Product
                    </label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Current Images</label>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Product ${index + 1}`}
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            className="img-thumbnail"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => {
                              const updatedImages = [...formData.images]
                              updatedImages.splice(index, 1)
                              setFormData({ ...formData, images: updatedImages })
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>

                    <label htmlFor="newImages" className="form-label">
                      Add Images
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="newImages"
                      multiple
                      onChange={handleImageChange}
                      disabled={uploadLoading}
                    />
                    <small className="text-muted">Upload additional product images (max 5)</small>

                    {uploadLoading && (
                      <div className="mt-2">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="text-primary">Uploading images...</span>
                      </div>
                    )}

                    {/* Image previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-3">
                        <label className="form-label">New Image Previews</label>
                        <div className="d-flex flex-wrap gap-2">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="position-relative">
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                className="img-thumbnail"
                                onError={(e) => {
                                  e.target.src = "/placeholder.svg"
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                onClick={() => handleRemoveImage(index)}
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={uploadLoading}>
                      {uploadLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Saving...
                        </>
                      ) : (
                        "Update Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showAddModal || showEditModal) && <div className="modal-backdrop show"></div>}

      <Footer />
    </div>
  )
}

export default AdminProducts
