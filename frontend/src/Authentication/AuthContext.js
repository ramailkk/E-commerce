import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);

 
  const login = (userData) => {
    setUser(userData);
  };

  // Logout method
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
