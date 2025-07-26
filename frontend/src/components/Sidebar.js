// Sidebar.js
import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";
import DualRangeSlider from "./DualRangeSlider";
import StarRatingSelector from "./StarRatingFilter";
import CustomCheckbox from "./CustomCheckbox";
import './Sidebar.css';

function Sidebar() {
  const CategoryOptions = [
    "Shirts", "Pants", "Jeans", "Jackets", "Sweaters", "Shoes",
    "Hoodies", "Accessories", "T-Shirts", "Shorts", "Suits", "Blazers"
  ];
  
  const ShippedFrom = [
    "Lahore", "Islamabad", "Karachi", "Faisalabad", "Multan", "Peshawar"
  ];
  
  const BrandOptions = [
    "Nike", "Adidas", "Levi's", "Outfitters", "Zara", "H&M",
    "Puma", "Under Armour", "GAP", "Uniqlo"
  ];

  // States
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [selectedLocations, setSelectedLocations] = useState(new Set());
  const [inStockOnly, setInStockOnly] = useState(false);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(() => {
    return window.innerWidth <= 576;
  });

  const visibleCount = 5;

  const handleCheckboxChange = (item, selectedSet, setSelectedSet) => {
    const newSet = new Set(selectedSet);
    if (newSet.has(item)) {
      newSet.delete(item);
    } else {
      newSet.add(item);
    }
    setSelectedSet(newSet);
  };

  const renderFilterList = (items, showAll, setShowAll, selectedSet, setSelectedSet) => (
    <div className="filter-list">
      {items.slice(0, showAll ? items.length : visibleCount).map((item, i) => (
        <CustomCheckbox
          key={i}
          label={item}
          checked={selectedSet.has(item)}
          onChange={() => handleCheckboxChange(item, selectedSet, setSelectedSet)}
        />
      ))}
      {items.length > visibleCount && (
        <button
          className="view-more-btn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp size={14} />
              View Less
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              View More ({items.length - visibleCount} more)
            </>
          )}
        </button>
      )}
    </div>
  );

  const clearAllFilters = () => {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setSelectedLocations(new Set());
    setInStockOnly(false);
  };

   useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 576px)");
    const handleResize = (e) => {
      setIsMobileFilterOpen(e.matches); // true when <= 576px
    };
    handleResize(mediaQuery); // Initialize on load
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  
  return (
    <>
      <div className={`sidebar-container ${isMobileFilterOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          {/* Close button for mobile */}
          <button
            className="close-sidebar-btn"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="sidebar-header">
            <h2 className="sidebar-title">Filters</h2>
            <div className="sidebar-title-underline"></div>
          </div>

          {/* Category */}
          <div className="filter-section">
            <h3 className="filter-title">Category</h3>
            {renderFilterList(
              CategoryOptions,
              showAllCategories,
              setShowAllCategories,
              selectedCategories,
              setSelectedCategories
            )}
          </div>

          {/* Price */}
          <div className="filter-section">
            <h3 className="filter-title">Price Range</h3>
            <DualRangeSlider />
          </div>

          {/* Shipped From */}
          <div className="filter-section">
            <h3 className="filter-title">Shipped From</h3>
            {renderFilterList(
              ShippedFrom,
              showAllLocations,
              setShowAllLocations,
              selectedLocations,
              setSelectedLocations
            )}
          </div>

          {/* Brands */}
          <div className="filter-section">
            <h3 className="filter-title">Brands</h3>
            {renderFilterList(
              BrandOptions,
              showAllBrands,
              setShowAllBrands,
              selectedBrands,
              setSelectedBrands
            )}
          </div>

          {/* Ratings */}
          <div className="filter-section">
            <h3 className="filter-title">Minimum Rating</h3>
            <StarRatingSelector onChange={(val) => console.log("Rating >=", val)} />
          </div>

          {/* Availability */}
          <div className="filter-section">
            <h3 className="filter-title">Availability</h3>
            <CustomCheckbox
              label="In Stock Only"
              checked={inStockOnly}
              onChange={() => setInStockOnly(!inStockOnly)}
            />
          </div>

          {/* Clear All */}
          <div className="clear-filters-section">
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;