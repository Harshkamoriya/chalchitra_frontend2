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
import { Upload, X, Plus, Video, Clock, Star, Zap, Palette, Settings, TrendingUp, Info } from "lucide-react"
import { HoverTooltip } from "@/components/hover-tooltip"
import { TagAutocomplete } from "@/components/tag-autocomplete"
import { ProgressTabs } from "@/components/progress-tabs"
import { createGig } from "./action"
import { FileImage } from "lucide-react";
import { useRouter } from "next/navigation"

import { saveGigSection } from "@/lib/api/savedGigSection"

import { toast } from "react-toastify"
import axios from "axios"
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
  const [uploadedUrls, setUploadedUrls] = useState({
  coverImageUrl: '',
  galleryUrls: [],
  videoUrl: ''
});

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
  const [gigId, setGigId] = useState(null)
const [coverFile, setCoverFile] = useState(null);
const [galleryFiles, setGalleryFiles] = useState([]);
const [videoFile, setVideoFile] = useState(null);
const router = useRouter();

const handleCoverChange = (e) => {
  setCoverFile(e.target.files[0]);
};

const handleGalleryChange = (e) => {
  setGalleryFiles(Array.from(e.target.files));
};

const handleVideoChange = (e) => {
  setVideoFile(e.target.files[0]);
};

const handleCoverUpload = async (file) => {
  if (!file) return toast.error("Please select a cover image first.");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_gigs");
  formData.append("folder", "gigs");

  try {
    const toastId = toast.loading("Uploading cover image...");
    const res = await fetch("https://api.cloudinary.com/v1_1/dwqduwu63/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast.dismiss(toastId);
      return toast.error("Cover upload failed: " + (errorData.error?.message || "Unknown error"));
    }

    const data = await res.json();
    console.log("Cover uploaded:", data.secure_url);
    setUploadedUrls((prev) => ({ ...prev, coverImageUrl: data.secure_url }));
    toast.dismiss(toastId);
    toast.success("Cover image uploaded!");
  } catch (error) {
    console.error(error);
    toast.dismiss();
    toast.error("Cover upload failed");
  }
};


const handleGalleryUpload = async (files) => {
  if (!files.length) return toast.error("Please select gallery images first.");
  const urls = [];

  const toastId = toast.loading("Uploading gallery images...");
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_gigs");
      formData.append("folder", "gigs");
      
      const res = await fetch("https://api.cloudinary.com/v1_1/dwqduwu63/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Gallery image upload failed:", errorData);
        continue; // skip failed image
      }

      const data = await res.json();
      urls.push(data.secure_url);
    }
    setUploadedUrls((prev) => ({ ...prev, galleryUrls: urls }));
    console.log("Gallery uploaded:", urls);
    toast.dismiss(toastId);
    toast.success("Gallery images uploaded!");
  } catch (error) {
    console.error(error);
    toast.dismiss(toastId);
    toast.error("Gallery upload failed");
  }
};

const handleVideoUpload = async (file) => {
  if (!file) return toast.error("Please select a video first.");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_gigs");
  formData.append("folder", "gigs/videos");

  try {
    toast.loading("Uploading video...");

    const res = await fetch("https://api.cloudinary.com/v1_1/dwqduwu63/video/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Video upload failed:", errorData);
      toast.dismiss();
      return toast.error("Video upload failed: " + (errorData.error?.message || "Unknown error"));
    }

    const data = await res.json();
    console.log("Video uploaded:", data.secure_url);

    setUploadedUrls((prev) => ({ ...prev, videoUrl: data.secure_url }));
    toast.dismiss();
    toast.success("Video uploaded successfully!");

  } catch (error) {
    console.error("Video upload error:", error);
    toast.dismiss();
    toast.error("Video upload failed");
  }
};







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
        setUploadedUrls(parsedData.uploadedUrls || { coverImageUrl: '', galleryUrls: [], videoUrl: '' });  // ✅ add this line

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
      uploadedUrls
    }
    localStorage.setItem("gigFormData", JSON.stringify(dataToSave))
  }, [formData, tags, portfolioFiles, buyerRequirements, buyerQuestions, addOns, completedSections, uploadedUrls])

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

// handle submit function to mark the gig as published

