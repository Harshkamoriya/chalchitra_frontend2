"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ResponsiveButton from "@/components/responsive-button"
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
    <div className="min-h-screen p-12 ">
      
            <PersonalInfo formData={formData} updateFormData={updateFormData}/>
            </div>
      
    
  )
}
