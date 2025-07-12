import express from "express"
import Product from "../models/productModel.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1

    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {}

    const category = req.query.category ? { category: req.query.category } : {}

    const featured = req.query.featured ? { featured: req.query.featured === "true" } : {}

    const minPrice = req.query.minPrice ? { price: { $gte: Number(req.query.minPrice) } } : {}

    const maxPrice = req.query.maxPrice ? { price: { ...minPrice.price, $lte: Number(req.query.maxPrice) } } : minPrice

    const sortOption = {}
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith("-") ? req.query.sort.substring(1) : req.query.sort

      const sortDirection = req.query.sort.startsWith("-") ? -1 : 1
      sortOption[sortField] = sortDirection
    } else {
      sortOption.createdAt = -1
    }

    const count = await Product.countDocuments({
      ...keyword,
      ...category,
      ...featured,
      ...maxPrice,
    })

    const products = await Product.find({
      ...keyword,
      ...category,
      ...featured,
      ...maxPrice,
    })
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const { title, description, price, images, category, countInStock, sizes, colors, featured, longDescription } =
      req.body

    const product = new Product({
      user: req.user._id,
      title,
      description,
      longDescription: longDescription || description,
      price,
      images: images || ["/placeholder.svg"],
      category,
      countInStock,
      sizes: sizes || ["S", "M", "L", "XL"],
      colors: colors || ["Black", "White", "Red", "Blue"],
      featured: featured || false,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error: " + error.message })
  }
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { title, description, price, images, category, countInStock, sizes, colors, featured, longDescription } =
      req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      product.title = title || product.title
      product.description = description || product.description
      product.longDescription = longDescription || description || product.longDescription
      product.price = price !== undefined ? price : product.price
      product.images = images || product.images
      product.category = category || product.category
      product.countInStock = countInStock !== undefined ? countInStock : product.countInStock
      product.sizes = sizes || product.sizes
      product.colors = colors || product.colors
      product.featured = featured !== undefined ? featured : product.featured

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error: " + error.message })
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      await product.deleteOne()
      res.json({ message: "Product removed" })
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
      const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString())

      if (alreadyReviewed) {
        res.status(400).json({ message: "Product already reviewed" })
        return
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      }

      product.reviews.push(review)
      product.numReviews = product.reviews.length
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

      await product.save()
      res.status(201).json({ message: "Review added", review })
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

// @desc    Get related products
// @route   GET /api/products/related/:id
// @access  Public
router.get("/related/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(4)

    res.json(relatedProducts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
})

export default router
