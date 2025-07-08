"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // decoded JWT
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
            console.log(decoded,"decoded")
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
      } catch (err) {
        console.error("Failed to decode token during login:", err);
      }
    } else {
      console.warn("No accessToken in cookies during login");
    }
  };

  const handleSwitch = (buyerPath = "/", sellerPath = "/") => {
    const currentRole = Cookies.get("currentRole");
    const newRole = currentRole === "buyer" ? "seller" : "buyer";

    Cookies.set("currentRole", newRole, { expires: 7, path: "/" });
    console.log("Switched role to:", newRole);

    router.push(newRole === "seller" ? sellerPath : buyerPath);
  };

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
      value={{ accessToken, user, loading, login, logout, handleSwitch }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
