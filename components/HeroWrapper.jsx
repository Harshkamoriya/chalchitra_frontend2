"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Star, Zap, Video, Edit3 } from "lucide-react"
import { useState, useEffect, memo } from "react"
import { cn } from "@/lib/utils"
import Loader from "./Loader"
import ErrorBoundary from "./error-boundary"
import ElegantShape from "./elegant-shape"
import StatCard from "./stat-card"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
  display: "swap",
})

const HeroWrapper = memo(function HeroWrapper() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Simulate loading time and potential errors
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            // Simulate random error for demo (remove in production)
            if (Math.random() > 0.9) {
              reject(new Error("Failed to load marketplace data"))
            } else {
              resolve()
            }
          }, 1200)
        })
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setHasError(true)
        setIsLoading(false)
      }
    }

    loadComponent()
  }, [])

  const handleRetry = () => {
    setIsLoading(true)
    setHasError(false)
    setError(null)
    // Reload the component
    window.location.reload()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  if (isLoading) {
    return <Loader />;
  }

  if (hasError) {
    return <ErrorBoundary error={error} onRetry={handleRetry} onHome={handleGoHome} />;
  }

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background gradients */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-100/30 via-transparent to-gray-200/20" />
      {/* Floating shapes - Responsive sizes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={window?.innerWidth < 768 ? 300 : 600}
          height={window?.innerWidth < 768 ? 70 : 140}
          rotate={12}
          gradient="from-gray-300/[0.12]"
          className="left-[-20%] sm:left-[-10%] md:left-[-5%] top-[10%] sm:top-[15%] md:top-[20%]" />
        <ElegantShape
          delay={0.3}
          width={window?.innerWidth < 768 ? 250 : 500}
          height={window?.innerWidth < 768 ? 60 : 120}
          rotate={-15}
          gradient="from-gray-400/[0.12]"
          className="right-[-15%] sm:right-[-5%] md:right-[0%] top-[65%] sm:top-[70%] md:top-[75%]" />
        <ElegantShape
          delay={0.25}
          width={window?.innerWidth < 768 ? 180 : 300}
          height={window?.innerWidth < 768 ? 45 : 80}
          rotate={-8}
          gradient="from-gray-300/[0.12]"
          className="left-[0%] sm:left-[5%] md:left-[10%] bottom-[0%] sm:bottom-[5%] md:bottom-[10%]" />
        <ElegantShape
          delay={0.35}
          width={window?.innerWidth < 768 ? 120 : 200}
          height={window?.innerWidth < 768 ? 30 : 60}
          rotate={20}
          gradient="from-purple-300/[0.12]"
          className="right-[10%] sm:right-[15%] md:right-[20%] top-[5%] sm:top-[10%] md:top-[15%]" />
        <ElegantShape
          delay={0.4}
          width={window?.innerWidth < 768 ? 100 : 150}
          height={window?.innerWidth < 768 ? 25 : 40}
          rotate={-25}
          gradient="from-gray-300/[0.12]"
          className="left-[15%] sm:left-[20%] md:left-[25%] top-[0%] sm:top-[5%] md:top-[10%]" />
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-6 sm:mb-8">
            <Badge
              variant="outline"
              className="bg-gray-100 border-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
              <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              The Future of Video Editing Marketplace
            </Badge>
          </motion.div>

          {/* Main Content */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
                <span
                  className="block bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-700">
                  Connect with Top
                </span>
                <span
                  className={cn(
                    "block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mt-1 sm:mt-2",
                    pacifico.className
                  )}>
                  Video Editors
                </span>
              </h1>
            </motion.div>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-4">
                The premier marketplace where creative clients meet professional video editors. Get stunning videos
                delivered fast, or showcase your editing skills to thousands of potential clients.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-base lg:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Find Video Editors
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 px-6 sm:px-8 py-3 text-sm sm:text-base lg:text-lg transition-all duration-300">
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Selling Services
              </Button>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto mb-8 sm:mb-12">
            <StatCard icon={Users} value="10K+" label="Active Editors" delay={0.8} />
            <StatCard icon={Video} value="50K+" label="Videos Created" delay={0.9} />
            <StatCard icon={Star} value="4.9" label="Average Rating" delay={1.0} />
            <StatCard icon={Zap} value="24h" label="Avg. Delivery" delay={1.1} />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            custom={5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-center">
            <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">Trusted by creators worldwide</p>
            <div
              className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-8 opacity-60">
              <div className="text-gray-600 font-semibold text-xs sm:text-sm">YouTube Creators</div>
              <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="text-gray-600 font-semibold text-xs sm:text-sm">Marketing Agencies</div>
              <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="text-gray-600 font-semibold text-xs sm:text-sm">Small Businesses</div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50/60 pointer-events-none" />
    </div>
  );
})

export default HeroWrapper
