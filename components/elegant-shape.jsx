"use client"

import { motion } from "framer-motion"
import { memo } from "react"
import { cn } from "@/lib/utils"

const ElegantShape = memo(function ElegantShape({
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
        y: -80,
        rotate: rotate - 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
      }}
      className={cn("absolute", className)}>
      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-sm border border-white/10",
            "shadow-lg shadow-gray-200/20"
          )} />
      </motion.div>
    </motion.div>
  );
})

export default ElegantShape
