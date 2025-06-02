"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Users, Star, Zap, Video, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

function StatCard({ icon: Icon, value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm"
    >
      <Icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  )
}

export default function HeroWrapper() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-transparent to-gray-200/30" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-gray-300/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-gray-400/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-gray-300/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-gray-350/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-gray-300/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header Badge */}
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-8"
          >
            <Badge variant="outline" className="bg-gray-100 border-gray-200 text-gray-700 px-4 py-2">
              <Video className="w-4 h-4 mr-2" />
              The Future of Video Editing Marketplace
            </Badge>
          </motion.div>

          {/* Main Content */}
          <div className="text-center mb-12">
            <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-700">
                  Connect with Top
                </span>
                <br />
                <span
                  className={cn(
                    "bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600",
                    pacifico.className,
                  )}
                >
                  Video Editors
                </span>
              </h1>
            </motion.div>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
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
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-gray-900 px-8 py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Find Video Editors
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                <Edit3 className="w-5 h-5 mr-2" />
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
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <StatCard icon={Users} value="10K+" label="Active Editors" delay={1.2} />
            <StatCard icon={Video} value="50K+" label="Videos Created" delay={1.3} />
            <StatCard icon={Star} value="4.9" label="Average Rating" delay={1.4} />
            <StatCard icon={Zap} value="24h" label="Avg. Delivery" delay={1.5} />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            custom={5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-center mt-12"
          >
            <p className="text-gray-500 text-sm mb-4">Trusted by creators worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-gray-600 font-semibold">YouTube Creators</div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="text-gray-600 font-semibold">Marketing Agencies</div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="text-gray-600 font-semibold">Small Businesses</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50/80 pointer-events-none" />
    </div>
  )
}
