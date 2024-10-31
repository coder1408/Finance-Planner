import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserAfterOnboarding = async (onboardingData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://localhost:5000/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUser(response.data);
      return true;
    } catch (error) {
      console.error("Error updating user after onboarding:", error);
      return false;
    }
  };

  return (
      <UserContext.Provider value={{
        user,
        setUser,
        fetchUser,
        loading,
        updateUserAfterOnboarding
      }}>
        {children}
      </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};