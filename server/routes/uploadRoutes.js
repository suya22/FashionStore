import express from "express"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer"
import { protect, admin } from "../middleware/authMiddleware.js"
import dotenv from "dotenv"

// Ensure environment variables are loaded
dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Create a simple storage for multer (we'll handle Cloudinary upload manually)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router()

// Upload route - single file upload
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" })
    }

    // Convert buffer to base64
    const fileStr = req.file.buffer.toString("base64")
    const fileType = req.file.mimetype

    // Upload to Cloudinary with optimization settings
    const uploadResponse = await cloudinary.uploader.upload(`data:${fileType};base64,${fileStr}`, {
      folder: "fashion-store",
      resource_type: "auto",
      quality: "auto",
      fetch_format: "auto",
      responsive: true,
      eager: [
        { width: 300, height: 300, crop: "fill" },
        { width: 600, height: 600, crop: "fill" },
      ],
      eager_async: true,
    })

    res.json({
      success: true,
      imageUrl: uploadResponse.secure_url,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ success: false, message: "Image upload failed: " + error.message })
  }
})

// Upload route - multiple files upload
router.post("/multiple", protect, admin, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" })
    }

    const uploadPromises = req.files.map(async (file) => {
      // Convert buffer to base64
      const fileStr = file.buffer.toString("base64")
      const fileType = file.mimetype

      // Upload to Cloudinary with optimization settings
      const uploadResponse = await cloudinary.uploader.upload(`data:${fileType};base64,${fileStr}`, {
        folder: "fashion-store",
        resource_type: "auto",
        quality: "auto",
        fetch_format: "auto",
        responsive: true,
        eager: [
          { width: 300, height: 300, crop: "fill" },
          { width: 600, height: 600, crop: "fill" },
        ],
        eager_async: true,
      })

      return uploadResponse.secure_url
    })

    const imageUrls = await Promise.all(uploadPromises)

    res.json({
      success: true,
      imageUrls: imageUrls,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ success: false, message: "Images upload failed: " + error.message })
  }
})

export default router
