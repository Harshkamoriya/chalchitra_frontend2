import React from "react"
import { ChevronRight } from "lucide-react"

export default function StepIndicator({ currentStep }) {
  const steps = [
    { id: 1, name: "Personal Info" },
    { id: 2, name: "Professional Info" },
    { id: 3, name: "Account Security" },
  ]

  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id
        const isCompleted = currentStep > step.id

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center space-x-3">
              {/* Step circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors duration-300
                  ${
                    isCompleted || isActive
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                `}
              >
                {step.id}
              </div>

              {/* Step name */}
              <span
                className={`
                  text-sm font-medium transition-colors duration-300
                  ${
                    isActive
                      ? "text-green-600"
                      : isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                `}
              >
                {step.name}
              </span>
            </div>

            {/* Arrow separator */}
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
