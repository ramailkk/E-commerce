// DualRangeSlider.js
import React, { useState, useCallback } from 'react';
import './DualRangeSlider.css';

const DualRangeSlider = ({ 
  min = 0, 
  max = 10000, 
  step = 100,
  initialMin = 500,
  initialMax = 5000,
  onChange 
}) => {
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const handleMinChange = useCallback((e) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
    onChange?.({ min: value, max: maxValue });
  }, [maxValue, step, onChange]);

  const handleMaxChange = useCallback((e) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
    onChange?.({ min: minValue, max: value });
  }, [minValue, step, onChange]);

  const handleMinInputChange = (e) => {
    const value = Math.min(Math.max(Number(e.target.value) || min, min), maxValue - step);
    setMinValue(value);
    onChange?.({ min: value, max: maxValue });
  };

  const handleMaxInputChange = (e) => {
    const value = Math.max(Math.min(Number(e.target.value) || max, max), minValue + step);
    setMaxValue(value);
    onChange?.({ min: minValue, max: value });
  };

  const getPercentage = (value) => ((value - min) / (max - min)) * 100;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value).replace('PKR', '₨');
  };

  return (
    <div className="dual-range-slider">
      {/* Price Display */}
      <div className="price-display">
        <span className="price-value min">{formatCurrency(minValue)}</span>
        <span className="price-value max">{formatCurrency(maxValue)}</span>
      </div>

      {/* Slider Container */}
      <div className="slider-container">
        {/* Track */}
        <div className="slider-track"></div>
        
        {/* Active Range */}
        <div 
          className="slider-range"
          style={{
            left: `${getPercentage(minValue)}%`,
            width: `${getPercentage(maxValue) - getPercentage(minValue)}%`
          }}
        ></div>

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="range-input"
          style={{ zIndex: minValue > max - 100 ? 5 : 1 }}
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="range-input"
          style={{ zIndex: maxValue < min + 100 ? 5 : 1 }}
        />
      </div>

      {/* Input Fields */}
      <div className="price-inputs">
        <div className="price-input-group">
          <label className="price-input-label">Min Price</label>
          <input
            type="number"
            className="price-input"
            value={minValue}
            onChange={(e) => handleMinInputChange(e)}
            min={min}
            max={maxValue - step}
            step={step}
          />
        </div>
        <div className="price-input-group">
          <label className="price-input-label">Max Price</label>
          <input
            type="number"
            className="price-input"
            value={maxValue}
            onChange={(e) => handleMaxInputChange(e)}
            min={minValue + step}
            max={max}
            step={step}
          />
        </div>
      </div>
    </div>
  );
};

export default DualRangeSlider;