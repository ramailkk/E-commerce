import React, { useState } from "react";
import "./DualRangeSlider.css";

const DualRangeSlider = () => {
  const [min, setMin] = useState(1000);
  const [max, setMax] = useState(10000);

  const MIN_LIMIT = 0;
  const MAX_LIMIT = 20000;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), max - 100);
    setMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), min + 100);
    setMax(value);
  };

  const getPercentage = (value) => ((value - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100;

  return (
    <div className="slider-container">
      <div className="d-flex justify-content-between mb-2 px-1">
        <span>₨ {min.toLocaleString()}</span>
        <span>₨ {max.toLocaleString()}</span>
      </div>

      <div className="slider">
        <input
          type="range"
          min={MIN_LIMIT}
          max={MAX_LIMIT}
          value={min}
          onChange={handleMinChange}
          className="thumb thumb-left"
        />
        <input
          type="range"
          min={MIN_LIMIT}
          max={MAX_LIMIT}
          value={max}
          onChange={handleMaxChange}
          className="thumb thumb-right"
        />

        <div className="slider-track" />
        <div
          className="slider-range"
          style={{
            left: `${getPercentage(min)}%`,
            width: `${getPercentage(max) - getPercentage(min)}%`,
          }}
        />
      </div>
    </div>
  );
};

export default DualRangeSlider;
