"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
