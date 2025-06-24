"use client"
import { useUserContext } from "@/app/(nav2)/context/UserContext";
import React from "react";
import { useContext } from "react";


const RoleSwitcher = () => {
  const { user, switchRole, loading } = useUserContext();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not logged in</p>;

  return (
    <div>
      <p>Hello {user.name}, your current role is: <strong>{user.role}</strong></p>
      <button onClick={() => switchRole(user.role === "buyer" ? "seller" : "buyer")}>
        Switch to {user.role === "buyer" ? "Seller" : "Buyer"}
      </button>
    </div>
  );
};

export default RoleSwitcher;
