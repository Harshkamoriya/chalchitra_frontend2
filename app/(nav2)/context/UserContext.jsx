"use client"

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user/me");
        console.log("Fetched user:", res.data.user); // ✅ useful for dev debugging
        setUserData(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser(); // ✅ this was missing in your original code
  }, []);

  const switchRole = async (newRole) => {
    try {
      await axios.post("/api/user/switch-role", { newRole });
      setUserData((prev) => ({ ...prev, role: newRole }));
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, switchRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
