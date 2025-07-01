"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ResponsiveButton from "./responsive-button"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Trash2 } from "lucide-react"
import BackButton from "./BackBtn"
import { useEffect } from "react"


export default function ProfessionalDetails({ formData, updateFormData }) {
  const [localData, setLocalData] = useState({
    occupation: formData.occupation || "",
    skills: formData.skills || [],
    education: formData.education || "",
    certifications: formData.certifications || [],
    website: formData.website || "",
  })

  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState("")
  const router = useRouter()
  const blankEducation = {
  school: "",
  degree: "",
  field: "",
  from: "",
  to: "",
  description: ""
}

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value }
    setLocalData(newData)
    updateFormData(newData)
  }

  const addSkill = () => {
    if (newSkill.trim() && !localData.skills.includes(newSkill.trim())) {
      handleChange("skills", [...localData.skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skill) => {
    handleChange("skills", localData.skills.filter(s => s !== skill))
  }

  const addCertification = () => {
    if (newCertification.trim() && !localData.certifications.includes(newCertification.trim())) {
      handleChange("certifications", [...localData.certifications, newCertification.trim()])
      setNewCertification("")
    }
  }

  const removeCertification = (cert) => {
    handleChange("certifications", localData.certifications.filter(c => c !== cert))
  }
const updateEducationField = (index, field, value) => {
  const updated = [...(localData.education || [])]
  updated[index][field] = value
  handleChange("education", updated)
}

// this is for fetching the already present data
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const res = await axios.get("/api/user/professional_info", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.data.success) {
        const data = res.data.user;

        const newData = {
          occupation: data.occupation || "",
          skills: data.skills || [],
          education: data.education || [],
          certifications: data.certifications || [],
          website: data.website || "",
        };

        setLocalData(newData);
        updateFormData(newData);
      } else {
        console.error("Failed to fetch professional info:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching professional info:", error);
    }
  };

  fetchData();
}, []);


// function for  submiiting the data 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token =sessionStorage.getItem("accessToken");
    console.log("in the handleSubmit function")

    try {
      console.log(localData  , " local data to be send from the frontend")
      const res = await axios.patch("/api/user/professional_info", localData, {
        headers: { "Content-Type": "application/json",
          "Authorization":`Bearer ${token}`
         },
      })

      if (res.status !== 200) {
        toast.error("Failed to update professional info")
        return
      }

      toast.success("Professional info updated successfully")
      router.push("/seller_form/fill/account_security")
    } catch (error) {
      console.error(error )
      console.log("error is coming still" , error.message);
      toast.error("Something went wrong. Please try again later.")
    }
  }



  return (
    <div className="lg:px-12 ">
      {/* Header section */}
      <div className="mb-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-700 mb-4">Professional Info</h1>
            <p className="text-gray-600 max-w-2xl leading-relaxed">
              Share your professional background, skills, and qualifications to showcase your expertise to potential
              customers.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 italic">* Mandatory fields</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Occupation */}
        <div className="space-y-3">
          <label className="text-md font-medium text-gray-700">Your Occupation*</label>
          <Input
            type="text"
            placeholder="e.g., Software Developer, Graphic Designer, Marketing Consultant"
            value={localData.occupation}
            onChange={(e) => handleChange("occupation", e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
          <p className="text-sm text-gray-500">What is your current job title or profession?</p>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <label className="text-md font-medium text-gray-700">Skills*</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add a skill (e.g., React, Python, Design)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              className="flex-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <Button
              type="button"
              onClick={addSkill}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {localData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {localData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500">Add your key skills and areas of expertise.</p>
        </div>

        {/* Education */}
        {/* Education Section (Enhanced) */}
<div className="space-y-3">
  <label className="text-md font-medium text-gray-700">Education*</label>

  {localData.education?.length > 0 ? (
    localData.education.map((edu, index) => (
      <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50 space-y-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-700">Education #{index + 1}</h3>
          <button
            type="button"
            onClick={() => {
              const updated = [...localData.education]
              updated.splice(index, 1)
              handleChange("education", updated)
            }}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="School/University"
            value={edu.school}
            onChange={(e) => updateEducationField(index, "school", e.target.value)}
            required
          />
          <Input
            placeholder="Degree (e.g. B.Tech, B.Sc)"
            value={edu.degree}
            onChange={(e) => updateEducationField(index, "degree", e.target.value)}
            required
          />
          <Input
            placeholder="Field of Study (e.g. Computer Science)"
            value={edu.field}
            onChange={(e) => updateEducationField(index, "field", e.target.value)}
          />
          <Input
            type="date"
            value={edu.from}
            onChange={(e) => updateEducationField(index, "from", e.target.value)}
            required
          />
          <Input
            type="date"
            value={edu.to}
            onChange={(e) => updateEducationField(index, "to", e.target.value)}
          />
        </div>

        <Textarea
          placeholder="Add a short description (optional)"
          value={edu.description}
          onChange={(e) => updateEducationField(index, "description", e.target.value)}
          rows={3}
        />
      </div>
    ))
  ) : (
    <p className="text-sm italic text-gray-500">No education details added yet.</p>
  )}

  <Button
    type="button"
    onClick={() => handleChange("education", [...(localData.education || []), { ...blankEducation }])}
    className=""
    variant="outline"
  >
    + Add Education
  </Button>

  <p className="text-sm text-gray-500 mt-2">
    Add your degrees and education background. You can include multiple entries.
  </p>
</div>
        

        {/* Certifications */}
        <div className="space-y-3">
          <label className="text-md font-medium text-gray-700">Certifications</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add a certification (e.g., AWS Certified Solutions Architect)"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
              className="flex-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <Button
              type="button"
              onClick={addCertification}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {localData.certifications.length > 0 && (
            <div className="space-y-2 mt-4">
              {localData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span className="text-sm text-gray-900">{cert}</span>
                  <button
                    type="button"
                    onClick={() => removeCertification(cert)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500">
            Add any professional certifications, licenses, or credentials you hold.
          </p>
        </div>

        {/* Personal Website */}
        <div className="space-y-3">
          <label className="text-md font-medium text-gray-700">Personal Website</label>
          <Input
            type="url"
            placeholder="https://yourportfolio.com"
            value={localData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
          <p className="text-sm text-gray-500">
            Add your portfolio, LinkedIn profile, or personal website URL to showcase your work.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          {/* <Button
            type="button"
            onClick={()=>{router.back()}}
            variant="outline"
            className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg"
          >
            Previous
          </Button> */}
          <BackButton/>
          <ResponsiveButton
            type="submit"
            variant="gradient"
            className="px-4"
          >
            Continue
          </ResponsiveButton>
        </div>
      </form>
    </div>
  )
}
