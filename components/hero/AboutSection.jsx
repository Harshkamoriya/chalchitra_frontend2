"use client"

import { motion } from "framer-motion"
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
} from "lucide-react"

const AboutSection = () => {
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
      src:"https://img.freepik.com/free-vector/ecotourism-concept-illustration_114360-25851.jpg?semt=ais_hybrid&w=740"
    },
    {
      icon: MessageCircle,
      title: "Connect & Discuss",
      description: "Chat directly with editors, share your vision, and get custom quotes for your project.",
      number: "02",
      src:"https://img.freepik.com/free-vector/ecotourism-concept-illustration_114360-25851.jpg?semt=ais_hybrid&w=740"
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Pay safely through our escrow system. Your money is protected until you're 100% satisfied.",
      number: "03",
      src:"https://img.freepik.com/free-vector/ecotourism-concept-illustration_114360-25851.jpg?semt=ais_hybrid&w=740"
    },
    {
      icon: CheckCircle,
      title: "Receive & Review",
      description: "Get your professionally edited video delivered on time, with unlimited revisions included.",
      number: "04",
      src:"https://img.freepik.com/free-vector/ecotourism-concept-illustration_114360-25851.jpg?semt=ais_hybrid&w=740"
    },
  ]

  const sellerSteps = [
    {
      icon: Upload,
      title: "Create Your Profile",
      description: "Showcase your skills with an impressive portfolio and detailed service descriptions.",
      number: "01",
    },
    {
      icon: Users,
      title: "Get Discovered",
      description: "Our algorithm matches you with clients looking for your specific editing expertise.",
      number: "02",
    },
    {
      icon: Star,
      title: "Deliver Excellence",
      description: "Work on exciting projects, build your reputation, and earn 5-star reviews from happy clients.",
      number: "03",
    },
    {
      icon: Zap,
      title: "Grow Your Business",
      description: "Scale your freelance business with our tools, analytics, and growing client base.",
      number: "04",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Advanced encryption and secure payment processing",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Most projects completed within 24-48 hours",
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "Unlimited revisions until you're completely satisfied",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div variants={fadeUpVariants}>
            <Badge className="bg-gray-50 text-gray-700 border-gray-200 px-4 py-2 text-sm mb-6">
              How It Works
            </Badge>
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

        {/* Buyer Steps */}
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

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden lg:block"></div>

            {buyerSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                className={`relative flex flex-col lg:flex-row items-center justify-center mb-16 gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="lg:w-1/2 w-full">
                  <div
                    className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-gray-600 text-white rounded-full p-3 mr-4 shadow-lg">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <span className="text-4xl font-bold text-gray-100">{step.number}</span>
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h4>
                    <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                  </div>
                </div>

                <div className="lg:w-1/2 w-full">
                  <div className="bg-gray-50 rounded-2xl h-64 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden">
                    <img src={step.src} alt={step.title} className="h-full w-full object-cover" />
                  </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full hidden lg:block shadow-lg border-4 border-white"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Seller Steps */}
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

          <div className="grid lg:grid-cols-2 gap-12">
            {sellerSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                className="group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white p-8 h-full shadow-lg hover:shadow-xl border border-gray-100">
                  <div className="absolute top-6 right-6 bg-gray-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  <div className="bg-gray-600 text-white rounded-full p-4 w-16 h-16 mb-6 shadow-lg">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">{step.description}</p>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-50 rounded-full transform translate-x-16 translate-y-16"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gray-900 rounded-3xl p-12 text-white shadow-2xl"
        >
          <motion.div variants={fadeUpVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Why Choose Chalchitra?</h3>
            <p className="text-xl opacity-90">The most trusted platform for video editing services</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeUpVariants} className="text-center">
                <div className="bg-gray-600 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="opacity-90">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUpVariants} className="text-center">
            <Button
              size="lg"
              className="bg-gray-600 text-white hover:bg-gray-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch How It Works
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
