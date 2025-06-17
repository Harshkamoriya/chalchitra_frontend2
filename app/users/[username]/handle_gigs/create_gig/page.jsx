"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Upload, X, Plus, Video, Clock, Star, Zap, Palette, Settings, TrendingUp } from "lucide-react"
import { HoverTooltip } from "@/components/hover-tooltip"
import { TagAutocomplete } from "@/components/tag-autocomplete"
import { ProgressTabs } from "@/components/progress-tabs"
import { createGig } from "./action"
import { Toaster } from "@/components/ui/sonner"
// import { Toaster } from "@/components/ui/use-Toaster"

export default function CreateGigPage() {
  const [currentTab, setCurrentTab] = useState("basic-info")
  const [completedSections, setCompletedSections] = useState([])
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")
  const [portfolioFiles, setPortfolioFiles] = useState([])
  const [buyerRequirements, setBuyerRequirements] = useState([])
  const [buyerQuestions, setBuyerQuestions] = useState([])
  const [addOns, setAddOns] = useState([])
  const [formErrors, setFormErrors] = useState({})

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    portfolioDescription: "",
    portfolioWebsite: "",
    maxDuration: "",
    basicPrice: "",
    standardPrice: "",
    premiumPrice: "",
    basicDeliveryTime: "",
    standardDeliveryTime: "",
    premiumDeliveryTime: "",
    basicRevisions: "",
    standardRevisions: "",
    premiumRevisions: "",
    basicFeatures: [],
    standardFeatures: [],
    premiumFeatures: [],
    basicRushDelivery: false,
    standardRushDelivery: false,
    premiumRushDelivery: false,
    basicRushTime: "",
    standardRushTime: "",
    premiumRushTime: "",
    basicRushPrice: "",
    standardRushPrice: "",
    premiumRushPrice: "",
    basicOutputLength: "",
    standardOutputLength: "",
    premiumOutputLength: "",
    basicInputLength: "",
    standardInputLength: "",
    premiumInputLength: "",
  })

  // Load saved form data from localStorage on initial load
  useEffect(() => {
    const savedData = localStorage.getItem("gigFormData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData(parsedData.formData || formData)
        setTags(parsedData.tags || [])
        setPortfolioFiles(parsedData.portfolioFiles || [])
        setBuyerRequirements(parsedData.buyerRequirements || [])
        setBuyerQuestions(parsedData.buyerQuestions || [])
        setAddOns(parsedData.addOns || [])
        setCompletedSections(parsedData.completedSections || [])
      } catch (error) {
        console.error("Error loading saved form data:", error)
      }
    }
  }, [])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      formData,
      tags,
      portfolioFiles,
      buyerRequirements,
      buyerQuestions,
      addOns,
      completedSections,
    }
    localStorage.setItem("gigFormData", JSON.stringify(dataToSave))
  }, [formData, tags, portfolioFiles, buyerRequirements, buyerQuestions, addOns, completedSections])

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim()) && tags.length < 5) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const validFiles = files.filter((file) => file.type.startsWith("video/") && file.size <= 100 * 1024 * 1024)
    setPortfolioFiles([...portfolioFiles, ...validFiles])
  }

  const removeFile = (index) => {
    setPortfolioFiles(portfolioFiles.filter((_, i) => i !== index))
  }

  const addBuyerRequirement = () => {
    setBuyerRequirements([...buyerRequirements, { id: Date.now(), text: "", checked: false }])
  }

  const updateBuyerRequirement = (id, text) => {
    setBuyerRequirements((prev) => prev.map((req) => (req.id === id ? { ...req, text } : req)))
  }

  const removeBuyerRequirement = (id) => {
    setBuyerRequirements((prev) => prev.filter((req) => req.id !== id))
  }

  const addBuyerQuestion = () => {
    setBuyerQuestions([...buyerQuestions, { id: Date.now(), question: "" }])
  }

  const updateBuyerQuestion = (id, question) => {
    setBuyerQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, question } : q)))
  }

  const removeBuyerQuestion = (id) => {
    setBuyerQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const toggleAddOn = (addOnId) => {
    setAddOns((prev) => {
      const exists = prev.find((addon) => addon.id === addOnId)
      if (exists) {
        return prev.filter((addon) => addon.id !== addOnId)
      } else {
        return [...prev, { id: addOnId, price: "", deliveryTime: "" }]
      }
    })
  }

  const updateAddOn = (addOnId, field, value) => {
    setAddOns((prev) => prev.map((addon) => (addon.id === addOnId ? { ...addon, [field]: value } : addon)))
  }

  // Validation functions for each section
  const validateBasicInfo = () => {
    const errors = {}

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }

    if (!formData.category) {
      errors.category = "Category is required"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }

    if (tags.length < 3) {
      errors.tags = "At least 3 tags are required"
    }

    return errors
  }

  const validateServiceDetails = () => {
    const errors = {}

    if (!formData.maxDuration) {
      errors.maxDuration = "Maximum duration is required"
    }

    return errors
  }

  const validatePricing = () => {
    const errors = {}

    if (!formData.basicPrice) {
      errors.basicPrice = "Basic price is required"
    }

    if (!formData.basicDeliveryTime) {
      errors.basicDeliveryTime = "Basic delivery time is required"
    }

    if (!formData.basicRevisions) {
      errors.basicRevisions = "Basic revisions is required"
    }

    return errors
  }

  const validatePortfolio = () => {
    const errors = {}

    if (portfolioFiles.length === 0 && !formData.portfolioWebsite) {
      errors.portfolio = "Either upload files or provide a portfolio website"
    }

    return errors
  }

  const validateRequirements = () => {
    const errors = {}

    if (buyerRequirements.filter((req) => req.text.trim()).length === 0) {
      errors.buyerRequirements = "At least one requirement is needed"
    }

    if (buyerQuestions.filter((q) => q.question.trim()).length === 0) {
      errors.buyerQuestions = "At least one question is needed"
    }

    return errors
  }

  // Get validation function for current tab
  const getValidationForTab = (tabId) => {
    switch (tabId) {
      case "basic-info":
        return validateBasicInfo
      case "service-details":
        return validateServiceDetails
      case "pricing":
        return validatePricing
      case "portfolio":
        return validatePortfolio
      case "requirements":
        return validateRequirements
      default:
        return () => ({})
    }
  }

  // Tab navigation with validation
  const sections = ["basic-info", "service-details", "pricing", "portfolio", "requirements"]

  const handleNext = () => {
    // Validate current section
    const validateFn = getValidationForTab(currentTab)
    const errors = validateFn()

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)

      // Show Toaster with error message
      Toasterer({
        title: "Please fix the errors",
        description: "Some required fields need your attention",
        variant: "destructive",
      })

      return
    }

    // Clear errors
    setFormErrors({})

    // Mark current section as completed if not already
    if (!completedSections.includes(currentTab)) {
      setCompletedSections((prev) => [...prev, currentTab])
    }

    // Navigate to next tab
    const currentIndex = sections.indexOf(currentTab)
    if (currentIndex < sections.length - 1) {
      setCurrentTab(sections[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const currentIndex = sections.indexOf(currentTab)
    if (currentIndex > 0) {
      setCurrentTab(sections[currentIndex - 1])
    }
  }

  const isFirstStep = sections.indexOf(currentTab) === 0
  const isLastStep = sections.indexOf(currentTab) === sections.length - 1
  const isFormComplete = completedSections.length === 5

  // Tooltip content
  const tooltips = {
    title: {
      title: "Create an Engaging Gig Title",
      description: "Your title should be specific and compelling. Include what you do and for whom.",
      examples: [
        "I will edit your YouTube videos with professional transitions",
        "I will create cinematic wedding video edits with color grading",
      ],
    },
    description: {
      title: "Detailed Service Description",
      description: "Explain your experience, process, and what makes you unique.",
      examples: ["Mention your years of experience and software expertise", "Describe your editing style and approach"],
    },
    pricing: {
      title: "Competitive Pricing Strategy",
      description: "Research similar services and price competitively based on your experience.",
      examples: ["Basic: $25-50 for simple edits", "Premium: $200+ for complex projects"],
    },
  }

  const videoCategories = [
    "YouTube Videos",
    "Social Media Content",
    "Wedding Videos",
    "Corporate Videos",
    "Music Videos",
    "Documentary",
    "Promotional Videos",
    "Educational Content",
    "Gaming Videos",
    "Podcast Editing",
    "Live Stream Editing",
    "Short Films",
  ]

  const packageFeatures = [
    { id: "color-grading", label: "Color Grading" },
    { id: "sound-design", label: "Sound Design & Mixing" },
    { id: "motion-graphics", label: "Motion Graphics" },
    { id: "subtitles", label: "Subtitles/Captions" },
    { id: "thumbnails", label: "Custom Thumbnails" },
    { id: "source-files", label: "Source Files Included" },
    { id: "music-sync", label: "Background Music Sync" },
    { id: "transitions", label: "Professional Transitions" },
    { id: "intro-outro", label: "Custom Intro/Outro" },
    { id: "social-optimization", label: "Social Media Optimization" },
  ]

  const addOnServices = [
    { id: "extra-color-grading", label: "Advanced Color Grading" },
    { id: "extra-thumbnails", label: "Additional Thumbnails" },
    { id: "extra-source-files", label: "Source Files" },
    { id: "extra-revisions", label: "Additional Revisions" },
    { id: "extra-motion-graphics", label: "Custom Motion Graphics" },
    { id: "rush-24h", label: "24-Hour Rush Delivery" },
    { id: "social-versions", label: "Multiple Social Media Versions" },
    { id: "subtitle-translation", label: "Subtitle Translation" },
  ]

  const defaultRequirements = [
    "Raw footage files (MP4/MOV format)",
    "Preferred background music",
    "Brand colors/logos (if applicable)",
    "Desired video length",
    "Style references or examples",
    "Text/titles to include",
  ]

  const defaultQuestions = [
    "What's the target audience for this video?",
    "What's the main goal/message?",
    "Do you have style preferences?",
    "Which platform will this be published on?",
    "Any specific deadline requirements?",
  ]

  // Initialize default requirements and questions
  useEffect(() => {
    if (buyerRequirements.length === 0) {
      setBuyerRequirements(
        defaultRequirements.map((req, index) => ({
          id: index + 1,
          text: req,
          checked: true,
        })),
      )
    }
    if (buyerQuestions.length === 0) {
      setBuyerQuestions(
        defaultQuestions.map((q, index) => ({
          id: index + 1,
          question: q,
        })),
      )
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Video Editing Gig
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Showcase your video editing skills and attract clients with a compelling gig
          </p>

          <div className="mt-8 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span>Complete all sections for 3x more visibility</span>
            </div>
            <div className="text-gray-500 font-medium">{completedSections.length}/5 sections completed</div>
          </div>
        </div>

        <form action={createGig} className="space-y-10">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <ProgressTabs
              value={currentTab}
              onValueChange={setCurrentTab}
              completedSections={completedSections}
            ></ProgressTabs>

            {/* Basic Info Tab */}
            <TabsContent value="basic-info" className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-2xl">
                    <Video className="h-6 w-6 text-blue-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-base mt-2">Tell us about your video editing service</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Gig Title *</Label>
                    <HoverTooltip content={tooltips.title}>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="I will edit your YouTube videos professionally with cinematic effects"
                        className={cn(
                          "h-12 text-base border-gray-200 focus:border-blue-400 focus:ring-blue-400",
                          formErrors.title && "border-red-500",
                        )}
                        required
                      />
                    </HoverTooltip>
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">Make it specific and compelling</span>
                      <span className="text-sm text-gray-400">{formData.title.length}/80</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Video Category *</Label>
                    <HoverTooltip
                      content={{
                        title: "Choose Your Specialty",
                        description: "Select the category that best matches your expertise.",
                        examples: ["YouTube Videos for content creators", "Wedding Videos for couples"],
                      }}
                    >
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger
                          className={cn("h-12 text-base border-gray-200", formErrors.category && "border-red-500")}
                        >
                          <SelectValue placeholder="Select your video editing specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {videoCategories.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, "-")}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </HoverTooltip>
                    {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Description *</Label>
                    <HoverTooltip content={tooltips.description}>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="I'm a professional video editor with 5+ years of experience specializing in YouTube content. I use Adobe Premiere Pro and After Effects to create engaging videos with smooth transitions, color grading, and motion graphics. My editing style focuses on keeping viewers engaged while maintaining professional quality..."
                        className={cn(
                          "min-h-[160px] text-base leading-relaxed border-gray-200 focus:border-blue-400 resize-none",
                          formErrors.description && "border-red-500",
                        )}
                        required
                      />
                    </HoverTooltip>
                    {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">Describe your experience and unique approach</span>
                      <span className="text-sm text-gray-400">{formData.description.length}/1200</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Tags *</Label>
                    <HoverTooltip
                      content={{
                        title: "Relevant Keywords & Tags",
                        description:
                          "Use tags that buyers would search for. Think about style, platform, and content type.",
                        examples: ["youtube-editing", "cinematic", "color-grading"],
                      }}
                    >
                      <div>
                        <TagAutocomplete
                          value={currentTag}
                          onChange={setCurrentTag}
                          onAdd={addTag}
                          disabled={tags.length >= 5}
                          placeholder="e.g., youtube-editing, cinematic, color-grading"
                          className={formErrors.tags ? "border-red-500" : ""}
                        />
                      </div>
                    </HoverTooltip>
                    {formErrors.tags && <p className="text-red-500 text-sm mt-1">{formErrors.tags}</p>}

                    <div className="flex flex-wrap gap-3 mt-4">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 text-sm"
                        >
                          {tag}
                          <X className="h-3 w-3 cursor-pointer hover:text-blue-900" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500 mt-3">{tags.length}/5 tags • Tags help buyers find your gig</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Service Details Tab */}
            <TabsContent value="service-details" className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-2xl">
                    <Settings className="h-6 w-6 text-purple-600" />
                    Service Specifications
                  </CardTitle>
                  <CardDescription className="text-base mt-2">Define what your service includes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Maximum Video Duration (minutes) *</Label>
                    <HoverTooltip
                      content={{
                        title: "Duration Limits",
                        description: "Set realistic limits based on your capacity and pricing.",
                        examples: ["30 minutes for standard packages", "60+ minutes for premium"],
                      }}
                    >
                      <Input
                        name="maxDuration"
                        type="number"
                        value={formData.maxDuration}
                        onChange={(e) => handleInputChange("maxDuration", e.target.value)}
                        placeholder="e.g., 30"
                        className={cn("h-12 text-base border-gray-200", formErrors.maxDuration && "border-red-500")}
                        min="1"
                        max="300"
                        required
                      />
                    </HoverTooltip>
                    {formErrors.maxDuration && <p className="text-red-500 text-sm mt-1">{formErrors.maxDuration}</p>}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Editing Styles You Offer</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {["Cinematic", "Fast-paced", "Minimalist", "Vintage", "Modern", "Dramatic"].map((style) => (
                        <div key={style} className="flex items-center space-x-3">
                          <Checkbox id={style} name="editingStyles" value={style} className="h-5 w-5" />
                          <Label htmlFor={style} className="text-base text-gray-700">
                            {style}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Supported Resolutions</Label>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {["720p HD", "1080p Full HD", "4K Ultra HD", "8K"].map((resolution) => (
                        <div key={resolution} className="flex items-center space-x-3">
                          <Checkbox id={resolution} name="resolutions" value={resolution} className="h-5 w-5" />
                          <Label htmlFor={resolution} className="text-base text-gray-700">
                            {resolution}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-2xl">
                    <Star className="h-6 w-6 text-emerald-600" />
                    Pricing Packages
                  </CardTitle>
                  <CardDescription className="text-base mt-2">Create different tiers for your service</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {["basic", "standard", "premium"].map((tier, index) => (
                      <Card key={tier} className={`${index === 1 ? "border-blue-400 shadow-md" : "border-gray-200"}`}>
                        <CardHeader className="pb-6">
                          <CardTitle className="capitalize flex items-center gap-3 text-gray-800 text-2xl font-medium">
                            {tier}
                            {index === 1 && <Badge className="bg-blue-100 text-blue-700">Popular</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-gray-700 font-medium text-lg">Price ($) *</Label>
                            <HoverTooltip content={tooltips.pricing}>
                              <Input
                                name={`${tier}Price`}
                                type="number"
                                value={formData[`${tier}Price`]}
                                onChange={(e) => handleInputChange(`${tier}Price`, e.target.value)}
                                placeholder={tier === "basic" ? "25" : tier === "standard" ? "75" : "150"}
                                className={cn(
                                  "h-12 text-base border-gray-200",
                                  formErrors[`${tier}Price`] && "border-red-500",
                                )}
                                min="5"
                                max="10000"
                                required={tier === "basic"}
                              />
                            </HoverTooltip>
                            {formErrors[`${tier}Price`] && tier === "basic" && (
                              <p className="text-red-500 text-sm mt-1">{formErrors[`${tier}Price`]}</p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label className="text-gray-700 font-medium text-lg">Delivery Time *</Label>
                            <Select
                              value={formData[`${tier}DeliveryTime`]}
                              onValueChange={(value) => handleInputChange(`${tier}DeliveryTime`, value)}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-12 text-base border-gray-200",
                                  formErrors[`${tier}DeliveryTime`] && tier === "basic" && "border-red-500",
                                )}
                              >
                                <SelectValue placeholder="Select delivery time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-day">1 Day</SelectItem>
                                <SelectItem value="2-days">2 Days</SelectItem>
                                <SelectItem value="3-days">3 Days</SelectItem>
                                <SelectItem value="1-week">1 Week</SelectItem>
                                <SelectItem value="2-weeks">2 Weeks</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors[`${tier}DeliveryTime`] && tier === "basic" && (
                              <p className="text-red-500 text-sm mt-1">{formErrors[`${tier}DeliveryTime`]}</p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label className="text-gray-700 font-medium text-lg">Revisions *</Label>
                            <Select
                              value={formData[`${tier}Revisions`]}
                              onValueChange={(value) => handleInputChange(`${tier}Revisions`, value)}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-12 text-base border-gray-200",
                                  formErrors[`${tier}Revisions`] && tier === "basic" && "border-red-500",
                                )}
                              >
                                <SelectValue placeholder="Number of revisions" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 Revision</SelectItem>
                                <SelectItem value="2">2 Revisions</SelectItem>
                                <SelectItem value="3">3 Revisions</SelectItem>
                                <SelectItem value="5">5 Revisions</SelectItem>
                                <SelectItem value="unlimited">Unlimited</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors[`${tier}Revisions`] && tier === "basic" && (
                              <p className="text-red-500 text-sm mt-1">{formErrors[`${tier}Revisions`]}</p>
                            )}
                          </div>

                          {/* Output and Input Length */}
                          <div className="space-y-3">
                            <Label className="text-gray-700 font-medium text-lg">Output Length (minutes)</Label>
                            <HoverTooltip
                              content={{
                                title: "Final Video Length",
                                description: "Maximum length of the final edited video you'll deliver.",
                                examples: ["5 minutes for basic", "15 minutes for standard", "30+ minutes for premium"],
                              }}
                            >
                              <Input
                                name={`${tier}OutputLength`}
                                type="number"
                                value={formData[`${tier}OutputLength`]}
                                onChange={(e) => handleInputChange(`${tier}OutputLength`, e.target.value)}
                                placeholder={tier === "basic" ? "5" : tier === "standard" ? "15" : "30"}
                                className="h-12 text-base border-gray-200"
                                min="1"
                                max="180"
                              />
                            </HoverTooltip>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-gray-700 font-medium text-lg">Max Input Footage (minutes)</Label>
                            <HoverTooltip
                              content={{
                                title: "Raw Footage Limit",
                                description: "Maximum amount of raw footage you'll accept from the buyer.",
                                examples: [
                                  "30 minutes for basic",
                                  "60 minutes for standard",
                                  "120+ minutes for premium",
                                ],
                              }}
                            >
                              <Input
                                name={`${tier}InputLength`}
                                type="number"
                                value={formData[`${tier}InputLength`]}
                                onChange={(e) => handleInputChange(`${tier}InputLength`, e.target.value)}
                                placeholder={tier === "basic" ? "30" : tier === "standard" ? "60" : "120"}
                                className="h-12 text-base border-gray-200"
                                min="5"
                                max="600"
                              />
                            </HoverTooltip>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-gray-700 font-medium text-lg">What's Included</Label>
                            <div className="grid grid-cols-1 gap-3 mt-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                              {packageFeatures.map((feature) => (
                                <div key={feature.id} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`${tier}-${feature.id}`}
                                    name={`${tier}Features`}
                                    value={feature.id}
                                    checked={formData[`${tier}Features`]?.includes(feature.id)}
                                    onCheckedChange={(checked) => {
                                      const currentFeatures = formData[`${tier}Features`] || []
                                      const newFeatures = checked
                                        ? [...currentFeatures, feature.id]
                                        : currentFeatures.filter((f) => f !== feature.id)
                                      handleInputChange(`${tier}Features`, newFeatures)
                                    }}
                                    className="h-5 w-5"
                                  />
                                  <Label htmlFor={`${tier}-${feature.id}`} className="text-base text-gray-700">
                                    {feature.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Rush Delivery */}
                          <div className="border-t pt-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <Checkbox
                                id={`${tier}-rush`}
                                checked={formData[`${tier}RushDelivery`]}
                                onCheckedChange={(checked) => handleInputChange(`${tier}RushDelivery`, checked)}
                                className="h-5 w-5"
                              />
                              <Label
                                htmlFor={`${tier}-rush`}
                                className="text-base flex items-center gap-2 text-gray-700"
                              >
                                <Zap className="h-4 w-4 text-yellow-500" />
                                Rush Delivery Available
                              </Label>
                            </div>

                            {formData[`${tier}RushDelivery`] && (
                              <div className="space-y-4 ml-8">
                                <div className="space-y-2">
                                  <Label className="text-sm text-gray-600 font-medium">Rush Delivery Time</Label>
                                  <Select
                                    value={formData[`${tier}RushTime`]}
                                    onValueChange={(value) => handleInputChange(`${tier}RushTime`, value)}
                                  >
                                    <SelectTrigger className="h-10 text-sm">
                                      <SelectValue placeholder="Select rush time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="12-hours">12 Hours</SelectItem>
                                      <SelectItem value="24-hours">24 Hours</SelectItem>
                                      <SelectItem value="48-hours">48 Hours</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm text-gray-600 font-medium">Additional Price ($)</Label>
                                  <Input
                                    type="number"
                                    value={formData[`${tier}RushPrice`]}
                                    onChange={(e) => handleInputChange(`${tier}RushPrice`, e.target.value)}
                                    placeholder="25"
                                    className="h-10 text-sm"
                                    min="5"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Add-ons Section */}
                  <Card className="border-gray-200">
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-medium text-gray-800">Add-ons (Extra Services)</CardTitle>
                      <CardDescription className="text-base mt-2">
                        Offer additional services for extra charges
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addOnServices.map((service) => {
                          const isSelected = addOns.some((addon) => addon.id === service.id)
                          const addon = addOns.find((addon) => addon.id === service.id)

                          return (
                            <div key={service.id} className="space-y-4">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={service.id}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleAddOn(service.id)}
                                  className="h-5 w-5"
                                />
                                <Label htmlFor={service.id} className="text-base text-gray-700">
                                  {service.label}
                                </Label>
                              </div>

                              {isSelected && (
                                <div className="ml-8 grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-600 font-medium">Price ($)</Label>
                                    <Input
                                      type="number"
                                      value={addon?.price || ""}
                                      onChange={(e) => updateAddOn(service.id, "price", e.target.value)}
                                      placeholder="15"
                                      className="h-10 text-sm"
                                      min="5"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm text-gray-600 font-medium">Extra Time</Label>
                                    <Select
                                      value={addon?.deliveryTime || ""}
                                      onValueChange={(value) => updateAddOn(service.id, "deliveryTime", value)}
                                    >
                                      <SelectTrigger className="h-10 text-sm">
                                        <SelectValue placeholder="Select time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="same-day">Same Day</SelectItem>
                                        <SelectItem value="1-day">+1 Day</SelectItem>
                                        <SelectItem value="2-days">+2 Days</SelectItem>
                                        <SelectItem value="3-days">+3 Days</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-2xl">
                    <Palette className="h-6 w-6 text-pink-600" />
                    Portfolio & Samples
                  </CardTitle>
                  <CardDescription className="text-base mt-2">Show your best work to attract clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Upload Sample Videos</Label>
                    <div
                      className={cn(
                        "border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors",
                        formErrors.portfolio && "border-red-500",
                      )}
                    >
                      <div className="text-center">
                        <Upload className="mx-auto h-16 w-16 text-gray-400" />
                        <div className="mt-6">
                          <Label htmlFor="portfolio-upload" className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-500 text-base font-medium">
                              Click to upload
                            </span>
                            <span className="text-gray-500 text-base"> or drag and drop</span>
                          </Label>
                          <Input
                            id="portfolio-upload"
                            type="file"
                            multiple
                            accept="video/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </div>
                        <p className="text-base text-gray-500 mt-4">
                          MP4, MOV, AVI up to 100MB each • Upload 3-5 of your best samples
                        </p>
                      </div>
                    </div>
                    {formErrors.portfolio && <p className="text-red-500 text-sm mt-1">{formErrors.portfolio}</p>}
                  </div>

                  {portfolioFiles.length > 0 && (
                    <div className="space-y-4">
                      <Label className="text-gray-700 font-semibold text-base">
                        Uploaded Files ({portfolioFiles.length}/5)
                      </Label>
                      <div className="space-y-3">
                        {portfolioFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <Video className="h-6 w-6 text-gray-400" />
                              <div>
                                <span className="text-base font-medium text-gray-700">{file.name}</span>
                                <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                              </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                              <X className="h-5 w-5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Portfolio Website (Optional)</Label>
                    <HoverTooltip
                      content={{
                        title: "Portfolio Website Link",
                        description: "Add a link to your portfolio website, YouTube channel, or Vimeo profile.",
                        examples: ["https://yourportfolio.com", "https://youtube.com/yourchannel"],
                      }}
                    >
                      <Input
                        name="portfolioWebsite"
                        type="url"
                        value={formData.portfolioWebsite}
                        onChange={(e) => handleInputChange("portfolioWebsite", e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="h-12 text-base border-gray-200"
                      />
                    </HoverTooltip>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 font-medium text-lg">Portfolio Description</Label>
                    <HoverTooltip
                      content={{
                        title: "Showcase Your Style",
                        description: "Describe your editing approach and what makes your work unique.",
                        examples: ["Years of experience", "Signature editing techniques"],
                      }}
                    >
                      <Textarea
                        name="portfolioDescription"
                        value={formData.portfolioDescription}
                        onChange={(e) => handleInputChange("portfolioDescription", e.target.value)}
                        placeholder="I specialize in creating engaging YouTube content with a focus on storytelling and visual appeal. My editing style combines smooth transitions with dynamic pacing to keep viewers engaged. I've worked with content creators across gaming, lifestyle, and educational niches..."
                        className="min-h-[140px] text-base leading-relaxed border-gray-200 resize-none"
                        rows={6}
                      />
                    </HoverTooltip>
                    <div className="flex justify-end mt-2">
                      <span className="text-sm text-gray-400">{formData.portfolioDescription.length}/500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-2xl">
                    <Clock className="h-6 w-6 text-orange-600" />
                    Buyer Requirements
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    What do you need from buyers to get started?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="space-y-6">
                    <div className="flex flex-col gap-4 justify-start items-start md:flex-row md:items-center md:justify-between">
                      <Label className="text-gray-700 font-medium text-lg">What should buyers provide? *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addBuyerRequirement} className="h-10">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Requirement
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {buyerRequirements.map((requirement) => (
                        <div key={requirement.id} className="flex items-center gap-4">
                          <Checkbox
                            checked={requirement.checked}
                            onCheckedChange={(checked) => {
                              setBuyerRequirements((prev) =>
                                prev.map((req) => (req.id === requirement.id ? { ...req, checked } : req)),
                              )
                            }}
                            className="h-5 w-5"
                          />
                          <Input
                            value={requirement.text}
                            onChange={(e) => updateBuyerRequirement(requirement.id, e.target.value)}
                            placeholder="Enter requirement..."
                            className={cn(
                              "flex-1 h-12 text-base border-gray-200",
                              formErrors.buyerRequirements && "border-red-500",
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBuyerRequirement(requirement.id)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {formErrors.buyerRequirements && (
                      <p className="text-red-500 text-sm">{formErrors.buyerRequirements}</p>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-700 font-medium text-lg">Questions for Buyers *</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addBuyerQuestion} className="h-10">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {buyerQuestions.map((question, index) => (
                        <div key={question.id} className="flex items-start gap-4">
                          <span className="text-base text-gray-500 mt-3 min-w-[24px] font-medium">{index + 1}.</span>
                          <Input
                            value={question.question}
                            onChange={(e) => updateBuyerQuestion(question.id, e.target.value)}
                            placeholder="Enter your question..."
                            className={cn(
                              "flex-1 h-12 text-base border-gray-200",
                              formErrors.buyerQuestions && "border-red-500",
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBuyerQuestion(question.id)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {formErrors.buyerQuestions && <p className="text-red-500 text-sm">{formErrors.buyerQuestions}</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              className="text-gray-600 h-12 px-6 text-base"
              onClick={handleBack}
              disabled={isFirstStep}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 h-12 text-base font-medium"
            >
              {isLastStep ? "Complete" : "Save & Next"}
            </Button>
          </div>

          {/* Hidden inputs for form submission */}
          <input type="hidden" name="tags" value={JSON.stringify(tags)} />
          <input type="hidden" name="portfolioFiles" value={JSON.stringify(portfolioFiles.map((f) => f.name))} />
          <input type="hidden" name="buyerRequirements" value={JSON.stringify(buyerRequirements)} />
          <input type="hidden" name="buyerQuestions" value={JSON.stringify(buyerQuestions)} />
          <input type="hidden" name="addOns" value={JSON.stringify(addOns)} />
        </form>
      </div>
    </div>
  )
}