const handleSubmit = async()=>{
  try {
    const token = sessionStorage.getItem("accessToken");
    const sectionData = {
      status:"published"
    }
     const updatedgig  = await saveGigSection(gigId , sectionData  , token);
     if(!updatedgig){
      console.log("⚠️ Gig status  not updated successfully", updatedgig)
     }
     toast.success("Your gig has been published successfully!")
     router.push("/seller/manage/gigs") // Redirect to manage gigs
  } catch (error) {
    console.error("Error publishing gig:", error)
  }
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

  const handleNext = async () => {
    // Validate current section
    const validateFn = getValidationForTab(currentTab)
    const errors = validateFn()

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)

      // Show Toaster with error message
   
toast.error("Please fix the errors: Some required fields need your attention")

      return ;
    }

    // Clear errors
    setFormErrors({})

      let sectionData = {}

  switch (currentTab) {
    case "basic-info":
      sectionData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        tags,
      }
      break
    case "service-details":
      sectionData = {
        maxDuration: formData.maxDuration,
      }
      break
    case "pricing":
      sectionData = {
        packages: [
          {
            name: "Basic",
            price: formData.basicPrice,
            deliveryTime: formData.basicDeliveryTime,
            revisions: formData.basicRevisions,
            features: formData.basicFeatures,
            rushDelivery: formData.basicRushDelivery,
            rushTime: formData.basicRushTime,
            rushPrice: formData.basicRushPrice,
            inputLength: formData.basicInputLength,
            outputLength: formData.basicOutputLength,
          },
          {
            name: "Standard",
            price: formData.standardPrice,
            deliveryTime: formData.standardDeliveryTime,
            revisions: formData.standardRevisions,
            features: formData.standardFeatures,
            rushDelivery: formData.standardRushDelivery,
            rushTime: formData.standardRushTime,
            rushPrice: formData.standardRushPrice,
            inputLength: formData.standardInputLength,
            outputLength: formData.standardOutputLength,
          },
          {
            name: "Premium",
            price: formData.premiumPrice,
            deliveryTime: formData.premiumDeliveryTime,
            revisions: formData.premiumRevisions,
            features: formData.premiumFeatures,
            rushDelivery: formData.premiumRushDelivery,
            rushTime: formData.premiumRushTime,
            rushPrice: formData.premiumRushPrice,
            inputLength: formData.premiumInputLength,
            outputLength: formData.premiumOutputLength,
          },
        ],
        addOns,
      }
      break
    case "portfolio":
      sectionData = {
  media: {
    
    coverImage: uploadedUrls.coverImageUrl || "",
    gallery: uploadedUrls.galleryUrls || [],
    video: uploadedUrls.videoUrl || "",
  },
  portfolioDescription: formData.portfolioDescription,
  portfolioWebsite: formData.portfolioWebsite,
}
      break
    case "requirements":
      sectionData = {
        requirements: buyerRequirements.map((req) => ({
          question: req.text,
          type: "text",
          required: req.checked,
        })),
        faq: buyerQuestions.map((q) => ({
          question: q.question,
          answer: "",
        })),
        addOns,
        
      }
      break
  }

  try {
    const token = sessionStorage.getItem("accessToken")
    const updatedGig = await saveGigSection(gigId, sectionData, token)
    if (!updatedGig) {
    console.log("⚠️ Gig is not created successfully", updatedGig)
  }

    // Store returned gigId (on first creation)
    if (!gigId) setGigId(updatedGig._id)

    // Mark section complete
    if (!completedSections.includes(currentTab)) {
      setCompletedSections((prev) => [...prev, currentTab])
    }

    if (isLastStep) {
      console.log("Final step reached, submitting...")
       handleSubmit()
       // Redirect to manage gigs
      // // optional
    } else {
      const currentIndex = sections.indexOf(currentTab)
      setCurrentTab(sections[currentIndex + 1])
    }
  } catch (err) {
    console.error("Error saving gig:", err)
    toast.error(`Save Failed: ${err.message}`)

  }

    // Mark current section as completed if not already
    if (!completedSections.includes(currentTab)) {
      setCompletedSections((prev) => [...prev, currentTab])
    }

    // if the current tab is the last tab and all the tabs are fullfilled 
    if(isLastStep){
        console.log("at last step or last tab")
       
        router.push("/seller/manage/gigs")
        
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
    "Music Video Editing",

"Wedding/Event Editing",

"Commercial/Ad Editing",

"YouTube/Vlog Editing",

"Gaming Editing",

"Podcast Editing",

"Short-form (Reels, Shorts)",

"Faceless YouTube Channel Editing",

"Corporate/Educational Editing",
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
      <div className="container mx-auto px-6 py-8 max-w-7xl">
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
            />

            {/* Basic Info Tab */}
            <TabsContent value="basic-info" className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-3xl font-semibold">
                    <Video className="h-8 w-8 text-blue-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-lg mt-3 text-gray-600">
                    Tell us about your video editing service
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <Label className="text-gray-800 font-semibold text-xl block">Gig Title *</Label>
                        <p className="text-gray-600 text-sm mb-4">
                          Create a title that clearly describes what you offer. Include your main service and target audience.
                        </p>
                        <HoverTooltip content={tooltips.title}>
                          <Input
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="I will edit your YouTube videos professionally with cinematic effects"
                            className={cn(
                              "h-14 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg",
                              formErrors.title && "border-red-500",
                            )}
                            required
                          />
                        </HoverTooltip>
                        {formErrors.title && <p className="text-red-500 text-sm mt-2">{formErrors.title}</p>}
                        <div className="flex justify-between mt-3">
                          <span className="text-sm text-gray-500 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Make it specific and compelling
                          </span>
                          <span className="text-sm text-gray-400 font-medium">{formData.title.length}/80</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-gray-800 font-semibold text-xl block">Video Category *</Label>
                        <p className="text-gray-600 text-sm mb-4">
                          Choose the category that best represents your video editing specialty.
                        </p>
                        <HoverTooltip
                          content={{
                            title: "Choose Your Specialty",
                            description: "Select the category that best matches your expertise.",
                            examples: ["YouTube Videos for content creators", "Wedding Videos for couples"],
                          }}
                        >
                          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                            <SelectTrigger
                              className={cn(
                                "h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
                                formErrors.category && "border-red-500"
                              )}
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
                        {formErrors.category && <p className="text-red-500 text-sm mt-2">{formErrors.category}</p>}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <Label className="text-gray-800 font-semibold text-xl block">Search Tags *</Label>
                        <p className="text-gray-600 text-sm mb-4">
                          Add keywords that buyers would use to find your service. Use terms related to your style, platform, and content type.
                        </p>
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
                              className={cn(
                                "h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
                                formErrors.tags && "border-red-500"
                              )}
                            />
                          </div>
                        </HoverTooltip>
                        {formErrors.tags && <p className="text-red-500 text-sm mt-2">{formErrors.tags}</p>}

                        <div className="flex flex-wrap gap-3 mt-6">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 text-base font-medium rounded-full"
                            >
                              {tag}
                              <X className="h-4 w-4 cursor-pointer hover:text-blue-900" onClick={() => removeTag(tag)} />
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                          <span className="font-medium">{tags.length}/5 tags</span>
                          <span>•</span>
                          <span>Tags help buyers find your gig</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Width Description */}
                  <div className="mt-12 space-y-4">
                    <Label className="text-gray-800 font-semibold text-xl block">Service Description *</Label>
                    <p className="text-gray-600 text-sm mb-4">
                      Describe your experience, process, and what makes you unique. Include your years of experience, software expertise, and editing style.
                    </p>
                    <HoverTooltip content={tooltips.description}>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="I'm a professional video editor with 5+ years of experience specializing in YouTube content. I use Adobe Premiere Pro and After Effects to create engaging videos with smooth transitions, color grading, and motion graphics. My editing style focuses on keeping viewers engaged while maintaining professional quality..."
                        className={cn(
                          "min-h-[200px] text-lg leading-relaxed border-2 border-gray-200 focus:border-blue-500 resize-none rounded-lg p-4",
                          formErrors.description && "border-red-500",
                        )}
                        required
                      />
                    </HoverTooltip>
                    {formErrors.description && <p className="text-red-500 text-sm mt-2">{formErrors.description}</p>}
                    <div className="flex justify-between mt-3">
                      <span className="text-sm text-gray-500 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Describe your experience and unique approach
                      </span>
                      <span className="text-sm text-gray-400 font-medium">{formData.description.length}/1200</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Service Details Tab */}
            <TabsContent value="service-details" className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-3xl font-semibold">
                    <Settings className="h-8 w-8 text-purple-600" />
                    Service Specifications
                  </CardTitle>
                  <CardDescription className="text-lg mt-3 text-gray-600">
                    Define what your service includes and your capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="space-y-10">
                      <div className="space-y-4">
                        <Label className="text-gray-800 font-semibold text-xl block">Maximum Video Duration (minutes) *</Label>
                        <p className="text-gray-600 text-sm mb-4">
                          Set realistic limits based on your capacity and pricing structure.
                        </p>
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
                            className={cn(
                              "h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
                              formErrors.maxDuration && "border-red-500"
                            )}
                            min="1"
                            max="300"
                            required
                          />
                        </HoverTooltip>
                        {formErrors.maxDuration && <p className="text-red-500 text-sm mt-2">{formErrors.maxDuration}</p>}
                      </div>

                      <div className="space-y-6">
                        <Label className="text-gray-800 font-semibold text-xl block">Editing Styles You Offer</Label>
                        <div className="grid grid-cols-2 gap-6">
                          {["Cinematic", "Fast-paced", "Minimalist", "Vintage", "Modern", "Dramatic"].map((style) => (
                            <div key={style} className="flex items-center space-x-4">
                              <Checkbox id={style} name="editingStyles" value={style} className="h-6 w-6" />
                              <Label htmlFor={style} className="text-lg text-gray-700 font-medium">
                                {style}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <Label className="text-gray-800 font-semibold text-xl block">Supported Resolutions</Label>
                        <div className="grid grid-cols-2 gap-6">
                          {["720p HD", "1080p Full HD", "4K Ultra HD", "8K"].map((resolution) => (
                            <div key={resolution} className="flex items-center space-x-4">
                              <Checkbox id={resolution} name="resolutions" value={resolution} className="h-6 w-6" />
                              <Label htmlFor={resolution} className="text-lg text-gray-700 font-medium">
                                {resolution}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-3xl font-semibold">
                    <Star className="h-8 w-8 text-emerald-600" />
                    Pricing Packages
                  </CardTitle>
                  <CardDescription className="text-lg mt-3 text-gray-600">
                    Create different tiers for your service with competitive pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {["basic", "standard", "premium"].map((tier, index) => (
                      <Card key={tier} className={`${index === 1 ? "border-blue-500 shadow-lg scale-105" : "border-gray-200"}`}>
                        <CardHeader className="pb-6">
                          <CardTitle className="capitalize flex items-center gap-3 text-gray-800 text-2xl font-semibold">
                            {tier}
                            {index === 1 && <Badge className="bg-blue-100 text-blue-700 text-sm">Most Popular</Badge>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          <div className="space-y-4">
                            <Label className="text-gray-800 font-semibold text-lg block">Price ($) *</Label>
                            <HoverTooltip content={tooltips.pricing}>
                              <Input
                                name={`${tier}Price`}
                                type="number"
                                value={formData[`${tier}Price`]}
                                onChange={(e) => handleInputChange(`${tier}Price`, e.target.value)}
                                placeholder={tier === "basic" ? "25" : tier === "standard" ? "75" : "150"}
                                className={cn(
                                  "h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
                                  formErrors[`${tier}Price`] && "border-red-500",
                                )}
                                min="5"
                                max="10000"
                                required={tier === "basic"}
                              />
                            </HoverTooltip>
                            {formErrors[`${tier}Price`] && tier === "basic" && (
                              <p className="text-red-500 text-sm mt-2">{formErrors[`${tier}Price`]}</p>
                            )}
                          </div>

                          <div className="space-y-4">
                            <Label className="text-gray-800 font-semibold text-lg block">Delivery Time *</Label>
                            <Select
                              value={formData[`${tier}DeliveryTime`]}
                              onValueChange={(value) => handleInputChange(`${tier}DeliveryTime`, value)}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
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
                              <p className="text-red-500 text-sm mt-2">{formErrors[`${tier}DeliveryTime`]}</p>
                            )}
                          </div>

                          <div className="space-y-4">
                            <Label className="text-gray-800 font-semibold text-lg block">Revisions *</Label>
                            <Select
                              value={formData[`${tier}Revisions`]}
                              onValueChange={(value) => handleInputChange(`${tier}Revisions`, value)}
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
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
                              <p className="text-red-500 text-sm mt-2">{formErrors[`${tier}Revisions`]}</p>
                            )}
                          </div>

                          {/* Output and Input Length */}
                          <div className="space-y-4">
                            <Label className="text-gray-800 font-semibold text-lg block">Output Length (minutes)</Label>
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
                                className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                min="1"
                                max="180"
                              />
                            </HoverTooltip>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-gray-800 font-semibold text-lg block">Max Input Footage (minutes)</Label>
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
                                className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                                min="5"
                                max="600"
                              />
                            </HoverTooltip>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-gray-800 font-semibold text-lg block">What's Included</Label>
                            <div className="grid grid-cols-1 gap-4 max-h-60 overflow-y-auto border-2 border-gray-200 rounded-lg p-4">
                              {packageFeatures.map((feature) => (
                                <div key={feature.id} className="flex items-center space-x-4">
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
                                    className="h-6 w-6"
                                  />
                                  <Label htmlFor={`${tier}-${feature.id}`} className="text-base text-gray-700 font-medium">
                                    {feature.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Rush Delivery */}
                          <div className="border-t pt-6">
                            <div className="flex items-center space-x-4 mb-4">
                              <Checkbox
                                id={`${tier}-rush`}
                                checked={formData[`${tier}RushDelivery`]}
                                onCheckedChange={(checked) => handleInputChange(`${tier}RushDelivery`, checked)}
                                className="h-6 w-6"
                              />
                              <Label
                                htmlFor={`${tier}-rush`}
                                className="text-lg flex items-center gap-2 text-gray-700 font-medium"
                              >
                                <Zap className="h-5 w-5 text-yellow-500" />
                                Rush Delivery Available
                              </Label>
                            </div>

                            {formData[`${tier}RushDelivery`] && (
                              <div className="space-y-6 ml-10">
                                <div className="space-y-3">
                                  <Label className="text-base text-gray-700 font-semibold">Rush Delivery Time</Label>
                                  <Select
                                    value={formData[`${tier}RushTime`]}
                                    onValueChange={(value) => handleInputChange(`${tier}RushTime`, value)}
                                  >
                                    <SelectTrigger className="h-10 text-base border-gray-200 rounded-lg">
                                      <SelectValue placeholder="Select rush time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="12-hours">12 Hours</SelectItem>
                                      <SelectItem value="24-hours">24 Hours</SelectItem>
                                      <SelectItem value="48-hours">48 Hours</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-3">
                                  <Label className="text-base text-gray-700 font-semibold">Additional Price ($)</Label>
                                  <Input
                                    type="number"
                                    value={formData[`${tier}RushPrice`]}
                                    onChange={(e) => handleInputChange(`${tier}RushPrice`, e.target.value)}
                                    placeholder="25"
                                    className="h-10 text-base border-gray-200 rounded-lg"
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
                  <Card className="border-2 border-gray-200">
                    <CardHeader className="p-8">
                      <CardTitle className="text-2xl font-semibold text-gray-800">Add-ons (Extra Services)</CardTitle>
                      <CardDescription className="text-lg mt-2 text-gray-600">
                        Offer additional services for extra charges to increase your earnings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {addOnServices.map((service) => {
                          const isSelected = addOns.some((addon) => addon.id === service.id)
                          const addon = addOns.find((addon) => addon.id === service.id)

                          return (
                            <div key={service.id} className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <Checkbox
                                  id={service.id}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleAddOn(service.id)}
                                  className="h-6 w-6"
                                />
                                <Label htmlFor={service.id} className="text-lg text-gray-700 font-medium">
                                  {service.label}
                                </Label>
                              </div>

                              {isSelected && (
                                <div className="ml-10 grid grid-cols-2 gap-4">
                                  <div className="space-y-3">
                                    <Label className="text-base text-gray-700 font-semibold">Price ($)</Label>
                                    <Input
                                      type="number"
                                      value={addon?.price || ""}
                                      onChange={(e) => updateAddOn(service.id, "price", e.target.value)}
                                      placeholder="15"
                                      className="h-10 text-base border-gray-200 rounded-lg"
                                      min="5"
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <Label className="text-base text-gray-700 font-semibold">Extra Time</Label>
                                    <Select
                                      value={addon?.deliveryTime || ""}
                                      onValueChange={(value) => updateAddOn(service.id, "deliveryTime", value)}
                                    >
                                      <SelectTrigger className="h-10 text-base border-gray-200 rounded-lg">
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
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-3xl font-semibold">
                    <Palette className="h-8 w-8 text-pink-600" />
                    Portfolio & Samples
                  </CardTitle>
                  <CardDescription className="text-lg mt-3 text-gray-600">
                    Show your best work to attract clients and build trust
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                   <div className="space-y-6">
  <Label className="text-gray-800 font-semibold text-xl block">Upload Files</Label>
  <p className="text-gray-600 text-base">
    Please upload your cover image, gallery images, and a video sample. 
    <span className="text-red-500 font-semibold ml-1">
      You must hit the upload button before proceeding further.
    </span>
  </p>

  {/* Cover Image */}
  <div
    className={cn(
      "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors",
      formErrors.coverImage && "border-red-500",
    )}
  >
    <Label htmlFor="cover-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-semibold">
      Click to upload Cover Image
    </Label>
    <Input
      id="cover-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleCoverChange}
    />
    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
  </div>
  {coverFile && (
    <div className="flex items-center gap-4 border border-gray-200 rounded p-3">
      <FileImage className="h-6 w-6 text-gray-400" />
      <span className="text-gray-700">{coverFile.name}</span>
    </div>
  )}
  {formErrors.coverImage && <p className="text-red-500 text-sm">{formErrors.coverImage}</p>}

  {/* Gallery Images */}
  <div
    className={cn(
      "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors",
      formErrors.gallery && "border-red-500",
    )}
  >
    <Label htmlFor="gallery-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-semibold">
      Click to upload Gallery Images
    </Label>
    <Input
      id="gallery-upload"
      type="file"
      accept="image/*"
      multiple
      className="hidden"
      onChange={handleGalleryChange}
    />
    <p className="text-sm text-gray-500 mt-2">Upload multiple images, up to 10MB each</p>
  </div>
  {galleryFiles.length > 0 && (
    <div className="flex flex-wrap gap-3 mt-2">
      {galleryFiles.map((file, idx) => (
        <div key={idx} className="flex items-center gap-2 border border-gray-200 rounded p-2">
          <FileImage className="h-6 w-6 text-gray-400" />
          <span className="text-gray-700 text-sm">{file.name}</span>
        </div>
      ))}
    </div>
  )}
  {formErrors.gallery && <p className="text-red-500 text-sm">{formErrors.gallery}</p>}

  {/* Video Sample */}
  <div
    className={cn(
      "border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors",
      formErrors.video && "border-red-500",
    )}
  >
    <Label htmlFor="video-upload" className="cursor-pointer text-blue-600 hover:text-blue-500 font-semibold">
      Click to upload Video Sample
    </Label>
    <Input
      id="video-upload"
      type="file"
      accept="video/*"
      className="hidden"
      onChange={handleVideoChange}
    />
    <p className="text-sm text-gray-500 mt-2">MP4, MOV up to 100MB</p>
  </div>
  {videoFile && (
    <div className="flex items-center gap-4 border border-gray-200 rounded p-3">
      <Video className="h-8 w-8 text-gray-400" />
      <span className="text-gray-700">{videoFile.name}</span>
    </div>
  )}
  {formErrors.video && <p className="text-red-500 text-sm">{formErrors.video}</p>}

  {/* Upload Button */}
  {/* Upload Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-end mt-4">
  <Button
    type="button"
    onClick={() => handleCoverUpload(coverFile)}
    className="bg-blue-600 hover:bg-blue-500 text-white text-base px-5 py-2 rounded-lg"
  >
    Upload Cover Image
  </Button>

  <Button
    type="button"
    onClick={() => handleGalleryUpload(galleryFiles)}
    className="bg-green-600 hover:bg-green-500 text-white text-base px-5 py-2 rounded-lg"
  >
    Upload Gallery Images
  </Button>

  <Button
    type="button"
    onClick={() => handleVideoUpload(videoFile)}
    className="bg-purple-600 hover:bg-purple-500 text-white text-base px-5 py-2 rounded-lg"
  >
    Upload Video Sample
  </Button>
</div>

</div>


                    {/* Right Column */}
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <Label className="text-gray-800 font-semibold text-xl block">Portfolio Website (Optional)</Label>
                        <p className="text-gray-600 text-base">
                          Add a link to your portfolio website, YouTube channel, or Vimeo profile to showcase more work.
                        </p>
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
                            className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                          />
                        </HoverTooltip>
                      </div>

                      <div className="space-y-6">
                        <Label className="text-gray-800 font-semibold text-xl block">Portfolio Description</Label>
                        <p className="text-gray-600 text-base">
                          Describe your editing approach, experience, and what makes your work unique.
                        </p>
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
                            className="min-h-[180px] text-lg leading-relaxed border-2 border-gray-200 focus:border-blue-500 resize-none rounded-lg p-4"
                            rows={6}
                          />
                        </HoverTooltip>
                        <div className="flex justify-end mt-3">
                          <span className="text-sm text-gray-400 font-medium">{formData.portfolioDescription.length}/500</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          



            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg p-8">
                  <CardTitle className="flex items-center gap-3 text-gray-800 text-3xl font-semibold">
                    <Clock className="h-8 w-8 text-orange-600" />
                    Buyer Requirements
                  </CardTitle>
                  <CardDescription className="text-lg mt-3 text-gray-600">
                    Define what you need from buyers to get started with their project
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Requirements */}
                    <div className="space-y-8">
                      <div className="flex flex-col gap-6 justify-start items-start">
                        <div>
                          <Label className="text-gray-800 font-semibold text-xl block mb-2">What should buyers provide? *</Label>
                          <p className="text-gray-600 text-base">
                            List all the materials and information you need from buyers to complete their project.
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="lg" onClick={addBuyerRequirement} className="h-12 px-6">
                          <Plus className="h-5 w-5 mr-2" />
                          Add Requirement
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {buyerRequirements.map((requirement) => (
                          <div key={requirement.id} className="flex items-start gap-4">
                            <Checkbox
                              checked={requirement.checked}
                              onCheckedChange={(checked) => {
                                setBuyerRequirements((prev) =>
                                  prev.map((req) => (req.id === requirement.id ? { ...req, checked } : req)),
                                )
                              }}
                              className="h-6 w-6 mt-3"
                            />
                            <div className="flex-1">
                              <Input
                                value={requirement.text}
                                onChange={(e) => updateBuyerRequirement(requirement.id, e.target.value)}
                                placeholder="Enter requirement..."
                                className={cn(
                                  "h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
                                  formErrors.buyerRequirements && "border-red-500",
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBuyerRequirement(requirement.id)}
                              className="mt-2"
                            >
                              <X className="h-6 w-6" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {formErrors.buyerRequirements && (
                        <p className="text-red-500 text-sm">{formErrors.buyerRequirements}</p>
                      )}
                    </div>

                    {/* Right Column - Questions */}
                    <div className="space-y-8">
                      <div className="flex flex-col gap-6 justify-start items-start">
                        <div>
                          <Label className="text-gray-800 font-semibold text-xl block mb-2">Questions for Buyers *</Label>
                          <p className="text-gray-600 text-base">
                            Ask questions to better understand the buyer's needs and project requirements.
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="lg" onClick={addBuyerQuestion} className="h-12 px-6">
                          <Plus className="h-5 w-5 mr-2" />
                          Add Question
                        </Button>
                      </div>

                      <div className="space-y-6">
                        {buyerQuestions.map((question, index) => (
                          <div key={question.id} className="flex items-start gap-4">
                            <span className="text-lg text-gray-500 mt-4 min-w-[32px] font-semibold">{index + 1}.</span>
                            <div className="flex-1">
                              <Input
                                value={question.question}
                                onChange={(e) => updateBuyerQuestion(question.id, e.target.value)}
                                placeholder="Enter your question..."
                                className={cn(
                                  "h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg",
                                  formErrors.buyerQuestions && "border-red-500",
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeBuyerQuestion(question.id)}
                              className="mt-2"
                            >
                              <X className="h-6 w-6" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {formErrors.buyerQuestions && <p className="text-red-500 text-sm">{formErrors.buyerQuestions}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-10 border-t-2 border-gray-200 bg-white rounded-lg p-8">
            <Button
              type="button"
              variant="outline"
              className="text-gray-600 h-14 px-8 text-lg font-medium border-2"
              onClick={handleBack}
              disabled={isFirstStep}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 h-14 text-lg font-semibold shadow-lg"
            >
              {isLastStep ? "Complete Gig" : "Save & Continue"}
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