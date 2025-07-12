import express from "express"
import Category from "../models/categoryModel.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({})
    res.json(categories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Fetch single category
// @route   GET /api/categories/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (category) {
      res.json(category)
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description, image } = req.body

    const categoryExists = await Category.findOne({ name })

    if (categoryExists) {
      res.status(400).json({ message: "Category already exists" })
      return
    }

    const category = new Category({
      name,
      description,
      image,
    })

    const createdCategory = await category.save()
    res.status(201).json(createdCategory)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, description, image } = req.body

    const category = await Category.findById(req.params.id)

    if (category) {
      category.name = name || category.name
      category.description = description || category.description
      category.image = image || category.image

      const updatedCategory = await category.save()
      res.json(updatedCategory)
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (category) {
      await category.remove()
      res.json({ message: "Category removed" })
    } else {
      res.status(404).json({ message: "Category not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

export default router
