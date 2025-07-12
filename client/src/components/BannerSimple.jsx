"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ImageWithFallback from "./ImageWithFallback"

const BannerSimple = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const banners = [
    {
      id: 1,
      title: "Summer Collection 2023",
      description: "Discover the latest trends in summer fashion",
      buttonText: "Shop Now",
      image: "/placeholder.svg?height=500&width=1200",
      link: "/collection",
    },
    {
      id: 2,
      title: "New Arrivals",
      description: "Be the first to wear our newest styles",
      buttonText: "Explore",
      image: "/placeholder.svg?height=500&width=1200",
      link: "/collection",
    },
    {
      id: 3,
      title: "Special Offers",
      description: "Limited time discounts on selected items",
      buttonText: "View Offers",
      image: "/placeholder.svg?height=500&width=1200",
      link: "/collection",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className="position-relative" style={{ height: "500px" }}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className="position-absolute w-100 h-100"
          style={{
            opacity: currentSlide === index ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
            zIndex: currentSlide === index ? 1 : 0,
          }}
        >
          <div className="position-relative w-100 h-100">
            <div className="position-absolute w-100 h-100 bg-dark" style={{ opacity: 0.6, zIndex: 1 }}></div>
            <ImageWithFallback
              src={banner.image || "/placeholder.svg"}
              alt={banner.title}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
            />
            <div
              className="position-absolute top-50 start-50 translate-middle text-center text-white w-100 px-3"
              style={{ zIndex: 2 }}
            >
              <h1 className="display-4 fw-bold">{banner.title}</h1>
              <p className="lead mb-4">{banner.description}</p>
              <div className="d-flex justify-content-center gap-2">
                <Link to={banner.link} className="btn btn-light btn-lg">
                  {banner.buttonText}
                </Link>
                <Link to="/collection" className="btn btn-outline-light btn-lg">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3" style={{ zIndex: 3 }}>
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            className="rounded-circle mx-1"
            style={{
              width: "12px",
              height: "12px",
              border: "none",
              backgroundColor: currentSlide === index ? "#fff" : "rgba(255,255,255,0.5)",
            }}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <button
        className="position-absolute top-50 start-0 translate-middle-y bg-transparent border-0 text-white px-3 py-5"
        style={{ zIndex: 3 }}
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-white px-3 py-5"
        style={{ zIndex: 3 }}
        onClick={() => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1))}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default BannerSimple
