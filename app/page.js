import Image from "next/image";
import HeroWrapper from "@/components/HeroWrapper";
import Contact from "@/components/Contact";
import About from "@/components/About";

export default function Home() {
  return (
    <>
            <HeroWrapper/>
            {/* <HeroGeometric/> */}
            <About/>
            <Contact/>

    </>
  );
}
