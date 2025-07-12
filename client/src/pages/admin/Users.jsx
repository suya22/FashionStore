import { Link } from "react-router-dom"

const AdminUsers = () => {
  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4">Users Management</h1>

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
            <Link to="/admin/orders" className="nav-link">
              Orders
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/users" className="nav-link active">
              Users
            </Link>
          </li>
        </ul>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">All Users</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Admin User</td>
                  <td>admin@example.com</td>
                  <td>Yes</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                    <button className="btn btn-sm btn-outline-danger">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
