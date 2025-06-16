"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const ResponsiveButton = forwardRef(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      rounded = "md",
      shadow = true,
      ripple = true,
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"

    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 border border-transparent",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 border border-gray-300",
      success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-transparent",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 border border-transparent",
      outline: "bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-500",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent focus:ring-gray-500",
      gradient:
        "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white focus:ring-pink-500 border border-transparent",
    }

    const sizes = {
      xs: "px-2.5 py-1.5 text-xs min-h-[28px]",
      sm: "px-3 py-2 text-sm min-h-[32px]",
      md: "px-4 py-2.5 text-sm min-h-[40px]",
      lg: "px-6 py-3 text-base min-h-[44px]",
      xl: "px-8 py-4 text-lg min-h-[52px]",
    }

    const roundedStyles = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      full: "rounded-full",
    }

    const shadowStyles = shadow ? "shadow-sm hover:shadow-md" : ""

    const handleClick = (e) => {
      if (loading || disabled) return

      // Ripple effect
      if (ripple) {
        const button = e.currentTarget
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        const rippleElement = document.createElement("span")
        rippleElement.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `

        button.appendChild(rippleElement)

        setTimeout(() => {
          rippleElement.remove()
        }, 600)
      }

      onClick?.(e)
    }

    return (
      <>
        <style jsx>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .loading-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

        <button
          ref={ref}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            roundedStyles[rounded],
            shadowStyles,
            fullWidth && "w-full",
            loading && "loading-pulse",
            className,
          )}
          disabled={disabled || loading}
          onClick={handleClick}
          {...props}
        >
          {/* Background gradient overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Loading spinner */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Content */}
          <div className={cn("flex items-center gap-2", loading && "opacity-0")}>
            {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}

            <span className="truncate">{children}</span>

            {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
          </div>
        </button>
      </>
    )
  },
)

ResponsiveButton.displayName = "ResponsiveButton"

export default ResponsiveButton
