import { Suspense } from "react";
import Home from "./(nav2)/Home";
import Navbar from "@/components/Navbar";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar/>
      <Home />
    </Suspense>
  );
}
