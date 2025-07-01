"use client";
import { useEffect } from "react";
import { useAuth } from "@/app/(nav2)/context/AuthContext";
import api, { setupInterceptors } from "@/lib/axios";

export default function InterceptorProvider({ children }) {
  const { accessToken, login, logout } = useAuth();

  useEffect(() => {
    if (accessToken) {
      setupInterceptors(accessToken, login, logout);
    }
  }, [accessToken]);

  return <>{children}</>;
}
