import React from 'react';
import { Star } from 'lucide-react';
import './ProductCard.css';
import { 
  ShoppingCart, 
} from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category || 'Electronics'}</p>
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`star ${i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}`}
              />
            ))}
          </div>
          <span className="rating-text">({product.rating})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          <button className="btn-add-cart">
            <ShoppingCart className="cart-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
