/**
 * Utility functions for handling images
 */

// Cache for images that have already been checked
const validImageCache = new Map()

/**
 * Gets a valid image URL or returns a placeholder
 * @param {string|string[]} image - Image URL or array of image URLs
 * @param {number} index - Index of the image to get (if array)
 * @param {Object} options - Options for image optimization
 * @returns {string} Valid image URL or placeholder
 */
export const getImageUrl = (image, index = 0, options = {}) => {
  if (!image) return "/placeholder.svg"

  let imageUrl

  if (Array.isArray(image)) {
    imageUrl = image.length > index && image[index] ? image[index] : "/placeholder.svg"
  } else {
    imageUrl = image || "/placeholder.svg"
  }

  // Apply Cloudinary transformations if it's a Cloudinary URL
  if (isCloudinaryUrl(imageUrl)) {
    return getCloudinaryUrl(imageUrl, options)
  }

  return imageUrl
}

/**
 * Checks if a URL is a Cloudinary URL
 * @param {string} url - URL to check
 * @returns {boolean} True if Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return typeof url === "string" && url.includes("cloudinary.com")
}

/**
 * Gets a Cloudinary URL with transformation parameters
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} Transformed Cloudinary URL
 */
export const getCloudinaryUrl = (url, options = {}) => {
  if (!isCloudinaryUrl(url)) return url

  // Default options for different contexts
  const defaults = {
    thumbnail: { width: 80, height: 80, crop: "fill", quality: "auto", format: "auto" },
    card: { width: 300, height: 300, crop: "fill", quality: "auto", format: "auto" },
    detail: { width: 600, height: 600, crop: "fill", quality: "auto", format: "auto" },
    banner: { width: 1200, height: 500, crop: "fill", quality: "auto", format: "auto" },
  }

  // Merge defaults with provided options based on context
  const context = options.context || "card"
  const mergedOptions = { ...defaults[context], ...options }
  const { width, height, crop, quality, format } = mergedOptions

  // Find the upload part of the URL
  const uploadIndex = url.indexOf("/upload/")
  if (uploadIndex === -1) return url

  // Build transformation string
  let transformation = ""
  if (width) transformation += `w_${width},`
  if (height) transformation += `h_${height},`
  if (crop) transformation += `c_${crop},`
  if (quality) transformation += `q_${quality},`
  if (format) transformation += `f_${format},`

  // Remove trailing comma
  if (transformation.endsWith(",")) {
    transformation = transformation.slice(0, -1)
  }

  // Insert transformation
  if (transformation) {
    return url.slice(0, uploadIndex + 8) + transformation + "/" + url.slice(uploadIndex + 8)
  }

  return url
}

/**
 * Preloads an image or array of images
 * @param {string|string[]} images - Image URL or array of image URLs to preload
 */
export const preloadImages = (images) => {
  if (!images) return

  const imageArray = Array.isArray(images) ? images : [images]

  imageArray.forEach((imgUrl) => {
    if (imgUrl && typeof imgUrl === "string") {
      const img = new Image()
      img.src = imgUrl
    }
  })
}
