"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [gigs, setGigs] = useState([]);
  const [users, setUsers] = useState([]);

  // ✅ Fetch all gigs
  const getAllGigs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/gigs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch gigs");

      setGigs(data.gigs || []);
      console.log("✅ Gigs fetched successfully", data);
    } catch (error) {
      console.error("❌ Error fetching gigs", error.message);
      toast.error(error.message || "Something went wrong while fetching gigs");
    }
  };

  // ✅ Post a new gig
  const postGig = async (gigData) => {
    try {
      const response = await fetch("http://localhost:3000/api/gigs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(gigData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create gig");

      toast.success("Gig posted successfully!");
      getAllGigs(); // Refresh gigs list
      return data.gig;
    } catch (error) {
      console.error("❌ Error posting gig", error.message);
      toast.error(error.message || "Something went wrong while posting gig");
    }
  };

  // ✅ Fetch all registered users
  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch users");

      setUsers(data.users || []);
      console.log("✅ Users fetched successfully", data);
    } catch (error) {
      console.error("❌ Error fetching users", error.message);
      toast.error(error.message || "Something went wrong while fetching users");
    }
  };

  useEffect(() => {
    console.log(gigs, "gigs in context");
    getAllGigs();
  }, []);

  return (
    <AppContext.Provider
      value={{
        session,
        status,
        gigs,
        setGigs,
        getAllGigs,
        postGig,
        users,
        setUsers,
        fetchAllUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
