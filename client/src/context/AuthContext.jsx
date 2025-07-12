"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await axios.get("/api/users/profile")
          setUser(res.data)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      }

      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      console.log(`Sending login request for: ${email}`)

      // Make sure we're using the correct API endpoint
      const res = await axios.post("/api/users/login", {
        email,
        password,
      })

      console.log("Login response:", res.data)

      localStorage.setItem("token", res.data.token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

      setUser(res.data)
      return res.data
    } catch (error) {
      console.error("Login error in context:", error)
      throw error
    }
  }

  const register = async (name, email, password) => {
    const res = await axios.post("/api/users/register", { name, email, password })

    localStorage.setItem("token", res.data.token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
