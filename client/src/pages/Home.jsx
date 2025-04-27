"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import BannerSimple from "../components/BannerSimple"
import ProductCard from "../components/ProductCard"
import Footer from "../components/Footer"
import { motion } from "framer-motion"
import axios from "axios"
import menwear from "../assets/men_wear.jpg"
import womenwear from "../assets/women_wear.jpg"  
import accessories from "../assets/accessories_wear.jpg"
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
        const newArrivalsRes = await axios.get("/api/products?sort=createdAt&limit=6")

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
        <div className="container">
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
            <div className="row">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
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
        <div className="container">
          <motion.div
            className="section-title text-center mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="display-5 fw-bold">Shop by Category</h2>
            <p className="lead">Browse our collections by category</p>
          </motion.div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <motion.div
                className="category-card position-relative rounded overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src= {menwear}
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

            <div className="col-md-4 mb-4">
              <motion.div
                className="category-card position-relative rounded overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={womenwear}
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

            <div className="col-md-4 mb-4">
              <motion.div
                className="category-card position-relative rounded overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={accessories}
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
        <div className="container">
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
            <div className="row">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
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
