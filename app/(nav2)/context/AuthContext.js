"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // decoded JWT
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [activeRole , setActiveRole] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      let token = sessionStorage.getItem("accessToken");

      if (!token) {
        // Try to read from cookie (non-HttpOnly accessToken)
        token = document.cookie
          .split("; ")
          .find(c => c.startsWith("accessToken="))
          ?.split("=")[1];

        if (token) {
          sessionStorage.setItem("accessToken", token);
        }
      }

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          if (decoded.exp > now) {
            setAccessToken(token);
            setUser(decoded);
            localStorage.setItem("activeRole" ,decoded.role)
            setActiveRole(decoded.role)
            console.log(decoded,"decoded")
            console.log(decoded.role ,"decoded role in authcontext")
            Cookies.set("currentRole", decoded.role, { expires: 7, path: "/" });
          } else {
            sessionStorage.removeItem("accessToken");
          }
        } catch (err) {
          console.error("Invalid accessToken:", err);
          sessionStorage.removeItem("accessToken");
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = () => {
    let token = document.cookie
      .split("; ")
      .find(c => c.startsWith("accessToken="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        sessionStorage.setItem("accessToken", token);
        setAccessToken(token);
        setUser(decoded);
        Cookies.set("currentRole", decoded.role, { expires: 7, path: "/" });
        console.log("Logged in:", decoded);
        console.log(decoded.role)
      } catch (err) {
        console.error("Failed to decode token during login:", err);
      }
    } else {
      console.warn("No accessToken in cookies during login");
    }
  };

  useEffect(()=>{
    const storedRole = localStorage.getItem("activeRole");
    setActiveRole( storedRole);
  },[])

const handleSwitch = async () => {
  try {
    const activeRole = localStorage.getItem("activeRole")
    const newRole = activeRole === 'buyer' ? 'seller' : 'buyer';
    setActiveRole(newRole)
    // optimistically update context
    console.log("role switchrd to ", newRole)

    // optionally localStorage
    localStorage.setItem('activeRole', newRole);

    // call backend to update user's active role
    await api.patch('/api/user/switch-role', { newRole });

    // optional: show toast
    // toast.success(`Switched to ${newRole} mode`);
  } catch (error) {
    console.error('Failed to switch role', error);
    // rollback if API fails
    // toast.error('Failed to switch role');
  }
};


 const getRole = () =>{
    return localStorage.getItem("activeRole")
 }


  const logout = async () => {
    sessionStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken,activeRole , setActiveRole, user,getRole, loading, login, logout, handleSwitch }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}


export const useAuth = () => useContext(AuthContext);
