// StarRatingSelector.js
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRatingFilter.css';

const StarRatingSelector = ({ onChange, initialRating = 0 }) => {
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    onChange?.(rating);
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className="star-rating-container" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || selectedRating);
        const isHovered = star <= hoverRating;
        
        return (
          <button
            key={star}
            className="star-rating-button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star 
              className={`star-icon ${
                isActive 
                  ? 'filled' 
                  : isHovered 
                    ? 'hover' 
                    : 'empty'
              }`}
            />
          </button>
        );
      })}
      <span className="rating-text">& up</span>
      {selectedRating > 0 && (
        <span className="selected-rating">({selectedRating}+)</span>
      )}
    </div>
  );
};

export default StarRatingSelector;