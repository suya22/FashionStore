import { Link } from "react-router-dom"

const AdminOrders = () => {
  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Orders Management</h1>

      {/* Admin Navigation */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link to="/admin" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/products" className="nav-link">
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/orders" className="nav-link active">
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

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">All Orders</h6>
        </div>
        <div className="card-body">
          <p className="text-center">No orders found</p>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
