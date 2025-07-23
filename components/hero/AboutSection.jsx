"use client"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MessageCircle,
  CreditCard,
  CheckCircle,
  Upload,
  Users,
  Star,
  Zap,
  Shield,
  Clock,
  Award,
  ArrowRight,
  PlayCircle,
  Video,
  Edit3,
  Sparkles,
  Music,
  Heart,
  Briefcase,
  Youtube,
  Gamepad2,
  Mic,
  Smartphone,
  Eye,
  GraduationCap,
  ChevronRight,
} from "lucide-react"
import { useRef } from "react"
import Link from "next/link"

const AboutSection = () => {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const handleMouseMove = (event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set(event.clientX - rect.left - rect.width / 2)
      mouseY.set(event.clientY - rect.top - rect.height / 2)
    }
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const buyerSteps = [
    {
      icon: Search,
      title: "Browse & Discover",
      description: "Explore thousands of talented video editors with portfolios, reviews, and competitive pricing.",
      number: "01",
      src: "https://img.freepik.com/free-vector/people-searching-concept-illustration_114360-1574.jpg?w=740",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: MessageCircle,
      title: "Connect & Discuss",
      description: "Chat directly with editors, share your vision, and get custom quotes for your project.",
      number: "02",
      src: "https://img.freepik.com/free-vector/chat-concept-illustration_114360-1305.jpg?w=740",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay safely through our escrow system. Your money is protected until you're 100% satisfied.",
      number: "03",
      src: "https://img.freepik.com/free-vector/secure-payment-concept-illustration_114360-4455.jpg?w=740",
      color: "from-orange-500 to-red-600",
    },
    {
      icon: CheckCircle,
      title: "Receive & Review",
      description: "Get your professionally edited video delivered on time, with unlimited revisions included.",
      number: "04",
      src: "https://img.freepik.com/free-vector/completed-concept-illustration_114360-3449.jpg?w=740",
      color: "from-green-500 to-emerald-600",
    },
  ]

  const sellerSteps = [
    {
      icon: Upload,
      title: "Create Your Profile",
      description: "Showcase your skills with an impressive portfolio and detailed service descriptions.",
      number: "01",
      color: "bg-[#E8D5C4]",
      accent: "bg-[#E49393]",
      shape: "circle-top-right",
    },
    {
      icon: Users,
      title: "Get Discovered",
      description: "Our algorithm matches you with clients looking for your specific editing expertise.",
      number: "02",
      color: "bg-white",
      accent: "bg-[#D7C0AE]",
      shape: "semi-circle-left",
    },
    {
      icon: Star,
      title: "Deliver Excellence",
      description: "Work on exciting projects, build your reputation, and earn 5-star reviews from happy clients.",
      number: "03",
      color: "bg-[#E8D5C4]",
      accent: "bg-[#E49393]",
      shape: "circle-bottom-left",
    },
    {
      icon: Zap,
      title: "Grow Your Business",
      description: "Scale your freelance business with our tools, analytics, and growing client base.",
      number: "04",
      color: "bg-white",
      accent: "bg-[#D7C0AE]",
      shape: "semi-circle-right",
    },
  ]

  const categories = [
    {
      slug: "music-video-editing",
      title: "Music Video Editing",
      icon: Music,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-100 to-pink-100",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
    },
    {
      slug: "wedding-event-editing",
      title: "Wedding & Event Editing",
      icon: Heart,
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-100 to-pink-100",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop",
    },
    {
      slug: "commercial-ad-editing",
      title: "Commercial & Ad Editing",
      icon: Briefcase,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-100 to-cyan-100",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
    },
    {
      slug: "youtube-vlog-editing",
      title: "YouTube & Vlog Editing",
      icon: Youtube,
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-100 to-orange-100",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop",
    },
    {
      slug: "gaming-editing",
      title: "Gaming Content Editing",
      icon: Gamepad2,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-100 to-emerald-100",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop",
    },
    {
      slug: "podcast-editing",
      title: "Podcast Editing",
      icon: Mic,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-100 to-purple-100",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&h=200&fit=crop",
    },
    {
      slug: "short-form-reels-shorts",
      title: "Short Form & Reels",
      icon: Smartphone,
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-100 to-cyan-100",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=200&fit=crop",
    },
    {
      slug: "faceless-youtube-channel-editing",
      title: "Faceless YouTube Editing",
      icon: Eye,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-100 to-orange-100",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop",
    },
    {
      slug: "corporate-educational-editing",
      title: "Corporate & Educational",
      icon: GraduationCap,
      gradient: "from-slate-500 to-gray-600",
      bgGradient: "from-slate-100 to-gray-100",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
    },
  ]

  const getShapeStyles = (shape) => {
    switch (shape) {
      case "circle-top-right":
        return "after:content-[''] after:absolute after:top-0 after:right-0 after:w-24 after:h-24 after:rounded-full after:translate-x-1/2 after:-translate-y-1/2 after:opacity-50"
      case "semi-circle-left":
        return "after:content-[''] after:absolute after:top-1/2 after:left-0 after:w-16 after:h-32 after:rounded-r-full after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-50"
      case "circle-bottom-left":
        return "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-24 after:h-24 after:rounded-full after:-translate-x-1/2 after:translate-y-1/2 after:opacity-50"
      case "semi-circle-right":
        return "after:content-[''] after:absolute after:top-1/2 after:right-0 after:w-16 after:h-32 after:rounded-l-full after:translate-x-1/2 after:-translate-y-1/2 after:opacity-50"
      default:
        return ""
    }
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div variants={fadeUpVariants}>
            <Badge className="bg-gray-50 text-gray-700 border-gray-200 px-4 py-2 text-sm mb-6">How It Works</Badge>
          </motion.div>
          <motion.h2 variants={fadeUpVariants} className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Simple Steps to
            <span className="block text-gray-600 mt-2">Amazing Results</span>
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're looking to hire talented editors or showcase your skills, our platform makes it simple and
            secure for everyone.
          </motion.p>
        </motion.div>

        {/* Popular Categories Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <motion.div variants={fadeUpVariants} className="flex items-center justify-between mb-12">
            <h3 className="text-3xl font-bold text-gray-900">Popular Services</h3>
            <Link href="/categories">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 group">
                View All
                <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {categories.map((category, index) => (
                <motion.div key={category.slug} variants={fadeUpVariants} custom={index} className="flex-shrink-0">
                  <Link href={`/categories/${category.slug}`}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        y: -10,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="w-72 h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group"
                    >
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${category.gradient} p-6 text-white relative overflow-hidden`}>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="absolute top-4 right-4 bg-white/20 rounded-full p-2"
                        >
                          <category.icon className="w-6 h-6" />
                        </motion.div>
                        <h4 className="text-xl font-bold leading-tight mt-8">{category.title}</h4>

                        {/* Decorative elements */}
                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/10 rounded-full" />
                      </div>

                      {/* Content */}
                      <div className={`bg-gradient-to-br ${category.bgGradient} p-6 h-48 relative overflow-hidden`}>
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          transition={{ duration: 0.5 }}
                          className="relative z-10"
                        >
                          <div className="bg-white rounded-xl p-4 shadow-lg">
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.title}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Starting at</span>
                                <span className="font-bold text-gray-900">$25</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-gray-600 ml-1">4.9 (2.3k)</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Background decorative elements */}
                        <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/20 rounded-full translate-x-1/2 translate-y-1/2" />
                        <div className="absolute top-1/2 left-0 w-8 h-16 bg-white/20 rounded-r-full -translate-x-1/2" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Buyer Steps - Enhanced with GSAP-style hover animations */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">For Clients & Businesses</h3>
            <p className="text-lg text-gray-600">Get professional video editing services in just a few clicks</p>
          </motion.div>
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden lg:block"></div>
            {buyerSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                className={`relative flex flex-col lg:flex-row items-center justify-center mb-16 gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="lg:w-1/2 w-full max-w-lg">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      rotateY: index % 2 === 0 ? 5 : -5,
                      z: 50,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group cursor-pointer"
                  >
                    <div className="flex items-center mb-4">
                      <motion.div
                        whileHover={{
                          rotate: 360,
                          scale: 1.2,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                        className={`bg-gradient-to-r ${step.color} text-white rounded-full p-3 mr-4 shadow-lg`}
                      >
                        <step.icon className="w-6 h-6" />
                      </motion.div>
                      <motion.span
                        whileHover={{
                          scale: 1.1,
                          color: "#6366f1",
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl font-bold text-gray-100 group-hover:text-indigo-500"
                      >
                        {step.number}
                      </motion.span>
                    </div>
                    <motion.h4
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold mb-3 text-gray-900"
                    >
                      {step.title}
                    </motion.h4>
                    <motion.p
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-gray-600 leading-relaxed text-lg"
                    >
                      {step.description}
                    </motion.p>

                    {/* Hover overlay effect */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-5 rounded-2xl`}
                    />
                  </motion.div>
                </div>

                <div className="lg:w-1/2 w-full max-w-lg">
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      rotateX: 5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="bg-gray-50 rounded-2xl h-64 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden group"
                  >
                    <motion.img
                      whileHover={{
                        scale: 1.1,
                        rotate: 2,
                      }}
                      transition={{ duration: 0.5 }}
                      src={step.src || "/placeholder.svg"}
                      alt={step.title}
                      className="w-full h-full object-contain p-4"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </motion.div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full hidden lg:block shadow-lg border-4 border-white"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seller Steps - Enhanced with advanced hover animations */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">For Video Editors</h3>
            <p className="text-lg text-gray-600">Turn your editing skills into a thriving freelance business</p>
          </motion.div>

          {/* Modern Design Studio Style Cards with Enhanced Animations */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sellerSteps.map((step, index) => (
              <motion.div key={index} variants={fadeUpVariants} className="group">
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    rotateY: index % 2 === 0 ? 3 : -3,
                    z: 50,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className={`relative overflow-hidden rounded-2xl ${step.color} p-8 h-full shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 ${getShapeStyles(step.shape)} after:${step.accent} cursor-pointer`}
                >
                  {/* Animated Small Square */}
                  <motion.div
                    whileHover={{
                      rotate: 45,
                      scale: 1.2,
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-6 left-6 w-8 h-8 bg-white/50 rounded-sm"
                  />

                  {/* Animated Circle */}
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotate: 180,
                    }}
                    transition={{ duration: 0.8 }}
                    className={`absolute bottom-0 right-0 w-40 h-40 rounded-full ${step.accent} opacity-20 translate-x-1/4 translate-y-1/4`}
                  />

                  {/* Animated Semi-circle */}
                  <motion.div
                    whileHover={{
                      scaleX: 1.3,
                      y: -10,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute top-0 left-1/2 w-32 h-16 ${step.accent} opacity-20 rounded-b-full -translate-x-1/2 -translate-y-1/2`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <motion.div
                        whileHover={{
                          rotate: 360,
                          scale: 1.1,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                        className={`${step.accent} text-white rounded-full p-4 w-16 h-16 flex items-center justify-center shadow-lg`}
                      >
                        <step.icon className="w-8 h-8" />
                      </motion.div>
                      <motion.span
                        whileHover={{
                          scale: 1.2,
                          opacity: 0.5,
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-5xl font-bold text-gray-800/20"
                      >
                        {step.number}
                      </motion.span>
                    </div>

                    <motion.h4
                      whileHover={{ x: 10, color: "#374151" }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold mb-4 text-gray-800 tracking-tight"
                    >
                      {step.title}
                    </motion.h4>

                    <motion.p
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="text-gray-700 leading-relaxed text-lg mb-6 relative z-10"
                    >
                      {step.description}
                    </motion.p>

                    <div className="flex justify-end">
                      <motion.div whileHover={{ x: 10 }} transition={{ duration: 0.3 }}>
                        <Button
                          variant="ghost"
                          className="p-0 h-auto text-gray-800 hover:text-gray-900 hover:bg-transparent group"
                        >
                          Learn more
                          <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Chalchitra - Redesigned with Fiverr-style aesthetic */}
        <motion.div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-16 shadow-2xl max-w-7xl mx-auto overflow-hidden relative"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              style={{ x: useTransform(x, [-100, 100], [-20, 20]), y: useTransform(y, [-100, 100], [-20, 20]) }}
              className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl opacity-10 rotate-12"
            />
            <motion.div
              style={{ x: useTransform(x, [-100, 100], [15, -15]), y: useTransform(y, [-100, 100], [15, -15]) }}
              className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full opacity-10"
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <motion.div variants={fadeUpVariants}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-600 text-white p-2 rounded-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-emerald-600 font-semibold text-lg">chalchitra platform.</span>
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariants}>
                <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                  Create amazing videos{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-pink-600">
                    in minutes
                  </span>
                </h3>
              </motion.div>

              <motion.div variants={fadeUpVariants}>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Professional video editing by top talent. Just share your vision and watch it come to life.
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariants}>
                <Button
                  size="lg"
                  className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Try Chalchitra Now
                </Button>
              </motion.div>
            </div>

            {/* Right Visual Elements */}
            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* Main Video Card */}
                <motion.div
                  style={{
                    x: useTransform(x, [-100, 100], [-10, 10]),
                    y: useTransform(y, [-100, 100], [-10, 10]),
                  }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl p-6 shadow-2xl w-64 h-48 flex flex-col justify-between transform rotate-3 hover:rotate-0 transition-transform duration-500"
                >
                  <div className="flex items-center justify-between">
                    <div className="bg-emerald-600 p-3 rounded-xl">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-800">4.9★</div>
                      <div className="text-sm text-emerald-600">Rating</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-800 mb-2">Video Editing</h4>
                    <p className="text-emerald-700 text-sm">Professional quality guaranteed</p>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  style={{
                    x: useTransform(x, [-100, 100], [20, -20]),
                    y: useTransform(y, [-100, 100], [20, -20]),
                  }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="absolute top-0 right-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-4 shadow-xl w-20 h-20 flex items-center justify-center transform -rotate-12"
                >
                  <Edit3 className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  style={{
                    x: useTransform(x, [-100, 100], [-25, 25]),
                    y: useTransform(y, [-100, 100], [-25, 25]),
                  }}
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  className="absolute bottom-0 left-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-xl w-24 h-24 flex items-center justify-center transform rotate-12"
                >
                  <Star className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  style={{
                    x: useTransform(x, [-100, 100], [15, -15]),
                    y: useTransform(y, [-100, 100], [-15, 15]),
                  }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-1/2 right-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full p-3 shadow-xl w-16 h-16 flex items-center justify-center"
                >
                  <Clock className="w-6 h-6 text-white" />
                </motion.div>

                {/* Small floating icons */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute top-8 left-8 bg-white rounded-full p-2 shadow-lg"
                >
                  <Shield className="w-4 h-4 text-emerald-600" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-8 right-16 bg-white rounded-full p-2 shadow-lg"
                >
                  <Award className="w-4 h-4 text-pink-600" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default AboutSection
