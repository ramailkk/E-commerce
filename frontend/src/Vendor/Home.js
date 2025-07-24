import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoMdAdd } from "react-icons/io";
import { IoAnalytics } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { API_BASE_URL } from "../config";
import axiosInstance from "../utils/axios";
const options = [
  {
    label: "Add Product",
    description: "Add a new product to the database",
    icon: <IoMdAdd className="fs-1 text-primary" />,
  },
  {
    label: "View Inventory",
    description: "Manage your products in the database",
    icon: <FaCartShopping className="fs-1 text-success" />,
  },
  {
    label: "Dashboard",
    description: "View your analytics so far",
    icon: <IoAnalytics className="fs-1 text-warning" />,
  },
  {
    label: "Settings",
    description: "Configure your preferences",
    icon: <IoSettingsSharp className="fs-1 text-secondary" />,
  },
];

function Home() {
  const [vendor, setVendor] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axiosInstance.get("profile/my-profile");
        console.log("Vendor Data:", res.data.user); // Log to debug
        setVendor(res.data.user);
        
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
      }
    };

    fetchVendor();
  }, []);

  return (
    <div
      className="bg-light d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="text-center mb-4">
        <h1 className="display-5 mb-5">
          Welcome <span className="text-primary">{vendor.fullName}</span>
        </h1>

        <div
          className="d-grid gap-4"
          style={{
            gridTemplateColumns: "repeat(2, 1fr)",
            width: "600px",
            margin: "0 auto",
          }}
        >
          {options.map((item, index) => (
            <div
              key={index}
              className="card shadow-sm p-4"
              style={{ cursor: "pointer", transition: "0.3s" }}
              onClick={() => alert(`Clicked: ${item.label}`)}
            >
              <div className="d-flex flex-column justify-content-center align-items-center text-center">
                {item.icon}
                <h5 className="mt-3">{item.label}</h5>
                <p className="text-muted small">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
