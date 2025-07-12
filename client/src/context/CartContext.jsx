"use client"

import { createContext, useState, useEffect } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))

    const newTotal = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    setTotal(newTotal)
  }, [cart])

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(
      (item) => item._id === product._id && (product.selectedSize ? item.selectedSize === product.selectedSize : true),
    )

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += product.quantity || 1
      setCart(updatedCart)
    } else {
      setCart([...cart, { ...product, quantity: product.quantity || 1 }])
    }
  }

  const removeFromCart = (id, size = null) => {
    const updatedCart = cart.filter((item) => {
      if (size) {
        return !(item._id === id && item.selectedSize === size)
      }
      return item._id !== id
    })

    setCart(updatedCart)
  }

  const updateQuantity = (id, quantity, size = null) => {
    const updatedCart = cart.map((item) => {
      if (item._id === id && (size ? item.selectedSize === size : true)) {
        return { ...item, quantity }
      }
      return item
    })

    setCart(updatedCart)
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
