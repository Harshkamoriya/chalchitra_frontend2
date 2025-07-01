"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const OAuthRedirectPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  console.log(from  ,"from url")
  const { login } = useAuth();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        console.log(from , " from url ");

        if (res.ok && data.accessToken) {
          login(data.accessToken); // trigger global state update
          toast.success("Login successful"); // 🔔 trigger toast here
          router.push(from);
        } else {
          toast.error("Login failed");
          router.push("/");
        }
      } catch (error) {
        console.error("OAuth redirect error:", error);
        toast.error("Login failed");
        router.push("/");
      }
    };

    fetchAccessToken();
  }, [login, router, from]);

  return <div className="text-center p-10 text-xl">Logging you in...</div>;
};

export default OAuthRedirectPage;
