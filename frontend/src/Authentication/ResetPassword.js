import React, { useState } from "react";
import axiosInstance from "../utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post("auth/reset-password", {
        email,
        password,
      });

      if (res.data?.success) {
        navigate("/login");
      } else {
        setError("Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="px-4 py-4 rounded shadow"
        style={{ width: "100%", maxWidth: "400px", backgroundColor: "#fff" }}
      >
        <h3 className="text-center mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}

          <div className="d-grid">
            <button type="submit" className="btn btn-success">
              Reset & Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
