"use client"

import { useState, useCallback } from "react"

export function useFormValidation() {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validateField = useCallback((name, value, rules = {}) => {
    const fieldErrors = []

    // Required validation
    if (rules.required && (!value || value.toString().trim() === "")) {
      fieldErrors.push("This field is required")
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      fieldErrors.push(`Must be at least ${rules.minLength} characters`)
    }

    // Max length validation
    if (rules.maxLength && value && value.length > rules.maxLength) {
      fieldErrors.push(`Must be no more than ${rules.maxLength} characters`)
    }

    // Price validation
    if (rules.price && value) {
      const price = Number.parseFloat(value)
      if (isNaN(price) || price < 5) {
        fieldErrors.push("Price must be at least $5")
      }
      if (price > 10000) {
        fieldErrors.push("Price cannot exceed $10,000")
      }
    }

    // Email validation
    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        fieldErrors.push("Please enter a valid email address")
      }
    }

    // Custom validation
    if (rules.custom && value) {
      const customError = rules.custom(value)
      if (customError) {
        fieldErrors.push(customError)
      }
    }

    return fieldErrors
  }, [])

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }))
  }, [])

  const clearFieldError = useCallback((name) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }, [])

  const validateForm = useCallback(
    (formData, validationRules) => {
      const newErrors = {}
      let isValid = true

      Object.entries(validationRules).forEach(([fieldName, rules]) => {
        const value = formData.get ? formData.get(fieldName) : formData[fieldName]
        const fieldErrors = validateField(fieldName, value, rules)

        if (fieldErrors.length > 0) {
          newErrors[fieldName] = fieldErrors[0] // Show first error
          isValid = false
        }
      })

      setErrors(newErrors)
      return isValid
    },
    [validateField],
  )

  return {
    errors,
    touched,
    validateField,
    setFieldError,
    setFieldTouched,
    clearFieldError,
    validateForm,
  }
}
