'use client';
import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Contact from "@/components/Contact";
import About from "@/components/About";
import RoleSwitcher from "@/components/switchRole";
import HeroWrapper from "@/components/HeroWrapper";

export default function Home() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const provider = searchParams.get("signin");
    if (provider) {
      toast.success(`Signed in with ${provider} successfully`);
      router.replace(pathname); // remove ?signin param
    }
  }, [searchParams, pathname, router]);

  return (
    <>
      <HeroWrapper />
      <RoleSwitcher/>
      <About />
      
      <Contact />
    </>
  );
}
