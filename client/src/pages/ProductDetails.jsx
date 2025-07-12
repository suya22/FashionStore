"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import Footer from "../components/Footer"
import { FaShoppingCart, FaHeart, FaStar, FaStarHalfAlt, FaRegStar, FaTruck } from "react-icons/fa"
import axios from "axios"
import { motion } from "framer-motion"
import ImageWithFallback from "../components/ImageWithFallback"
import { getImageUrl } from "../utils/imageUtils"

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [reviews, setReviews] = useState([])
  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(5)
  const [relatedProducts, setRelatedProducts] = useState([])

  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price) // No conversion, use the price directly
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRes = await axios.get(`/api/products/${id}`)
        setProduct(productRes.data)
        setSelectedSize(productRes.data.sizes[0] || "")

        // Fetch reviews
        try {
          const reviewsRes = await axios.get(`/api/products/${id}/reviews`)
          setReviews(reviewsRes.data || [])
        } catch (error) {
          console.error("Error fetching reviews:", error)
          setReviews([])
        }

        // Fetch related products
        try {
          const relatedRes = await axios.get(`/api/products/related/${id}`)
          setRelatedProducts(relatedRes.data || [])
        } catch (error) {
          console.error("Error fetching related products:", error)
          setRelatedProducts([])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    addToCart({
      ...product,
      quantity,
      selectedSize,
    })
  }

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } })
      return
    }

    handleAddToCart()
    navigate("/checkout")
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (!user) {
      navigate("/login", { state: { from: `/product/${id}` } })
      return
    }

    try {
      const res = await axios.post(`/api/products/${id}/reviews`, {
        rating,
        comment: reviewText,
      })

      setReviews([...reviews, res.data])
      setReviewText("")
      setRating(5)
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />)
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />)
    }

    return stars
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product not found</h2>
      </div>
    )
  }

  return (
    <div>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <motion.div
              className="product-main-image mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ImageWithFallback
                src={getImageUrl(product.images, selectedImage) || "/placeholder.svg"}
                alt={product.title}
                className="img-fluid rounded"
                style={{ width: "100%", height: "400px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.src = "/placeholder.svg"
                }}
              />
            </motion.div>

            <div className="product-thumbnails d-flex overflow-auto">
              {product.images &&
                product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail-container me-2 ${selectedImage === index ? "border border-primary" : ""}`}
                    onClick={() => setSelectedImage(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <ImageWithFallback
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      className="img-thumbnail"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="col-lg-6">
            <h1 className="mb-3">{product.title}</h1>

            <div className="d-flex align-items-center mb-3">
              <div className="me-2">{renderStars(product.rating)}</div>
              <span className="text-muted">({reviews.length} reviews)</span>
            </div>

            <h2 className="fs-3 fw-bold mb-4">{formatPrice(product.price)}</h2>

            <p className="mb-4">{product.description}</p>

            <div className="mb-4">
              <h5>Size</h5>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn ${selectedSize === size ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h5>Quantity</h5>
              <div className="input-group" style={{ width: "150px" }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="d-flex gap-2 mb-4">
              <button className="btn btn-primary d-flex align-items-center" onClick={handleAddToCart}>
                <FaShoppingCart className="me-2" />
                Add to Cart
              </button>
              <button className="btn btn-success" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="btn btn-outline-danger">
                <FaHeart />
              </button>
            </div>

            <div className="product-meta">
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Availability:</strong> {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {/* Indian-specific delivery information */}
            <div className="mt-4 p-3 bg-light rounded">
              <div className="d-flex align-items-center mb-2">
                <FaTruck className="text-success me-2" />
                <strong>Free delivery across India</strong>
              </div>
              <p className="mb-1 small">• Free delivery on orders above ₹499</p>
              <p className="mb-1 small">• COD available in most locations</p>
              <p className="mb-0 small">• Easy returns within 14 days</p>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-12">
            <ul className="nav nav-tabs" id="productTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="description-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#description"
                  type="button"
                  role="tab"
                  aria-controls="description"
                  aria-selected="true"
                >
                  Description
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="reviews-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#reviews"
                  type="button"
                  role="tab"
                  aria-controls="reviews"
                  aria-selected="false"
                >
                  Reviews ({reviews.length})
                </button>
              </li>
            </ul>
            <div className="tab-content p-4 border border-top-0 rounded-bottom" id="productTabsContent">
              <div
                className="tab-pane fade show active"
                id="description"
                role="tabpanel"
                aria-labelledby="description-tab"
              >
                <div dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }} />
              </div>
              <div className="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
                <div className="reviews-container">
                  {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review this product!</p>
                  ) : (
                    <div className="mb-4">
                      {reviews.map((review, index) => (
                        <div key={index} className="review-item border-bottom pb-3 mb-3">
                          <div className="d-flex justify-content-between">
                            <h5>{review.name || "Anonymous"}</h5>
                            <small className="text-muted">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "Recent"}
                            </small>
                          </div>
                          <div className="mb-2">{renderStars(review.rating)}</div>
                          <p>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="add-review">
                    <h4>Add a Review</h4>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-3">
                        <label htmlFor="rating" className="form-label">
                          Rating
                        </label>
                        <select
                          className="form-select"
                          id="rating"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="reviewText" className="form-label">
                          Your Review
                        </label>
                        <textarea
                          className="form-control"
                          id="reviewText"
                          rows="3"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products mt-5">
            <h3 className="mb-4">You May Also Like</h3>
            <div className="row">
              {relatedProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="col-md-3 col-sm-6 mb-4">
                  <div className="card h-100">
                    <ImageWithFallback
                      src={getImageUrl(product.images) || "/placeholder.svg"}
                      alt={product.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text fw-bold">{formatPrice(product.price)}</p>
                      <a href={`/product/${product._id}`} className="btn btn-outline-primary">
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default ProductDetails
