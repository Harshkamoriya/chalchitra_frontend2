"use client"

import { motion } from "framer-motion"

const StatCard = ({ icon: Icon, value, label, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className="text-center"
    >
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
        <div className="bg-emerald-600 text-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{value}</div>
        <div className="text-gray-600 text-sm font-medium">{label}</div>
      </div>
    </motion.div>
  )
}

export default StatCard
