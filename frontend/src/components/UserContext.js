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
                setUser(null);
                return null;
            }

            const response = await axios.get("http://localhost:3000/api/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user:", error);
            // If we get a 401 or 403, clear the token
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                setUser(null);
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUserAfterOnboarding = async (onboardingData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            // First, submit the onboarding data
            await axios.post(
                "http://localhost:3000/api/onboarding",
                { answers: onboardingData },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Then fetch the updated user profile
            const userResponse = await axios.get(
                "http://localhost:3000/api/user/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(userResponse.data);
            return true;
        } catch (error) {
            console.error("Error updating user after onboarding:", error);
            // If we get a 401 or 403, clear the token
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                setUser(null);
            }
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