import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../utils/axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("auth/login", { email, password });
      login(res.data);
      alert("Logged In congrats")
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="login-container px-4 py-4 rounded shadow"
        style={{ width: "100%", maxWidth: "400px", backgroundColor: "#fff" }}
      >
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email address"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <div className="text-center mt-3">
            <small>
              Forgot Password?{" "}
              <a href="#" onClick={() => navigate("/forgot-password")}>
                Click here
              </a>
            </small>
          </div>
          <div className="text-center mt-3">
            <small>
              Don't have an account? <a href="#" onClick={() => navigate("/signup")}>
                Register
              </a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
