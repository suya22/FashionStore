"use client"

import React from "react"
import { Link } from "react-router-dom"
import { FaShoppingCart, FaHeart } from "react-icons/fa"

const ImageWithFallback = ({ src, alt, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = React.useState(src)

  const onError = () => {
    setImgSrc(fallbackSrc)
  }

  return <img src={imgSrc || "/placeholder.svg"} alt={alt} onError={onError} {...props} />
}

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    // Placeholder for add to cart functionality
    console.log("Added to cart:", product._id)
  }

  return (
    <div className="card product-card h-100 shadow-sm">
      <div className="position-relative">
        <Link to={`/product/${product._id}`}>
          <ImageWithFallback
            src={imageUrl || "/placeholder.svg"}
            alt={product.title}
            className="card-img-top product-image"
            style={{ height: "320px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
            loading="lazy"
          />
        </Link>
        <div className="product-actions position-absolute" style={{ top: "10px", right: "10px" }}>
          <button className="btn btn-sm btn-primary rounded-circle me-2" onClick={handleAddToCart}>
            <FaShoppingCart />
          </button>
          <button className="btn btn-sm btn-outline-danger rounded-circle">
            <FaHeart />
          </button>
        </div>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <h6 className="card-title product-title mb-2" style={{ fontSize: "0.9rem", lineHeight: "1.2" }}>
          {product.title}
        </h6>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="product-price fw-bold text-primary" style={{ fontSize: "1rem" }}>
            {formatPrice(product.price)}
          </span>
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(product.rating || 0) ? "text-warning" : "text-muted"}
                style={{ fontSize: "0.8rem" }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
