import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./App.css"
import axios from "axios"

// Set base URL for axios - make sure this points to your server
axios.defaults.baseURL = "http://localhost:5000"

// Check for token in localStorage and set auth header
const token = localStorage.getItem("token")
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
