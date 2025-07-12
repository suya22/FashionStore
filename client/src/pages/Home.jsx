"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import BannerSimple from "../components/BannerSimple"
import ProductCard from "../components/ProductCard"
import Footer from "../components/Footer"
import { motion } from "framer-motion"
import axios from "axios"

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price) // No conversion, use the price directly
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const featuredRes = await axios.get("/api/products?featured=true&limit=3")
        const newArrivalsRes = await axios.get("/api/products?sort=createdAt&limit=8")

        setFeaturedProducts(featuredRes.data)
        setNewArrivals(newArrivalsRes.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <BannerSimple />

      <section className="featured-products py-5">
        <div className="container-fluid px-4">
          <motion.div
            className="section-title text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="display-5 fw-bold">Featured Products</h2>
            <p className="lead">Discover our handpicked selection of the season's best styles</p>
          </motion.div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center g-4">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-8">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/collection" className="btn btn-outline-dark">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="categories py-5 bg-light">
        <div className="container-fluid px-4">
          <motion.div
            className="section-title text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="display-5 fw-bold">Shop by Category</h2>
            <p className="lead">Browse our collections by category</p>
          </motion.div>

          <div className="row justify-content-center g-4">
            <div className="col-lg-4 col-md-6">
              <motion.div
                className="category-card position-relative rounded overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/category-men.jpg"
                  alt="Men's Collection"
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
                <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center text-white p-3">
                    <h3 className="fw-bold">Men's Ethnic Wear</h3>
                    <Link to="/collection?category=men" className="btn btn-outline-light mt-2">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-4 col-md-6">
              <motion.div
                className="category-card position-relative rounded overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/category-women.jpg"
                  alt="Women's Collection"
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
                <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center text-white p-3">
                    <h3 className="fw-bold">Women's Sarees & Suits</h3>
                    <Link to="/collection?category=women" className="btn btn-outline-light mt-2">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="col-lg-4 col-md-6">
              <motion.div
                className="category-card position-relative rounded overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/images/category-accessories.jpg"
                  alt="Accessories"
                  className="img-fluid w-100 h-100 object-fit-cover"
                />
                <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center text-white p-3">
                    <h3 className="fw-bold">Accessories</h3>
                    <Link to="/collection?category=accessories" className="btn btn-outline-light mt-2">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="new-arrivals py-5">
        <div className="container-fluid px-4">
          <motion.div
            className="section-title text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="display-5 fw-bold">New Arrivals</h2>
            <p className="lead">The latest additions to our collection</p>
          </motion.div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center g-4">
              {newArrivals.map((product) => (
                <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
