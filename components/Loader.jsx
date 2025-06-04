"use client"

import { motion } from "framer-motion"
import { Video } from "lucide-react"

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Main loading animation */}
        <div className="relative mb-6">
          <motion.div
            className="w-16 h-16 border-3 border-gray-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 border-3 border-transparent border-t-purple-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        {/* Loading text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Loading Marketplace</h3>
          <motion.p
            className="text-sm text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            Connecting you with top video editors...
          </motion.p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-600 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
