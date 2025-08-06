import React, { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [email, setEmail] = useState(""); // get from previous page or add a context
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("auth/verify-otp", { email, otp });
      if (res.data.success) {
        // proceed to password reset
        navigate("/reset-password", { state: { email } });
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="px-4 py-4 rounded shadow"
        style={{ width: "100%", maxWidth: "400px", backgroundColor: "#fff" }}
      >
        <h3 className="text-center mb-4">Verify OTP</h3>
        <form onSubmit={handleSubmit}>
          {/* Optional: Email Input, or pass from previous step/context */}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(Number(e.target.value))}
              required
            />
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
