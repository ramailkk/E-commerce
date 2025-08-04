import React from "react";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import {
  Star,
  Filter,
  ShoppingCart,
  User,
  PlusCircle,
  Home,
  Search,
  LayoutDashboard,
  User2,
  LogIn,
  UserPlus,
  Settings,
  X,
} from "lucide-react";
import "./Product.css";

import Sidebar from "./Sidebar";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199,
    rating: 4.8,
    image:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299,
    rating: 4.6,
    image:
      "https://images.pexels.com/photos/1783873/pexels-photo-1783873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 79,
    rating: 4.9,
    image:
      "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 4,
    name: "Coffee Mug",
    price: 24,
    rating: 4.3,
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 5,
    name: "Desk Lamp",
    price: 129,
    rating: 4.7,
    image:
      "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: 49,
    rating: 4.5,
    image:
      "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 7,
    name: "Phone Case",
    price: 19,
    rating: 4.2,
    image:
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 89,
    rating: 4.6,
    image:
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199,
    rating: 4.8,
    image:
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299,
    rating: 4.6,
    image:
      "https://images.pexels.com/photos/1783873/pexels-photo-1783873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 79,
    rating: 4.9,
    image:
      "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 4,
    name: "Coffee Mug",
    price: 24,
    rating: 4.3,
    image:
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 5,
    name: "Desk Lamp",
    price: 129,
    rating: 4.7,
    image:
      "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 6,
    name: "Wireless Mouse",
    price: 49,
    rating: 4.5,
    image:
      "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 7,
    name: "Phone Case",
    price: 19,
    rating: 4.2,
    image:
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 89,
    rating: 4.6,
    image:
      "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=300",
  },
];

const ProductsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("guest");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="products-page d-flex">
      {/* Sidebar */}
      {sidebarOpen && <Sidebar />}

      {/* Main Content */}
      <div className="flex-fill">
        {/* Modern Top Bar - Now using container instead of container-fluid */}
        <div className="top-bar">
          <div className="container">
            <div className="calibrated-bar">
              <div className="row align-items-center justify-content-between">
                {/* Left section: Filters + Add Product (always visible) */}
                <div className="col-auto d-flex flex-nowrap gap-2">
                  <button
                    className={`btn-modern ${sidebarOpen ? "btn-modern-active" : "btn-modern-secondary"}`}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    <Filter size={16} />
                    <span>{sidebarOpen ? "Hide Filters" : "Filters"}</span>
                  </button>
                  

                  {(role === "admin" || role === "vendor") && (
                    <button className="btn-modern btn-modern-primary">
                      <PlusCircle size={16} />
                      <span className="btn-text">Add Product</span>
                    </button>
                  )}
                </div>

                {/* Center Section - Search Bar (always visible) */}
                <div className="col search-container">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    placeholder="Search products..."
                  />
                </div>

                {/* Right section: role-specific buttons */}
                <div className="col-auto d-flex justify-content-lg-end gap-2">
                  {(role === "admin" || role === "vendor") && (
                    <button className="btn-modern btn-modern-secondary">
                      <LayoutDashboard size={16} />
                      <span className="btn-text">Portal</span>
                    </button>
                  )}

                  {role === "guest" && (
                    <button className="btn-modern btn-modern-secondary">
                      <User2 size={16} />
                      <span className="btn-text">Sign In</span>
                    </button>
                  )}

                  {/* Cart can be for all */}
                  <button className="btn-modern btn-modern-secondary">
                    <ShoppingCart size={16} />
                    <span className="btn-text">Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Products Grid - Using container to match header width */}
        <main className="container py-4">
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="col-lg-3 col-md-4 col-sm-4 col-4"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-5">
              <Search className="mb-3" size={48} color="#dee2e6" />
              <h3 className="h5 mb-2">No products found</h3>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
