import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.get("/users/profile");
          setUser(res.data);
        } catch (err) {
          console.error("Session expired or invalid token", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  // Register user
  const register = async (fullName, email, password, phone, college) => {
    try {
      const res = await api.post("/auth/register", {
        fullName,
        email,
        password,
        phone,
        college,
      });
      const data = res.data;
      localStorage.setItem("token", data.token);
      
      // Fetch full profile info
      const profileRes = await api.get("/users/profile");
      setUser(profileRes.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;
      localStorage.setItem("token", data.token);
      
      // Fetch full profile info
      const profileRes = await api.get("/users/profile");
      setUser(profileRes.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put("/users/profile", profileData);
      setUser(res.data);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
