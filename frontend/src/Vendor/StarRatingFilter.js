import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRatingSelector = ({ onChange }) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    const newRating = value === rating ? 0 : value; // toggle off
    setRating(newRating);
    if (onChange) onChange(newRating);
  };

  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={20}
          style={{ cursor: "pointer", transition: "color 0.2s" }}
          color={star <= (hovered || rating) ? "#ffc107" : "#e4e5e9"}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        />
      ))}
    </div>
  );
};

export default StarRatingSelector;
