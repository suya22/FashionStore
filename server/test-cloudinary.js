import dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"

// Load environment variables
dotenv.config()

// Log environment variables (without revealing full secrets)
console.log("Environment Variables Check:")
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "Not set")
console.log(
  "CLOUDINARY_API_KEY:",
  process.env.CLOUDINARY_API_KEY ? "Set (length: " + process.env.CLOUDINARY_API_KEY.length + ")" : "Not set",
)
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "Set (length: " + process.env.CLOUDINARY_API_SECRET.length + ")" : "Not set",
)

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

// Test Cloudinary connection
const testCloudinary = async () => {
  try {
    console.log("Testing Cloudinary connection...")
    const result = await cloudinary.api.ping()
    console.log("Cloudinary connection successful:", result)
  } catch (error) {
    console.error("Cloudinary connection failed:", error)
  }
}

testCloudinary()
