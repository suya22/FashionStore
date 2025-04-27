"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { motion } from "framer-motion"
import { FaShoppingCart, FaHeart } from "react-icons/fa"
import ImageWithFallback from "./ImageWithFallback"
import { getImageUrl } from "../utils/imageUtils"

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)

  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price) // No conversion, use the price directly
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  // Get optimized image URL for card display
  const imageUrl = getImageUrl(product.images, 0, {
    context: "card",
    width: 300,
    height: 300,
  })

  return (
    <motion.div
      className="col-md-4 col-sm-6 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <div className="card product-card h-100 shadow-sm">
        <div className="position-relative">
          <Link to={`/product/${product._id}`}>
            <ImageWithFallback
              src={imageUrl || "/placeholder.svg"}
              alt={product.title}
              className="card-img-top product-image"
              style={{ height: "250px", objectFit: "cover" }}
              loading="lazy"
            />
          </Link>
          <div className="product-actions">
            <button className="btn btn-sm btn-primary rounded-circle me-2" onClick={handleAddToCart}>
              <FaShoppingCart />
            </button>
            <button className="btn btn-sm btn-outline-danger rounded-circle">
              <FaHeart />
            </button>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title product-title">{product.title}</h5>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="product-price fw-bold">{formatPrice(product.price)}</span>
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating) ? "text-warning" : "text-muted"}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
