"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Eye } from "lucide-react"
import { Target } from "lucide-react"
import { MessageSquare } from "lucide-react"
import { Plus } from "lucide-react"
import { Mail } from "lucide-react"
import { X } from "lucide-react"
import { Phone } from "lucide-react"
import {
  Edit,
  Camera,
  MapPin,
  Globe,
  Star,
  Calendar,
  Save,
  CheckCircle,
  Home,
  ChevronRight,
  Wand2,
  Award,
  GraduationCap,
} from "lucide-react"
import { useUserContext } from "@/app/(nav2)/context/UserContext"
import api from "@/lib/axios"

export default function SellerProfileEdit() {
  const { userData, userLoading, setUserData } = useUserContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const [modalValue, setModalValue] = useState("")
  const [modalLanguages, setModalLanguages] = useState([])
  const [modalEducation, setModalEducation] = useState({ school: "", degree: "", field: "", from: "", to: "" })
  const [modalCertifications, setModalCertifications] = useState({ name: "", issuer: "", date: "" })
  const [modalSkills, setModalSkills] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/user/me")
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    if (!userData && !userLoading) fetchUserData()
  }, [userData, userLoading, setUserData])

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Unknown"
  }

  const startEditing = (field, initialValue = "") => {
    setCurrentField(field)
    if (field === "languages") {
      setModalLanguages(userData.languages || [])
      setModalValue((userData.languages || []).join(", "))
    } else if (field === "education") {
      setModalEducation(userData.education?.[0] || { school: "", degree: "", field: "", from: "", to: "" })
    } else if (field === "certifications") {
      setModalCertifications(userData.certifications?.[0] || { name: "", issuer: "", date: "" })
    } else if (field === "skills") {
      setModalSkills((userData.skills || []).join(", "))
    } else {
      setModalValue(initialValue || userData[field] || "")
    }
    setIsModalOpen(true)
  }

  const saveChanges = async () => {
    try {
      let updateData = {}
      if (currentField === "languages") {
        updateData = { languages: modalLanguages }
      } else if (currentField === "education") {
        updateData = { education: [modalEducation] }
      } else if (currentField === "certifications") {
        updateData = { certifications: [modalCertifications] }
      } else if (currentField === "skills") {
        updateData = { skills: modalSkills.split(",").map((skill) => skill.trim()).filter(Boolean) }
      } else {
        updateData = { [currentField]: modalValue }
      }
      const res = await api.patch("/api/profile", updateData)
      if (res.data.success) {
        setUserData((prev) => ({ ...prev, ...res.data.user }))
      }
      setIsModalOpen(false)
      setCurrentField(null)
      setModalValue("")
      setModalLanguages([])
      setModalEducation({ school: "", degree: "", field: "", from: "", to: "" })
      setModalCertifications({ name: "", issuer: "", date: "" })
      setModalSkills("")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile")
    }
  }

  const cancelEditing = () => {
    setIsModalOpen(false)
    setCurrentField(null)
    setModalValue("")
    setModalLanguages([])
    setModalEducation({ school: "", degree: "", field: "", from: "", to: "" })
    setModalCertifications({ name: "", issuer: "", date: "" })
    setModalSkills("")
  }

  if (userLoading) {
    return <div className="container mx-auto px-4 py-6 max-w-7xl">Loading...</div>
  }

  if (!userData) {
    return <div className="container mx-auto px-4 py-6 max-w-7xl">Error loading data</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Home className="h-4 w-4" />
          <span>Home</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Edit Seller Profile</span>
        </div>

        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-blue-900 font-semibold">Edit your seller profile details.</p>
                <p className="text-blue-700 text-sm">
                  Return to buyer profile{" "}
                  <Link href="/my-profile">
                    <span className="underline hover:no-underline">here</span>
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-md">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative mb-5">
                    <Avatar className="h-28 w-28 mx-auto border-4 border-white shadow-lg">
                      <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.name} />
                      <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                        {userData.name?.split(" ").map((n) => n[0]).join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-2 rounded-full h-8 w-8 bg-white"
                      onClick={() => startEditing("image", userData.image || "")}
                    >
                      <Camera className="h-4 w-4 text-gray-700" />
                    </Button>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">{userData.displayName || userData.name}</h2>
                  <p className="text-gray-600 mb-3">@{userData.email?.split("@")[0]}</p>

                  <div className="space-y-3 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{userData.country || "Not specified"}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(userData.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>Rating: {userData.rating?.average || 0} ({userData.rating?.count || 0} reviews)</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="text-left">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-700">Languages</h3>
                      <Button variant="ghost" size="sm" onClick={() => startEditing("languages")}>
                        <Edit className="h-3 w-3 text-gray-600" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {(userData.languages || []).map((lang, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-3 w-3" />
                          <span>{lang}</span>
                        </div>
                      ))}
                      {!userData.languages?.length && <p className="text-gray-500">No languages added</p>}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <Button variant="outline" className="w-full text-gray-700 hover:bg-gray-100">
                    <Eye className="h-4 w-4 mr-2" /> Preview Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                <Wand2 className="h-8 w-8 text-yellow-600" /> Enhance Your Seller Profile
              </h1>
              <p className="text-gray-600 mt-2">Showcase your expertise and attract more clients by updating your details.</p>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Target className="h-5 w-5 text-green-600" /> Profile Progress
                </CardTitle>
                <CardDescription>Complete your profile to boost your visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Completion</span>
                    <span className="text-gray-600">{userData.profileCompleteness || 0}%</span>
                  </div>
                  <Progress value={userData.profileCompleteness || 0} className="h-2 bg-gray-200" />

                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Service Preferences</h4>
                          <p className="text-sm text-gray-600">Specify your service offerings.</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-full">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Communication Style</h4>
                          <p className="text-sm text-gray-600">Set your collaboration preferences.</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800">About Me</CardTitle>
                  <CardDescription className="text-gray-600">Share your professional story</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEditing("description", userData.description || "")}>
                  <Edit className="h-4 w-4 mr-2 text-gray-600" /> Edit
                </Button>
              </CardHeader>
              <CardContent>
                {userData.description ? (
                  <p className="text-gray-700 leading-relaxed">{userData.description}</p>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-3">Add a description to attract clients</p>
                    <Button variant="default" onClick={() => startEditing("description", "")}>
                      <Plus className="h-4 w-4 mr-2" /> Add Description
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800">Education</CardTitle>
                  <CardDescription className="text-gray-600">Highlight your academic background</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEditing("education")}>
                  <Edit className="h-4 w-4 mr-2 text-gray-600" /> Edit
                </Button>
              </CardHeader>
              <CardContent>
                {userData.education?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.education.map((edu, idx) => (
                      <div key={idx} className="border-l-2 border-gray-200 pl-4">
                        <h4 className="font-medium text-gray-800">{edu.degree} in {edu.field}</h4>
                        <p className="text-gray-600">{edu.school}</p>
                        <p className="text-sm text-gray-500">{formatDate(edu.from)} - {formatDate(edu.to)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-3">No education added</p>
                    <Button variant="default" onClick={() => startEditing("education")}>
                      <Plus className="h-4 w-4 mr-2" /> Add Education
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800">Certifications</CardTitle>
                  <CardDescription className="text-gray-600">Showcase your professional credentials</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEditing("certifications")}>
                  <Edit className="h-4 w-4 mr-2 text-gray-600" /> Edit
                </Button>
              </CardHeader>
              <CardContent>
                {userData.certifications?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <h4 className="font-medium text-gray-800">{cert.name}</h4>
                          <p className="text-gray-600">{cert.issuer}</p>
                          <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-3">No certifications added</p>
                    <Button variant="default" onClick={() => startEditing("certifications")}>
                      <Plus className="h-4 w-4 mr-2" /> Add Certification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-800">Skills</CardTitle>
                  <CardDescription className="text-gray-600">List your expertise</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEditing("skills")}>
                  <Edit className="h-4 w-4 mr-2 text-gray-600" /> Edit
                </Button>
              </CardHeader>
              <CardContent>
                {userData.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-3">No skills added</p>
                    <Button variant="default" onClick={() => startEditing("skills")}>
                      <Plus className="h-4 w-4 mr-2" /> Add Skills
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-800">Verification Status</CardTitle>
                <CardDescription className="text-gray-600">Build trust with verified details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-800">Email</span>
                    </div>
                    <Badge className={userData.emailVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {userData.emailVerified ? <CheckCircle className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      {userData.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-gray-800">Phone</span>
                    </div>
                    <Badge className={userData.phoneVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                      {userData.phoneVerified ? <CheckCircle className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      {userData.phoneVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-800">Seller Stats</CardTitle>
                <CardDescription className="text-gray-600">Track your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Completed Orders</span>
                    <span className="text-gray-600">{userData.completedOrders || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Seller Level</span>
                    <Badge className="bg-purple-100 text-purple-700">{userData.sellerLevel || "New"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Rating</span>
                    <span className="text-gray-600">{userData.rating?.average || 0} ({userData.rating?.count || 0} reviews)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Edit {currentField.charAt(0).toUpperCase() + currentField.slice(1)}
              </h2>
              <div className="space-y-4">
                {currentField === "education" ? (
                  <>
                    <Label htmlFor="school" className="text-gray-700">School</Label>
                    <Input
                      id="school"
                      value={modalEducation.school}
                      onChange={(e) => setModalEducation({ ...modalEducation, school: e.target.value })}
                      placeholder="e.g., University of Technology"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                    <Label htmlFor="degree" className="text-gray-700">Degree</Label>
                    <Input
                      id="degree"
                      value={modalEducation.degree}
                      onChange={(e) => setModalEducation({ ...modalEducation, degree: e.target.value })}
                      placeholder="e.g., Bachelor's"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                    <Label htmlFor="field" className="text-gray-700">Field</Label>
                    <Input
                      id="field"
                      value={modalEducation.field}
                      onChange={(e) => setModalEducation({ ...modalEducation, field: e.target.value })}
                      placeholder="e.g., Computer Science"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                    <Label htmlFor="from" className="text-gray-700">From</Label>
                    <Input
                      id="from"
                      type="date"
                      value={modalEducation.from}
                      onChange={(e) => setModalEducation({ ...modalEducation, from: e.target.value })}
                      className="border-gray-300 focus:border-indigo-500"
                    />
                    <Label htmlFor="to" className="text-gray-700">To</Label>
                    <Input
                      id="to"
                      type="date"
                      value={modalEducation.to}
                      onChange={(e) => setModalEducation({ ...modalEducation, to: e.target.value })}
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </>
                ) : currentField === "certifications" ? (
                  <>
                    <Label htmlFor="cert-name" className="text-gray-700">Certification Name</Label>
                    <Input
                      id="cert-name"
                      value={modalCertifications.name}
                      onChange={(e) => setModalCertifications({ ...modalCertifications, name: e.target.value })}
                      placeholder="e.g., Full Stack Web Development"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                    <Label htmlFor="cert-issuer" className="text-gray-700">Issuer</Label>
                    <Input
                      id="cert-issuer"
                      value={modalCertifications.issuer}
                      onChange={(e) => setModalCertifications({ ...modalCertifications, issuer: e.target.value })}
                      placeholder="e.g., Tech Academy"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                    <Label htmlFor="cert-date" className="text-gray-700">Date</Label>
                    <Input
                      id="cert-date"
                      type="date"
                      value={modalCertifications.date}
                      onChange={(e) => setModalCertifications({ ...modalCertifications, date: e.target.value })}
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </>
                ) : currentField === "skills" ? (
                  <>
                    <Label htmlFor="skills" className="text-gray-700">Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={modalSkills}
                      onChange={(e) => setModalSkills(e.target.value)}
                      placeholder="e.g., JavaScript, React, Node.js"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </>
                ) : (
                  <>
                    <Label htmlFor="modal-input" className="text-gray-700">
                      {currentField === "languages" ? "Languages (comma-separated)" : currentField}
                    </Label>
                    {currentField === "languages" ? (
                      <Input
                        id="modal-input"
                        value={modalValue}
                        onChange={(e) => {
                          setModalValue(e.target.value)
                          setModalLanguages(e.target.value.split(",").map((lang) => lang.trim()).filter(Boolean))
                        }}
                        placeholder="e.g., Hindi, English"
                        className="border-gray-300 focus:border-indigo-500"
                      />
                    ) : (
                      <Input
                        id="modal-input"
                        value={modalValue}
                        onChange={(e) => setModalValue(e.target.value)}
                        placeholder={`Enter ${currentField}`}
                        className="border-gray-300 focus:border-indigo-500"
                      />
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <Button variant="outline" onClick={cancelEditing} className="text-gray-700">
                  Cancel
                </Button>
                <Button onClick={saveChanges} className="bg-indigo-600 text-white hover:bg-indigo-700">
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}