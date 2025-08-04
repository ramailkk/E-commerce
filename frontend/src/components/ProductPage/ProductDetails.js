import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Star, Heart, Share2 } from "lucide-react";
import "./ProductDetails.css";

function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = {
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 2847,
    description:
      "Experience premium sound quality with our flagship wireless headphones. Featuring advanced noise cancellation technology, 30-hour battery life, and premium leather cushioning for ultimate comfort during extended listening sessions.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Premium leather cushioning",
      "Wireless & wired connectivity",
      "Voice assistant compatible",
    ],
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1649772/pexels-photo-1649772.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} items to cart`);
  };

  return (
    <div className="product-page">
      <header className="header">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="brand"></h1>
          <div className="icons d-flex align-items-center gap-3">
            <button className="icon-btn">
              <Heart size={24} />
            </button>
            <button className="icon-btn position-relative">
              <ShoppingCart size={24} />
              <span className="cart-count">2</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container py-5">
        <div className="row g-4">
          <div className="col-lg-6 d-flex flex-md-row flex-column-reverse align-items-start">
            {/* Thumbnails */}
            <div className="thumbnail-gallery d-flex flex-md-column flex-row gap-2 me-md-3 mt-3 mt-md-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumb-btn ${
                    selectedImage === idx ? "active" : ""
                  }`}
                  onMouseEnter={() => setSelectedImage(idx)}
                >
                  <img src={img} alt={`thumb-${idx}`} />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="product-info mb-4">
              <div className="rating d-flex align-items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? "text-warning"
                        : "text-muted"
                    }
                  />
                ))}
                <span className="text-muted small">
                  {product.rating} ({product.reviews.toLocaleString()} reviews)
                </span>
              </div>
              <h2>{product.name}</h2>
              <div className="price d-flex align-items-center gap-3">
                <span className="fs-3 fw-bold">${product.price}</span>
                <span className="text-decoration-line-through text-muted fs-5">
                  ${product.originalPrice}
                </span>
                <span className="badge bg-danger-subtle text-danger">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </div>
            </div>

            <p>{product.description}</p>

            <h5>Key Features</h5>
            <ul className="product-features list-unstyled mb-4">
              {product.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="product-single-feature d-flex align-items-center gap-2"
                >
                  <span className="dot"></span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="quantity-selector d-flex align-items-center gap-3 mb-3">
              <span>Quantity:</span>
              <div className="input-group" style={{ width: "120px" }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <div className="form-control text-center">{quantity}</div>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              className="btn btn-dark w-100 mb-3"
              onClick={handleAddToCart}
            >
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>

            <div className="info-grid mt-4">
              <div className="row row-cols-1 g-3 small">
                <div className="col d-flex justify-content-between">
                  <span>Free Shipping:</span>
                  <span>Orders over $99</span>
                </div>
                <div className="col d-flex justify-content-between">
                  <span>Warranty:</span>
                  <span>2 years</span>
                </div>
                <div className="col d-flex justify-content-between">
                  <span>Return Policy:</span>
                  <span>30 days</span>
                </div>
                <div className="col d-flex justify-content-between">
                  <span>Support:</span>
                  <span>24/7 Live Chat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
    