"use client"

import { useState } from "react"
import ProfessionalDetails from "@/components/professional"
import PersonalInfo from "@/components/personal-info"
import StepIndicator from "@/components/step-indicator"
import CompletionRate from "@/components/completion"
import { useSellerForm } from "@/app/context/SellerFormContext"
// Clean, minimal multi-step form matching the reference design
export  function page () {
    const {formData , updateFormData ,calculateCompletion} = useSellerForm();



  return (
    <div className="lg:p-12 p-2">
        {/* Header with step indicator and completion rate */}
             
      <ProfessionalDetails formData={formData} updateFormData={updateFormData} />
    </div>
  )
}

export default page
