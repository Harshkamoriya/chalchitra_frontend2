"use client"

import { usePathname } from "next/navigation"
import StepIndicator from "@/components/step-indicator"
import CompletionRate from "@/components/completion"
import { SellerFormProvider, useSellerForm } from "../../context/SellerFormContext"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Progress Header */}
      <div className=" backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 lg:py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 ">
            {/* Step Indicator Section */}
            <div className=" hidden md:block px-1 flex-1 w-full sm:w-auto">

              <StepIndicator currentStep={currentStep} />
            </div>

            {/* Completion Rate Section */}
            <div className=" flex-shrink-0 w-full sm:w-auto">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-pink-100">
                <div className="text-right sm:text-left">
                  <CompletionRate completion={calculateCompletion()} />
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {/* <div className="mt-6">
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              >
                <div className="h-full bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-500">Personal Info</span>
              <span className="text-xs text-slate-500">Professional</span>
              <span className="text-xs text-slate-500">Security</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      {children}
      {/* <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">{children}</div>
        </div>
      </div> */}

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-100/40 to-emerald-100/40 rounded-full blur-3xl"></div>
      </div>
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
