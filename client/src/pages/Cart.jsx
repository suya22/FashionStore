"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import Footer from "../components/Footer"
import { FaTrash, FaArrowLeft, FaShoppingCart } from "react-icons/fa"
import { motion } from "framer-motion"

const Cart = () => {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price) // No conversion, use the price directly
  }

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } })
    } else {
      navigate("/checkout")
    }
  }

  return (
    <div>
      <div className="container py-5">
        <h1 className="mb-4">Your Shopping Cart</h1>

        {cart.length === 0 ? (
          <motion.div
            className="text-center py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaShoppingCart size={60} className="text-muted mb-4" />
            <h3>Your cart is empty</h3>
            <p className="mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/collection" className="btn btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={`${item._id}-${item.selectedSize || "default"}`}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.images[0] || "/placeholder.svg"}
                                  alt={item.title}
                                  className="img-thumbnail me-3"
                                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                />
                                <div>
                                  <h6 className="mb-0">{item.title}</h6>
                                  {item.selectedSize && <small className="text-muted">Size: {item.selectedSize}</small>}
                                </div>
                              </div>
                            </td>
                            <td>{formatPrice(item.price)}</td>
                            <td>
                              <div className="input-group" style={{ width: "120px" }}>
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item._id, Math.max(1, item.quantity - 1), item.selectedSize)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  className="form-control form-control-sm text-center"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuantity(
                                      item._id,
                                      Math.max(1, Number.parseInt(e.target.value) || 1),
                                      item.selectedSize,
                                    )
                                  }
                                  min="1"
                                />
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  type="button"
                                  onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedSize)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>{formatPrice(item.price * item.quantity)}</td>
                            <td>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeFromCart(item._id, item.selectedSize)}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <Link to="/collection" className="btn btn-outline-primary">
                    <FaArrowLeft className="me-2" />
                    Continue Shopping
                  </Link>
                  <button className="btn btn-outline-danger" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title mb-4">Order Summary</h5>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>{total > 499 ? "Free" : formatPrice(50)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>GST (18%)</span>
                    <span>{formatPrice(total * 0.18)}</span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <strong>Total</strong>
                    <strong>{formatPrice(total + total * 0.18 + (total > 499 ? 0 : 50))}</strong>
                  </div>

                  <button className="btn btn-primary w-100" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title mb-3">Have a coupon?</h5>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Coupon code" />
                    <button className="btn btn-outline-secondary" type="button">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Cart
