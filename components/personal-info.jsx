"use client"

import { useState } from "react"
import { useEffect } from "react"
import { Camera, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { ArrowRight } from "lucide-react"
import ResponsiveButton from "./responsive-button"


// Clean Personal Information component matching reference design
export default function PersonalInfo({ formData, updateFormData, onNext }) {
  const [localData, setLocalData] = useState({
    firstName: formData.firstName || "",
    lastName: formData.lastName || "",
    displayName: formData.displayName || "",
    profileImage:formData.profileImage ||"",
    description: formData.description || "",
    languages: formData.languages || [],
  })
  const [previewUrl, setPreviewUrl] = useState(
  formData.profileImage instanceof File
    ? URL.createObjectURL(formData.profileImage)
    : typeof formData.profileImage === "string"
    ? formData.profileImage
    : ""
);

  const [selectedLanguages, setSelectedLanguages] = useState(localData.languages)

  const availableLanguages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Bengali",
    "Urdu",
    "Turkish",
    "Dutch",
    "Swedish",
    "Norwegian",
  ]

  const router = useRouter();
// handle image upload 

  // Handle input changes
  const handleChange = (field, value) => {

      if (field === "profileImage") {
    setPreviewUrl(URL.createObjectURL(value)); // 🔍 sets preview
  }
    const newData = { ...localData, [field]: value }
    setLocalData(newData)
    updateFormData(newData)
  }

  // Handle language selection
  const toggleLanguage = (language) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((lang) => lang !== language)
      : [...selectedLanguages, language]

    setSelectedLanguages(newLanguages)
    handleChange("languages", newLanguages)
  }

  // function to prefill data
  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await axios.get("/api/user/personal", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const data = res.data.user;

        // Update localData and selectedLanguages
        const newData = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          displayName: data.displayName || "",
          profileImage: data.profileImage || "",
          description: data.description || "",
          languages: data.languages || [],
        };

        setLocalData(newData);
        setSelectedLanguages(newData.languages || []);

        if (newData.profileImage) {
          setPreviewUrl(newData.profileImage);
        }

        // Optional: update parent formData if needed
        updateFormData(newData);
      } else {
        console.error("Failed to fetch personal info:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  fetchData();
}, []);
  // Handle form submission
 const handleSubmit = async (e) => {
  const token = sessionStorage.getItem("accessToken")
  e.preventDefault();
  try {
    const api = "/api/user/personal";
    const res = await axios.patch(api, localData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (res.status !== 200) {
      toast.error("Failed to update personal info");
    } else {
      toast.success("Personal info updated successfully");

      router.push("/seller_form/fill/professional_info");
    }
  } catch (error) {
    console.log("Something went wrong:", error);
    toast.error("An error occurred while updating personal info");
  }
};


  return (
    <div className=" mx-auto lg:px-16 m-auto p-2 ">
      {/* Header section */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-700 mb-4">Personal Info</h1>
            <p className="text-gray-600 max-w-2xl leading-relaxed">
              Tell us a bit about yourself. This information will appear on your public profile, so that potential
              buyers can get to know you better.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 italic">* Mandatory fields</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Full Name */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <label className="text-md font-medium text-gray-700">Full Name*</label>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Private</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="First name"
              value={localData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <Input
              type="text"
              placeholder="Last name"
              value={localData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-3">
          <label className="text-md font-medium text-gray-700">Display Name*</label>
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="e.g., John D."
              value={localData.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              required
              className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <p className="text-sm text-gray-500">
            Your display name is how you'll appear to customers. We recommend using your first name and last initial.
          </p>
        </div>

        {/* Profile Picture */}
       <div className="space-y-3">
  <label className="text-md font-medium text-gray-700">Profile Picture</label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
    <div className="flex flex-col items-center">

      {/* Profile Picture Preview */}
      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border"
          />
        </div>
      )}

      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Camera className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Add a profile picture so customers know who they're working with
      </p>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="profileImage"
        onChange={(e) => handleChange("profileImage", e.target.files[0])}
      />
      <label
        htmlFor="profileImage"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
      >
        <Upload className="w-4 h-4 mr-2" />
        Choose File
      </label>
    </div>
  </div>
</div>


        {/* Description */}
        <div className="space-y-3">
          <label className="text-md font-medium text-gray-700">Description*</label>
          <Textarea
            placeholder="Tell us about yourself, your experience, and what makes you unique..."
            value={localData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            rows={5}
            className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
          />
          <p className="text-sm text-gray-500">
            Share your background, skills, and what potential customers should know about you.
          </p>
        </div>

        {/* Languages */}
        <div className="space-y-3">
          <label className="text-md font-medium text-gray-700">Languages*</label>
          <p className="text-sm text-gray-500 mb-4">
            Select which languages you can communicate in and your proficiency level.
          </p>
          <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableLanguages.map((language) => (
                <label key={language} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(language)}
                    onChange={() => toggleLanguage(language)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-md text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          </div>
          {selectedLanguages.length > 0 && (
            <div className="mt-3">
              <p className="text-md text-gray-600 mb-2">Selected languages:</p>
              <div className="flex flex-wrap gap-2">
                {selectedLanguages.map((language) => (
                  <span
                    key={language}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="flex flex-row justify-end pt-8 border-t border-gray-200">
          {/* <ResponsiveButton  type="submit" variant="gradient" size="lg" className="flex flex-row"   >
                    Continue
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
                  </ResponsiveButton> */}
                   <ResponsiveButton  variant="gradient" icon={<ArrowRight size={16} />} iconPosition="right">
                                Continue
                              </ResponsiveButton>
        </div>
      </form>
    </div>
  )
}
