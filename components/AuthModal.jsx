"use client"

import { useState } from "react"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FaGoogle ,FaGithub } from "react-icons/fa"
import { FcGoogle  } from "react-icons/fc";
import { MdEmail, MdCheck } from "react-icons/md"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"



export function AuthModal({ isOpen, onClose, defaultMode = "signin" }) {
const [authMode, setAuthMode] = useState(defaultMode);
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})

  const handleSocialSignIn = async (provider) => {
    setIsLoading(true)
    try {
        console.log("inside handleSocialSignIn", provider)

      await signIn(provider, { callbackUrl: "/" })
    } catch (error) {
        console.log("getting error in handleSocialSignIn", error)
      console.error("Social sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (authMode === "signup") {
      if (!formData.name) {
        newErrors.name = "Name is required"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCredentialAuth = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      if (authMode === "signin") {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setErrors({ general: "Invalid email or password" })
        } else {
          onClose()
        }
      } else {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })

        if (response.ok) {
          await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            callbackUrl: "/",
          })
        } else {
          const error = await response.json()
          setErrors({ general: error.message || "Signup failed" })
        }
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const resetForm = () => {
    setFormData({ email: "", password: "", name: "", confirmPassword: "" })
    setErrors({})
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const switchMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-auto overflow-y-auto rounded-lg">
        <div className="flex flex-col md:flex-row  over">
          {/* Left Side - Promotional Content */}
          <div className="w-full md:w-1/2 bg-purple-600  text-white p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6">Your creative journey starts here</h1>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <MdCheck className="text-yellow-300 text-xl flex-shrink-0 mt-1" />
                  <span>Professional video editing services</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MdCheck className="text-yellow-300 text-xl flex-shrink-0 mt-1" />
                  <span>Connect with talented creators worldwide</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MdCheck className="text-yellow-300 text-xl flex-shrink-0 mt-1" />
                  <span>Bring your vision to life faster</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MdCheck className="text-yellow-300 text-xl flex-shrink-0 mt-1" />
                  <span>Quality work delivered on time</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side - Authentication Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center relative bg-white">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="w-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
                <p className="text-gray-600">
                  {authMode === "signin" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-purple-600 hover:text-purple-500 font-medium"
                      >
                        Join here
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={switchMode}
                        className="text-purple-600 hover:text-purple-500 font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-4">
                <Button
                  variant="outline"
                  className="w-full h-10 border-gray-300 hover:bg-gray-50 text-gray-700"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                >
                  <FcGoogle className="mr-2 h-4 w-4 " />
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-10 border-gray-300 hover:bg-gray-50 text-gray-700"
                  onClick={() => handleSocialSignIn("github")}
                  disabled={isLoading}
                >
                  <FaGithub className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-10 border-gray-300 hover:bg-gray-50 text-gray-700"
                  onClick={() => setAuthMode(authMode)}
                >
                  <MdEmail className="mr-2 h-4 w-4 text-yellow-300" />
                  Continue with email
                </Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Credential Form */}
              <form onSubmit={handleCredentialAuth} className="space-y-3">
                {errors.general && (
                  <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {errors.general}
                  </div>
                )}

                {authMode === "signup" && (
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={cn("h-10", errors.name && "border-red-500")}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>
                )}

                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={cn("h-10", errors.email && "border-red-500")}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={cn("h-10 pr-10", errors.password && "border-red-500")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>

                {authMode === "signup" && (
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={cn("h-10 pr-10", errors.confirmPassword && "border-red-500")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {authMode === "signin" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              {authMode === "signin" && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="text-sm text-purple-600 hover:text-purple-500"
                    onClick={() => {
                      console.log("Forgot password clicked")
                    }}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
