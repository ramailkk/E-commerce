import React from "react";
import { useAuth } from "./AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container text-center mt-5">
      <h2>Welcome to the Dashboard</h2>
      <p>You are logged in as: <strong>{user?.email}</strong></p>
      <button className="btn btn-danger mt-3" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
