"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import Footer from "../components/Footer"
import axios from "axios"
import { motion } from "framer-motion"
import { preloadImages } from "../utils/imageUtils"

const Collection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    priceRange: "",
    sort: "newest",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories")
        setCategories(res.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories. Please try again.")
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        let query = "/api/products?"

        if (filters.category) {
          query += `category=${filters.category}&`
        }

        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split("-")
          query += `minPrice=${min}&maxPrice=${max}&`
        }

        if (filters.sort === "newest") {
          query += "sort=-createdAt"
        } else if (filters.sort === "price-low") {
          query += "sort=price"
        } else if (filters.sort === "price-high") {
          query += "sort=-price"
        }

        const res = await axios.get(query)

        // Preload images for better user experience
        if (res.data && res.data.length > 0) {
          const imageUrls = res.data
            .map((product) => (product.images && product.images.length > 0 ? product.images[0] : null))
            .filter(Boolean)

          preloadImages(imageUrls)
        }

        setProducts(res.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again.")
        setLoading(false)
      }
    }

    fetchProducts()

    // Update URL params
    const params = new URLSearchParams()
    if (filters.category) params.set("category", filters.category)
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div>
      <div className="collection-header bg-light py-5">
        <div className="container">
          <h1 className="display-5 fw-bold text-center">Our Collection</h1>
          <p className="lead text-center">Discover our wide range of clothing and accessories</p>
        </div>
      </div>

      <div className="container py-5">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="filters-container p-3 border rounded">
              <h4 className="mb-3">Filters</h4>

              <div className="mb-4">
                <h5 className="mb-2">Categories</h5>
                <select name="category" className="form-select" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name.toLowerCase()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <h5 className="mb-2">Price Range</h5>
                <select
                  name="priceRange"
                  className="form-select"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                >
                  <option value="">All Prices</option>
                  <option value="0-500">₹0 - ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-2000">₹1000 - ₹2000</option>
                  <option value="2000-5000">₹2000+</option>
                </select>
              </div>

              <div className="mb-4">
                <h5 className="mb-2">Sort By</h5>
                <select name="sort" className="form-select" value={filters.sort} onChange={handleFilterChange}>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <button
                className="btn btn-outline-secondary w-100"
                onClick={() =>
                  setFilters({
                    category: "",
                    priceRange: "",
                    sort: "newest",
                  })
                }
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <h3>No products found</h3>
                <p>Try changing your filters or check back later for new items.</p>
              </div>
            ) : (
              <motion.div
                className="row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Collection
