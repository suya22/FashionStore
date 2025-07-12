import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/userModel.js"
import Product from "./models/productModel.js"
import Category from "./models/categoryModel.js"
import bcrypt from "bcryptjs"

// Load env vars
dotenv.config()

// Check if MongoDB URI is defined
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in your environment variables")
  process.exit(1)
}

console.log("Attempting to connect to MongoDB...")

const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected")

    // Clear existing categories
    await Category.deleteMany()
    console.log("Existing categories removed")

    // Create default categories
    const categories = [
      {
        name: "Men's Clothing",
        description: "Clothing items for men",
        image: "/images/category-men.jpg",
      },
      {
        name: "Women's Clothing",
        description: "Clothing items for women",
        image: "/images/category-women.jpg",
      },
      {
        name: "Accessories",
        description: "Fashion accessories for all",
        image: "/images/category-accessories.jpg",
      },
      {
        name: "Footwear",
        description: "Shoes and boots for all occasions",
        image: "/images/category-footwear.jpg",
      },
    ]

    const createdCategories = await Category.insertMany(categories)
    console.log(`${createdCategories.length} categories created`)

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: "admin@example.com" })

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("admin123", salt)

      await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
      })

      console.log("Admin user created")
    } else {
      console.log("Admin user already exists")
    }

    console.log("Data Import Complete!")
  } catch (error) {
    console.error(`Error: ${error.message}`)
  } finally {
    // Close the connection whether successful or not
    mongoose.disconnect()
    console.log("MongoDB Disconnected")
  }
}

const destroyData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected")

    // Delete data
    await Category.deleteMany()
    await Product.deleteMany()

    console.log("Data Destroyed!")
  } catch (error) {
    console.error(`Error: ${error.message}`)
  } finally {
    // Close the connection whether successful or not
    mongoose.disconnect()
    console.log("MongoDB Disconnected")
  }
}

// Run the appropriate function
if (process.argv[2] === "-d") {
  console.log("Destroying data...")
  destroyData()
} else {
  console.log("Importing data...")
  importData()
}
