"use client"

import { motion } from "framer-motion"
import { memo } from "react"

const StatCard = memo(function StatCard({ icon: Icon, value, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-2" />
      <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs sm:text-sm text-gray-600">{label}</div>
    </motion.div>
  );
})

export default StatCard

