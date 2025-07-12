"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaBox, FaUsers, FaShoppingCart, FaDollarSign, FaChartLine, FaPlus, FaRupeeSign } from "react-icons/fa"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For now, we'll just use placeholder data
        // In a real app, you would fetch this from your API
        setStats({
          totalProducts: 0,
          totalUsers: 2,
          totalOrders: 0,
          totalRevenue: 0,
        })

        setRecentOrders([])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Admin Navigation */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link to="/admin" className="nav-link active">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/products" className="nav-link">
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/orders" className="nav-link">
              Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link">
              Users
            </Link>
          </li>
        </ul>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Products</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalProducts}</div>
                </div>
                <div className="col-auto">
                  <FaBox className="text-gray-300" size={28} />
                </div>
              </div>
              <Link to="/admin/products" className="btn btn-sm btn-primary mt-3">
                <FaPlus className="me-1" /> Add Product
              </Link>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Revenue</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">₹{stats.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="col-auto">
                  <FaRupeeSign className="text-gray-300" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Orders</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalOrders}</div>
                </div>
                <div className="col-auto">
                  <FaShoppingCart className="text-gray-300" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Users</div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.totalUsers}</div>
                </div>
                <div className="col-auto">
                  <FaUsers className="text-gray-300" size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Sales Overview</h6>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                  <FaChartLine size={100} className="text-muted" />
                  <p className="ms-3">Sales chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
              <Link to="/admin/orders" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <p className="text-center">No recent orders</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <Link to={`/admin/orders/${order._id}`}>#{order._id.substring(0, 8)}</Link>
                          </td>
                          <td>{order.user.name}</td>
                          <td>${order.totalPrice.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${order.isPaid ? "bg-success" : "bg-warning"}`}>
                              {order.isPaid ? "Paid" : "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
