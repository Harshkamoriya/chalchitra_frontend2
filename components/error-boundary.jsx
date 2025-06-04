"use client"

import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ErrorBoundary({
  error = "Something went wrong",
  onRetry,
  onHome,
  showRetry = true,
  showHome = true,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto">
        {/* Error icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </motion.div>

        {/* Error message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h2>
          <p className="text-gray-600 leading-relaxed">
            {error || "We're having trouble loading the marketplace. Please try again."}
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && (
            <Button
              onClick={onRetry}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          {showHome && (
            <Button
              onClick={onHome}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          )}
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-sm text-gray-500 mt-6">
          If the problem persists, please contact our support team.
        </motion.p>
      </motion.div>
    </div>
  );
}
