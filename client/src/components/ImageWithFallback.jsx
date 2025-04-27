"use client"

import { useState, useEffect, useRef } from "react"

const ImageWithFallback = ({ src, alt, fallbackSrc = "/placeholder.svg", className = "", style = {}, ...props }) => {
  const [imgSrc, setImgSrc] = useState(fallbackSrc)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)

  // Use a cache to avoid unnecessary reloads
  const imageCache = useRef(new Map())

  useEffect(() => {
    // Reset state when src changes
    setLoading(true)
    setError(false)

    // If no source provided, use fallback immediately
    if (!src) {
      setImgSrc(fallbackSrc)
      setLoading(false)
      return
    }

    // Check if image is already in cache
    if (imageCache.current.has(src)) {
      setImgSrc(src)
      setLoading(false)
      return
    }

    // Create a new image object to preload
    const img = new Image()

    // Set up load and error handlers
    img.onload = () => {
      imageCache.current.set(src, true)
      setImgSrc(src)
      setLoading(false)
    }

    img.onerror = () => {
      setImgSrc(fallbackSrc)
      setError(true)
      setLoading(false)
    }

    // Start loading the image
    img.src = src

    // Clean up
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, fallbackSrc])

  return (
    <div className={`position-relative ${className}`} style={{ ...style }}>
      {loading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <img
        ref={imgRef}
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: loading ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
        {...props}
      />
    </div>
  )
}

export default ImageWithFallback
