"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import { useState, useEffect, memo } from "react"
import { cn } from "@/lib/utils"
import Loader from "./loader"
import ElegantShape from "./elegant-shape"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
  display: "swap", // Optimize font loading
})

const HeroGeometric = memo(function HeroGeometric({
  badge = "Kokonut UI",
  title1 = "Elevate Your",
  title2 = "Digital Vision",
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    // Simulate component loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer);
  }, [])

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3 + i * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />
      {/* Floating shapes - optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={window?.innerWidth < 768 ? 300 : 600}
          height={window?.innerWidth < 768 ? 80 : 140}
          rotate={12}
          gradient="from-indigo-500/[0.12]"
          className="left-[-20%] sm:left-[-10%] md:left-[-5%] top-[10%] sm:top-[15%] md:top-[20%]" />

        <ElegantShape
          delay={0.4}
          width={window?.innerWidth < 768 ? 250 : 500}
          height={window?.innerWidth < 768 ? 70 : 120}
          rotate={-15}
          gradient="from-rose-500/[0.12]"
          className="right-[-15%] sm:right-[-5%] md:right-[0%] top-[65%] sm:top-[70%] md:top-[75%]" />

        <ElegantShape
          delay={0.3}
          width={window?.innerWidth < 768 ? 200 : 300}
          height={window?.innerWidth < 768 ? 50 : 80}
          rotate={-8}
          gradient="from-violet-500/[0.12]"
          className="left-[0%] sm:left-[5%] md:left-[10%] bottom-[0%] sm:bottom-[5%] md:bottom-[10%]" />

        <ElegantShape
          delay={0.5}
          width={window?.innerWidth < 768 ? 120 : 200}
          height={window?.innerWidth < 768 ? 35 : 60}
          rotate={20}
          gradient="from-amber-500/[0.12]"
          className="right-[10%] sm:right-[15%] md:right-[20%] top-[5%] sm:top-[10%] md:top-[15%]" />

        <ElegantShape
          delay={0.6}
          width={window?.innerWidth < 768 ? 100 : 150}
          height={window?.innerWidth < 768 ? 25 : 40}
          rotate={-25}
          gradient="from-cyan-500/[0.12]"
          className="left-[15%] sm:left-[20%] md:left-[25%] top-[0%] sm:top-[5%] md:top-[10%]" />
      </div>
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6 sm:mb-8 md:mb-12">
            <div className="relative w-4 h-4 sm:w-5 sm:h-5">
              {!imageLoaded && <div className="absolute inset-0 bg-white/10 rounded animate-pulse" />}
              <Image
                src="https://kokonutui.com/logo.svg"
                alt="Kokonut UI"
                width={20}
                height={20}
                className={cn(
                  "transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                priority />
            </div>
            <span className="text-xs sm:text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>

          {/* Main title */}
          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight">
              <span
                className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {title1}
              </span>
              <span
                className={cn(
                  "block bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300 mt-2",
                  pacifico.className
                )}>
                {title2}
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/40 mb-6 sm:mb-8 leading-relaxed font-light tracking-wide max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-2 sm:px-4">
              Crafting exceptional digital experiences through innovative design and cutting-edge technology.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-rose-500 text-white rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25">
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-white/20 text-white rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:bg-white/5">
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </div>
      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/60 pointer-events-none" />
    </div>
  );
})

export default HeroGeometric
