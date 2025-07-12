/**
 * Utility functions for product management
 */

/**
 * Standardizes a product name to ensure consistency
 * @param {string} name - The original product name
 * @param {string} category - The product category
 * @returns {string} Standardized product name
 */
export const standardizeProductName = (name, category) => {
  if (!name) return ""

  let standardName = name.trim()

  // Add gender prefix if missing
  if (category === "Men's Clothing" && !standardName.includes("Men's")) {
    if (standardName.startsWith("Men ")) {
      standardName = standardName.replace("Men ", "Men's ")
    } else if (!standardName.startsWith("Men's")) {
      standardName = "Men's " + standardName
    }
  }

  if (category === "Women's Clothing" && !standardName.includes("Women's")) {
    if (standardName.startsWith("Women ")) {
      standardName = standardName.replace("Women ", "Women's ")
    } else if (!standardName.startsWith("Women's")) {
      standardName = "Women's " + standardName
    }
  }

  // Capitalize first letter of each word
  standardName = standardName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return standardName
}

/**
 * Generates a product SKU
 * @param {string} category - Product category
 * @param {string} name - Product name
 * @returns {string} Generated SKU
 */
export const generateSKU = (category, name) => {
  const categoryPrefix = category.split(" ")[0].substring(0, 3).toUpperCase()
  const nameHash = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 3)
  const timestamp = Date.now().toString().substring(9, 13)

  return `${categoryPrefix}-${nameHash}-${timestamp}`
}

/**
 * Validates a product name
 * @param {string} name - Product name to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidProductName = (name) => {
  if (!name || name.trim().length < 5) return false
  if (name.trim().toLowerCase() === "new cloth") return false
  if (name.trim().toLowerCase() === "product") return false

  return true
}
