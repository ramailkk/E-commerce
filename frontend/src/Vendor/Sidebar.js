import React, { useState } from "react";
import DualRangeSlider from "./DualRangeSlider";
import { Form, Button } from "react-bootstrap";
import StarRatingSelector from "./StarRatingFilter";
import './Sidebar.css';
function Sidebar() {
  const CategoryOptions = [
    "Shirts",
    "Pants",
    "Jeans",
    "Jackets",
    "Sweaters",
    "Shoes",
    "Hoodies",
    "Accessories",
    "T-Shirts",
    "Shorts",
    "Suits",
    "Blazers",
  ];

  const ShippedFrom = [
    "Lahore",
    "Islamabad",
    "Karachi",
    "Faisalabad",
    "Multan",
    "Peshawar",
  ];

  const BrandOptions = [
    "Nike",
    "Adidas",
    "Levi's",
    "Outfitters",
    "Zara",
    "H&M",
    "Puma",
    "Under Armour",
    "GAP",
    "Uniqlo",
  ];

  const RatingOptions = [4, 3, 2, 1];

  // "View More" toggles
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const visibleCount = 5;

  const renderFilterList = (items, showAll, setShowAll) => (
    <>
      {items.slice(0, showAll ? items.length : visibleCount).map((item, i) => (
        <Form.Check key={i} type="checkbox" label={item} />
      ))}
      {items.length > visibleCount && (
        <Button
          variant="link"
          size="sm"
          className="ps-0"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "View Less" : "View More"}
        </Button>
      )}
    </>
  );

  return (
    <div
      className="p-3"
      style={{ width: "270px", height: "100vh", overflowY: "auto" }}
    >
      <h5 className="border-bottom pb-2 mb-3">Filters</h5>

      {/* Category */}
      <div className="mb-3">
        <h6>Category</h6>
        {renderFilterList(
          CategoryOptions,
          showAllCategories,
          setShowAllCategories
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <h6>Price (₨)</h6>
        <DualRangeSlider />
      </div>

      {/* Shipped From */}
      <div className="mb-3">
        <h6>Shipped From</h6>
        {renderFilterList(ShippedFrom, showAllLocations, setShowAllLocations)}
      </div>

      {/* Brands */}
      <div className="mb-3">
        <h6>Brands</h6>
        {renderFilterList(BrandOptions, showAllBrands, setShowAllBrands)}
      </div>

      {/* Ratings */}
      <div className="mb-3">
        <h6>Minimum Rating</h6>
        <StarRatingSelector
          onChange={(val) => console.log("Filter by rating >=", val)}
        />
      </div>

      {/* Availability */}
      <div className="mb-3">
        <h6>Availability</h6>
        <Form.Check type="checkbox" label="In Stock Only" />
      </div>
    </div>
  );
}

export default Sidebar;
