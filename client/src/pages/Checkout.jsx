"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import Footer from "../components/Footer"
import axios from "axios"

const Checkout = () => {
  const { cart, total, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "upi",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price) // No conversion, use the price directly
  }

  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(" ")
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
      }))
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cart.length === 0) {
      setError("Your cart is empty")
      return
    }

    setLoading(true)
    setError("")

    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.title,
          image: item.images[0],
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: formData.country,
          state: formData.state,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: total,
        taxPrice: total * 0.18, // GST in India is typically 18%
        shippingPrice: total > 499 ? 0 : 50, // Free shipping above ₹499
        totalPrice: total + total * 0.18 + (total > 499 ? 0 : 50),
      }

      const res = await axios.post("/api/orders", orderData)

      clearCart()
      navigate(`/order/${res.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order")
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="container py-5">
        <h1 className="mb-4">Checkout</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Shipping Information</h5>

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="House/Flat No., Building Name, Street"
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="state" className="form-label">
                        State
                      </label>
                      <select
                        className="form-select"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="zipCode" className="form-label">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        placeholder="6-digit PIN code"
                        maxLength="6"
                        pattern="[0-9]{6}"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <select
                        className="form-select"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>

                  <h5 className="mt-4 mb-3">Payment Method</h5>

                  <div className="mb-3">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="upi"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="upi">
                        UPI (Google Pay, PhonePe, Paytm)
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="netbanking"
                        value="netbanking"
                        checked={formData.paymentMethod === "netbanking"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="netbanking">
                        Net Banking
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="credit"
                        value="credit"
                        checked={formData.paymentMethod === "credit"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="credit">
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        Cash on Delivery (COD)
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === "upi" && (
                    <div className="mb-3">
                      <label htmlFor="upiId" className="form-label">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="upiId"
                        placeholder="yourname@upi"
                        required={formData.paymentMethod === "upi"}
                      />
                    </div>
                  )}

                  {formData.paymentMethod === "credit" && (
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="cardNumber" className="form-label">
                          Card Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required={formData.paymentMethod === "credit"}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="expDate" className="form-label">
                          Exp Date
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="expDate"
                          placeholder="MM/YY"
                          required={formData.paymentMethod === "credit"}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="cvv" className="form-label">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="cvv"
                          placeholder="123"
                          required={formData.paymentMethod === "credit"}
                        />
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary mt-3" disabled={loading || cart.length === 0}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>

                <div className="order-items mb-4">
                  {cart.map((item) => (
                    <div key={`${item._id}-${item.selectedSize || "default"}`} className="d-flex mb-2">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="img-thumbnail me-2"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="mb-0">{item.title}</p>
                            <small className="text-muted">
                              {item.selectedSize && `Size: ${item.selectedSize}`} | Qty: {item.quantity}
                            </small>
                          </div>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Checkout
