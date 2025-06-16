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
    w-8 h-8 rounded-full flex items-center justify-center text-md font-semibold border-2 transition-colors duration-300
    ${
      isCompleted || isActive
        ? "border-transparent text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
        : "bg-white border-gray-300 text-gray-400"
    }
  `}
>
  {step.id}
</div>


              {/* Step name */}
           <span
  className={`
    text-lg font-medium transition-colors duration-300
    ${
      isActive
        ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
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
