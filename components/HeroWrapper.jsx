"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Pacifico } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  Users,
  Star,
  Video,
  Edit3,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Loader2,
  Shield,
  Clock,
  Award,
} from "lucide-react"
import { useState, useEffect, memo, useCallback } from "react"
import { cn } from "@/lib/utils"
import Loader from "./Loader"
import ErrorBoundary from "./error-boundary"
import ElegantShape from "./elegant-shape"
import StatCard from "./stat-card"
import AboutSection from "./hero/AboutSection"
import CustomerStories from "./hero/CustomerStories"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/(nav2)/context/AuthContext"
import { useUserContext } from "@/app/(nav2)/context/UserContext"

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
  const [actionLoading, setActionLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("info")

  const { userData } = useUserContext()
  const { user, activeRole, handleSwitch } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const loadComponent = async () => {
      try {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            if (process.env.NODE_ENV === "development" && Math.random() > 0.95) {
              reject(new Error("Failed to load marketplace data"))
            } else {
              resolve()
            }
          }, 800)
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

  const showAlertMessage = useCallback((message, type = "info") => {
    setAlertMessage(message)
    setAlertType(type)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }, [])

  const handleRetry = useCallback(() => {
    setIsLoading(true)
    setHasError(false)
    setError(null)
    window.location.reload()
  }, [])

  const handleStartSelling = useCallback(async () => {
    if (actionLoading) return

    setActionLoading(true)

    try {
      if (!user) {
        showAlertMessage("Please log in to start selling services", "warning")
        setTimeout(() => router.push("/login"), 2000)
        return
      }

      if (!userData?.isSeller) {
        showAlertMessage("You need to register as a seller first", "info")
        setTimeout(() => router.push("/become_seller"), 2000)
        return
      }

      if (activeRole !== "seller") {
        showAlertMessage("Switching to seller mode...", "info")
        await handleSwitch()
        setTimeout(() => router.push("/seller/manage/gigs/creategigs"), 1000)
        return
      }

      showAlertMessage("Redirecting to create your first gig...", "success")
      setTimeout(() => router.push("/seller/manage/gigs/creategigs"), 1000)
    } catch (error) {
      showAlertMessage("Something went wrong. Please try again.", "error")
    } finally {
      setActionLoading(false)
    }
  }, [user, userData, activeRole, handleSwitch, router, actionLoading, showAlertMessage])

  const handleFindEditors = useCallback(() => {
    router.push("/categories")
  }, [router])

  const handleGoHome = useCallback(() => {
    window.location.href = "/"
  }, [])

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.1 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  if (isLoading) {
    return <Loader />
  }

  if (hasError) {
    return <ErrorBoundary error={error} onRetry={handleRetry} onHome={handleGoHome} />
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Alert System */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <Alert
              className={cn(
                "shadow-lg border-l-4 bg-white",
                alertType === "success" && "border-l-emerald-500 text-emerald-800",
                alertType === "warning" && "border-l-amber-500 text-amber-800",
                alertType === "error" && "border-l-red-500 text-red-800",
                alertType === "info" && "border-l-blue-500 text-blue-800",
              )}
            >
              {alertType === "success" && <CheckCircle className="h-4 w-4" />}
              {alertType === "warning" && <AlertCircle className="h-4 w-4" />}
              {alertType === "error" && <AlertCircle className="h-4 w-4" />}
              {alertType === "info" && <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
        {/* Clean Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 via-transparent to-gray-50/30" />
        </div>

        {/* Subtle Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.2}
            width={600}
            height={140}
            rotate={12}
            gradient="from-emerald-100/[0.15]"
            className="left-[-10%] top-[20%] hidden md:block"
          />
          <ElegantShape
            delay={0.3}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-gray-100/[0.15]"
            className="right-[-5%] top-[70%] hidden md:block"
          />
          <ElegantShape
            delay={0.25}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-emerald-100/[0.12]"
            className="left-[10%] bottom-[10%]"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto text-center"
          >
            {/* Header Badge */}
            <motion.div variants={fadeUpVariants} custom={0}>
              <Badge className="bg-emerald-50 border-purple-200 text-pink-700 px-4 py-2 text-sm mb-8 shadow-sm">
                <Video className="w-4 h-4 mr-2" />
                The Future of Video Editing Marketplace
                <Shield className="w-4 h-4 ml-2" />
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={fadeUpVariants} custom={1}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
                <span className="block text-gray-900">Connect with Top</span>
                <span
                  className={cn(
                    "block bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-700 mt-2",
                    pacifico.className,
                  )}
                >
                  Video Editors
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div variants={fadeUpVariants} custom={2}>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                The premier marketplace where creative clients meet professional video editors. Get stunning videos
                delivered fast, or showcase your editing skills to thousands of potential clients.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              custom={3}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                size="lg"
                onClick={handleFindEditors}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-700   hover:bg-pink-600 text-white px-8 py-4 text-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105 font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Find Video Editors
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Button
                size="lg"
                onClick={handleStartSelling}
                disabled={actionLoading}
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-lg transition-all duration-300 hover:shadow-lg bg-white font-semibold"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Edit3 className="w-5 h-5 mr-2" />}
                Start Selling Services
              </Button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              variants={fadeUpVariants}
              custom={4}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
            >
              <StatCard icon={Users} value="10K+" label="Active Editors" delay={0.8} />
              <StatCard icon={Video} value="50K+" label="Videos Created" delay={0.9} />
              <StatCard icon={Star} value="4.9" label="Average Rating" delay={1.0} />
              <StatCard icon={Clock} value="24h" label="Avg. Delivery" delay={1.1} />
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={fadeUpVariants} custom={5}>
              <p className="text-gray-500 text-sm mb-4">Trusted by creators worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-6 opacity-70">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-600 font-medium text-sm">YouTube Creators</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-600 font-medium text-sm">Marketing Agencies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span className="text-gray-600 font-medium text-sm">Small Businesses</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Customer Stories */}
      <CustomerStories />
    </div>
  )
})

export default HeroWrapper
