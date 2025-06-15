"use client"

import { useState } from "react"
import PersonalInfo from "@/components/personal-info"
import StepIndicator from "@/components/step-indicator"
import CompletionRate from "@/components/completion"
import { useSellerForm } from "@/app/context/SellerFormContext"
// Clean, minimal multi-step form matching the reference design
export default function CleanMultiStepForm() {
    const {formData , updateFormData , calculateCompletion} = useSellerForm();
//   const [currentStep, setCurrentStep] = useState(1)

//   // Form data state
//   const [formData, setFormData] = useState({
//     // Personal Info
//     firstName: "",
//     lastName: "",
//     displayName: "",
//     profileImage: null,
//     description: "",
//     languages: [],
//   })


  // Update form data
//   const updateFormData = (stepData) => {
//     setFormData((prev) => ({ ...prev, ...stepData }))
//   }

  // Navigation functions
//   const nextStep = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   // Calculate completion percentage
//   const calculateCompletion = () => {
//     const totalFields = 12
//     let filledFields = 0

//     Object.entries(formData).forEach(([key, value]) => {
//       if (Array.isArray(value)) {
//         if (value.length > 0) filledFields++
//       } else if (value && value !== "") {
//         filledFields++
//       }
//     })

//     return Math.round((filledFields / totalFields) * 100)
//   }

  // Render current step
//   const renderStep = () => {
    // const stepProps = {
    //   formData,
    //   updateFormData,
    //   nextStep,
    //   prevStep,
    // }

//     switch (currentStep) {
//       case 1:
//         return <PersonalInfo {...stepProps} />
//       case 2:
//         return <ProfessionalDetails {...stepProps} />
//       case 3:
//         return <AccountDetails {...stepProps} />
//       default:
//         return null
//     }
//   }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with step indicator and completion rate */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <StepIndicator currentStep={1} />
            <CompletionRate completion={calculateCompletion()} />
          </div>
        </div>
      </div> */}

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <PersonalInfo formData={formData} updateFormData={updateFormData}/>
            
            </div>
      </div>
    </div>
  )
}
