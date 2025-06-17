"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Circle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ProgressTabs({ value, onValueChange, completedSections, children }) {
  const sections = [
    { id: "basic-info", label: "Basic Info" },
    { id: "service-details", label: "Service Details" },
    { id: "pricing", label: "Pricing" },
    { id: "portfolio", label: "Portfolio" },
    { id: "requirements", label: "Requirements" },
  ]

  const currentSection = sections.find((section) => section.id === value)
  const currentIndex = sections.findIndex((section) => section.id === value)

  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      {/* Mobile: Dropdown + Progress indicator */}
      <div className="block sm:hidden">
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentIndex + 1} of {sections.length}
            </span>
            <span>
              {completedSections.length}/{sections.length} completed
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
            />
          </div>

          {/* Current section dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-12">
                <div className="flex items-center gap-3">
                  {completedSections.includes(value) ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-blue-600" />
                  )}
                  <span className="font-medium">{currentSection?.label}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[300px]">
              {sections.map((section, index) => {
                const isCompleted = completedSections.includes(section.id)
                const isCurrent = value === section.id

                return (
                  <DropdownMenuItem
                    key={section.id}
                    onClick={() => onValueChange(section.id)}
                    className={cn("flex items-center gap-3 p-3", isCurrent && "bg-blue-50 text-blue-700")}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Circle className={cn("h-4 w-4", isCurrent ? "text-blue-600" : "text-gray-400")} />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{section.label}</span>
                      <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tablet: Horizontal scroll */}
      <div className="hidden sm:block lg:hidden">
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="inline-flex w-max h-auto p-1 min-w-full">
              {sections.map((section, index) => {
                const isCompleted = completedSections.includes(section.id)
                const isCurrent = value === section.id

                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 h-auto min-w-[140px] whitespace-nowrap",
                      "data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
                      isCompleted && "bg-emerald-50 text-emerald-700",
                      isCurrent && !isCompleted && "bg-blue-50 text-blue-700",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className={cn("h-4 w-4", isCurrent ? "text-blue-600" : "text-gray-400")} />
                      )}
                      <span className="text-sm font-medium">{section.label}</span>
                    </div>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </div>
      </div>

      {/* Desktop: Full grid layout */}
      <div className="hidden lg:block">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id)
            const isCurrent = value === section.id

            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className={cn(
                  "flex flex-col items-center gap-3 p-4 h-auto",
                  "data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
                  isCompleted && "bg-emerald-50 text-emerald-700",
                  isCurrent && !isCompleted && "bg-blue-50 text-blue-700",
                )}
              >
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <Circle className={cn("h-5 w-5", isCurrent ? "text-blue-600" : "text-gray-400")} />
                  )}
                  <span className="text-sm font-medium text-center">{section.label}</span>
                </div>
                <div className="text-xs text-muted-foreground">Step {index + 1}</div>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>

      <div className="mt-6">{children}</div>
    </Tabs>
  )
}
