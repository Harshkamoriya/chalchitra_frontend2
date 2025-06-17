"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export function HoverTooltip({ children, content, className }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} className="w-full">
        {children}
      </div>

      {isVisible && (
        <div
          className={cn(
            "absolute z-50 p-3 bg-white border border-gray-200 rounded-lg shadow-lg",
            "min-w-[280px] max-w-[400px] text-sm",
            "top-full left-0 mt-2",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            className,
          )}
        >
          <div className="space-y-2">
            {content.title && <h4 className="font-medium text-gray-900">{content.title}</h4>}
            {content.description && <p className="text-gray-600 text-xs leading-relaxed">{content.description}</p>}
            {content.examples && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-emerald-600">✓ Good examples:</p>
                <ul className="text-xs space-y-0.5 text-emerald-600">
                  {content.examples.slice(0, 2).map((example, index) => (
                    <li key={index}>• {example}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute -top-1 left-4 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"></div>
        </div>
      )}
    </div>
  )
}
