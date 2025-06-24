"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // decoded JWT
  const [loading, setLoading] = useState(true);
  const router = useRouter();




  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");
    if (storedToken) {
      const decoded = jwtDecode(storedToken);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp > now) {
        setAccessToken(storedToken);
        setUser(decoded);
      } else {
        sessionStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  }, []);
  

  const login = (token) => {
    console.log("inside login funtion");
    console.log(token);
    sessionStorage.setItem("accessToken", token);
    const decoded = jwtDecode(token);
    setAccessToken(token);
    setUser(decoded);
    const role = decoded.role;

    console.log(role);
     Cookies.set("currentRole", role, {
    expires: 7, // 7 days
    path: "/"
  });

  };

  const handleSwitch =(  path1  , path2)=>{
    const currentRole = Cookies.get("currentRole");
    const newRole  = currentRole === "buyer"?"seller":"buyer";

    Cookies.set("currentRole", newRole , {
      expires:7,
      path:"/"
    })

    router.push(newRole === "seller"?"paths":"pathb")
  }

  


  const logout = async () => {
    sessionStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
await fetch("/api/auth/logout", {
  method: "POST",
  credentials: "include", // in case cookies are used
  headers: {
    "Content-Type": "application/json",
  },
});
  };

  return (
    <AuthContext.Provider value={{ accessToken, handleSwitch,user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
