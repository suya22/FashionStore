import jwt from "jsonwebtoken"

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables")
    throw new Error("JWT_SECRET is not defined")
  }

  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })
    return token
  } catch (error) {
    console.error(`Token generation error: ${error.message}`)
    throw error
  }
}

export default generateToken
