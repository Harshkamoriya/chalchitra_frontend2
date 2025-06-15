"use client"

import { usePathname } from "next/navigation"
import StepIndicator from "@/components/step-indicator"
import CompletionRate from "@/components/completion"
import { SellerFormProvider , useSellerForm } from "../../context/SellerFormContext"
function SellerFormLayoutContent({ children }) {
  const pathname = usePathname()
  const { calculateCompletion } = useSellerForm()

  const stepMap = {
    "/seller_form/your_info": 1,
    "/seller_form/professional_info": 2,
    "/seller_form/account_security": 3,
  }

  const currentStep = stepMap[pathname] || 1

  return (
    <div>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <StepIndicator currentStep={currentStep} />
            <CompletionRate completion={calculateCompletion()} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">{children}</div>
    </div>
  )
}

export default function SellerFormLayout({ children }) {
  return (
    <SellerFormProvider>
      <SellerFormLayoutContent>{children}</SellerFormLayoutContent>
    </SellerFormProvider>
  )
}
