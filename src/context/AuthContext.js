import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    const storedUserId = localStorage.getItem("userId");
    console.log("Restoring auth state from localStorage:", { storedToken, storedRole, storedName, storedUserId });
    if (storedToken) {
      setToken(storedToken);
      setUserRole(storedRole);
      setUserName(storedName);
      setUserId(storedUserId);
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false after restoring state
  }, []);

  const login = (token, role, name, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("userId", userId); // Store userId
    setToken(token); // Set token in state
    setUserRole(role);
    setUserName(name);
    setUserId(userId); // Set userId in state
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    setUserName(null);
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userName, token, userId, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
