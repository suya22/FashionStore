import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Fashion Store</h5>
            <p>
              Discover the latest trends in Indian fashion and get the best deals on ethnic and western clothing,
              accessories, and more.
            </p>
            <div className="social-icons d-flex gap-3 mt-4">
              <a href="#" className="text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white">
                <FaPinterest size={20} />
              </a>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Shop</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/collection" className="text-white text-decoration-none">
                  Men's Ethnic Wear
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/collection" className="text-white text-decoration-none">
                  Women's Sarees & Suits
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/collection" className="text-white text-decoration-none">
                  New Arrivals
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/collection" className="text-white text-decoration-none">
                  Festival Collection
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Customer Service</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white text-decoration-none">
                  Shipping & Returns
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white text-decoration-none">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="#" className="text-white text-decoration-none">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 col-sm-6 mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" />
                123 Fashion Street, Connaught Place, New Delhi - 110001
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" />
                +91 98765 43210
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" />
                info@fashionstore.in
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {new Date().getFullYear()} Fashion Store India. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="#" className="text-white text-decoration-none">
                  Privacy Policy
                </Link>
              </li>
              <li className="list-inline-item ms-3">
                <Link to="#" className="text-white text-decoration-none">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
