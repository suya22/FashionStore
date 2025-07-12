import express from "express"
import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import User from "../models/userModel.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalOrders = await Order.countDocuments()

    const orders = await Order.find({ isPaid: true })
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0)

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Get recent orders
// @route   GET /api/admin/orders/recent
// @access  Private/Admin
router.get("/orders/recent", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name").sort({ createdAt: -1 }).limit(5)

    res.json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

export default router
