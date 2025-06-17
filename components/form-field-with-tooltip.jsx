"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function FormFieldWithTooltip({
  label,
  tooltip,
  children,
  error,
  success,
  required = false,
  characterCount,
  maxLength,
  className,
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2">
          <Label className="flex items-center gap-2">
            {label}
            {required && <span className="text-red-500">*</span>}
          </Label>

          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle
                className={cn(
                  "h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-help",
                  isHovered && "text-primary",
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-medium">{tooltip.title}</p>
                <p className="text-sm text-muted-foreground">{tooltip.description}</p>
                {tooltip.examples && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-green-600">Good examples:</p>
                    <ul className="text-xs space-y-1">
                      {tooltip.examples.map((example, index) => (
                        <li key={index} className="text-green-600">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tooltip.avoid && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-red-600">Avoid:</p>
                    <ul className="text-xs space-y-1">
                      {tooltip.avoid.map((avoid, index) => (
                        <li key={index} className="text-red-600">
                          • {avoid}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>

          {success && <CheckCircle className="h-4 w-4 text-green-500" />}
          {error && <AlertCircle className="h-4 w-4 text-red-500" />}
        </div>

        <div className="relative">
          {children}

          {characterCount !== undefined && maxLength && (
            <div className="absolute right-2 top-2 text-xs text-muted-foreground">
              <span className={characterCount > maxLength ? "text-red-500" : ""}>
                {characterCount}/{maxLength}
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {success}
          </p>
        )}
      </div>
    </TooltipProvider>
  )
}
