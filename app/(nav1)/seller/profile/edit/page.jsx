"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Edit,
  Share,
  Eye,
  MapPin,
  Globe,
  Phone,
  Mail,
  Plus,
  X,
  Star,
  Award,
  GraduationCap,
  LinkIcon,
  Camera,
  Save,
  CheckCircle,
  Package,
} from "lucide-react"

// Mock user data based on the schema
const mockUserData = {
  name: "Harhs K",
  displayName: "Harhs K",
  email: "harhs@example.com",
  image: "/placeholder.svg",
  provider: "credentials",
  role: "user",
  isSeller: true,
  sellerLevel: "level_1",
  description:
    "I have developed a full-stack salon appointment booking system that enables customers to book appointments seamlessly while allowing salon owners to manage bookings, track revenue, and analyze business performance. Built with the MERN stack (MongoDB, React, Node, Express), it includes features like real-time appointment scheduling, an admin dashboard, customer management, business analytics, and service management. The platform is secure, scalable, and responsive, optimizing salon operations and enhancing customer experience.",
  country: "India",
  languages: ["Hindi", "English"],
  skills: ["MongoDB expert", "React expert", "JavaScript ES6 developer", "Html expert", "CSS expert", "Git expert"],
  occupation: "Full Stack Developer",
  education: [
    {
      school: "University of Technology",
      degree: "Bachelor's",
      field: "Computer Science",
      from: new Date("2020-08-01"),
      to: new Date("2024-05-01"),
      description: "Focused on web development and software engineering",
    },
  ],
  certifications: [
    {
      name: "Graduation fullstack web development completion certificate In (MERN)",
      issuer: "Tech Academy",
      date: new Date("2024-01-01"),
      link: "https://example.com/cert",
    },
  ],
  portfolio: ["https://example.com/project1", "https://example.com/project2"],
  socialLinks: {
    linkedin: "https://linkedin.com/in/harshk",
    twitter: "https://twitter.com/harshk",
    github: "https://github.com/harshk",
    website: "https://harshk.dev",
  },
  phoneNumber: "+91-9876543210",
  phoneVerified: true,
  emailVerified: true,
  completedOrders: 47,
  rating: {
    average: 4.8,
    count: 45,
  },
  createdAt: new Date("2023-06-15"),
}

export default function ProfilePage() {
  const [userData, setUserData] = useState(mockUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [tempData, setTempData] = useState({})

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  const getSellerLevelBadge = (level) => {
    const levels = {
      new: { label: "New Seller", color: "bg-gray-100 text-gray-800" },
      level_1: { label: "Level 1", color: "bg-blue-100 text-blue-800" },
      level_2: { label: "Level 2", color: "bg-purple-100 text-purple-800" },
      top_rated: { label: "Top Rated", color: "bg-yellow-100 text-yellow-800" },
    }
    return levels[level] || levels.new
  }

  const startEditing = (section, data = {}) => {
    setEditingSection(section)
    setTempData(data)
    setIsEditing(true)
  }

  const saveChanges = () => {
    // Here you would typically make an API call to save the changes
    console.log("Saving changes:", tempData)
    setIsEditing(false)
    setEditingSection(null)
    setTempData({})
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditingSection(null)
    setTempData({})
  }

  const addSkill = (skill) => {
    if (skill && !userData.skills.includes(skill)) {
      setUserData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
  }

  const removeSkill = (skillToRemove) => {
    setUserData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const EditDialog = ({ title, children, onSave, onCancel }) => (
    <Dialog open={isEditing} onOpenChange={(open) => !open && cancelEditing()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Make changes to your profile information</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">{children}</div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section - Profile Image and Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                  onClick={() => startEditing("image")}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{userData.displayName || userData.name}</h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      startEditing("basic", {
                        name: userData.name,
                        displayName: userData.displayName,
                        occupation: userData.occupation,
                      })
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-muted-foreground mb-2">@{userData.name.toLowerCase().replace(" ", "")}</p>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {userData.country}
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    Speaks {userData.languages.join(", ")}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      startEditing("location", {
                        country: userData.country,
                        languages: userData.languages,
                      })
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={getSellerLevelBadge(userData.sellerLevel).color}>
                    <Award className="h-3 w-3 mr-1" />
                    {getSellerLevelBadge(userData.sellerLevel).label}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {userData.rating.average} ({userData.rating.count} reviews)
                  </Badge>
                  <Badge variant="outline">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                    {userData.completedOrders} orders completed
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span className={userData.emailVerified ? "text-green-600" : "text-orange-600"}>
                      Email {userData.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span className={userData.phoneVerified ? "text-green-600" : "text-orange-600"}>
                      Phone {userData.phoneVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Actions and Quick Links */}
            <div className="flex-1 lg:text-right">
              <div className="flex flex-col lg:items-end gap-4">
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>

                <Card className="w-full lg:w-64">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Gigs
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-2" />
                      Reviews
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-2" />
                      Achievements
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* About Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>About</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startEditing("about", { description: userData.description })}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{userData.description}</p>
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Back up your skills by adding any educational degrees or programs.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => startEditing("education")}>
                <Plus className="h-4 w-4 mr-2" />
                Add education
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userData.education.length > 0 ? (
              <div className="space-y-4">
                {userData.education.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {edu.degree} in {edu.field}
                        </h4>
                        <p className="text-muted-foreground">{edu.school}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(edu.from)} - {formatDate(edu.to)}
                        </p>
                        {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No education added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Certifications Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Certifications</CardTitle>
              <Button variant="outline" size="sm" onClick={() => startEditing("certifications")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit certifications
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userData.certifications.length > 0 ? (
              <div className="space-y-4">
                {userData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{cert.name}</h4>
                      <p className="text-muted-foreground">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(cert.date)}</p>
                      {cert.link && (
                        <a href={cert.link} className="text-sm text-blue-600 hover:underline">
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No certifications added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Skills and expertise</CardTitle>
                <CardDescription>Showcase your professional skills and areas of expertise.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => startEditing("skills")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit skills and expertise
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Links Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your social media and professional profiles.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => startEditing("social", userData.socialLinks)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit links
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(userData.socialLinks).map(
                ([platform, url]) =>
                  url && (
                    <div key={platform} className="flex items-center gap-3 p-3 border rounded-lg">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium capitalize">{platform}</p>
                        <a
                          href={url}
                          className="text-sm text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {url}
                        </a>
                      </div>
                    </div>
                  ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialogs */}
      {editingSection === "basic" && (
        <EditDialog title="Edit Basic Information" onSave={saveChanges} onCancel={cancelEditing}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={tempData.name || ""}
                onChange={(e) => setTempData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={tempData.displayName || ""}
                onChange={(e) => setTempData((prev) => ({ ...prev, displayName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={tempData.occupation || ""}
                onChange={(e) => setTempData((prev) => ({ ...prev, occupation: e.target.value }))}
              />
            </div>
          </div>
        </EditDialog>
      )}

      {editingSection === "about" && (
        <EditDialog title="Edit About Section" onSave={saveChanges} onCancel={cancelEditing}>
          <div>
            <Label htmlFor="description">Professional Description</Label>
            <Textarea
              id="description"
              rows={8}
              value={tempData.description || ""}
              onChange={(e) => setTempData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your professional experience, skills, and what makes you unique..."
            />
            <p className="text-sm text-muted-foreground mt-2">{tempData.description?.length || 0}/1000 characters</p>
          </div>
        </EditDialog>
      )}

      {editingSection === "location" && (
        <EditDialog title="Edit Location & Languages" onSave={saveChanges} onCancel={cancelEditing}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Select
                value={tempData.country || ""}
                onValueChange={(value) => setTempData((prev) => ({ ...prev, country: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Languages</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(tempData.languages || userData.languages).map((lang, index) => (
                  <Badge key={index} variant="secondary">
                    {lang}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2"
                      onClick={() => {
                        const newLangs = (tempData.languages || userData.languages).filter((_, i) => i !== index)
                        setTempData((prev) => ({ ...prev, languages: newLangs }))
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </EditDialog>
      )}

      {editingSection === "skills" && (
        <EditDialog title="Edit Skills & Expertise" onSave={saveChanges} onCancel={cancelEditing}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newSkill">Add New Skill</Label>
              <div className="flex gap-2">
                <Input
                  id="newSkill"
                  placeholder="Enter a skill..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSkill(e.target.value)
                      e.target.value = ""
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.target.parentElement.querySelector("input")
                    addSkill(input.value)
                    input.value = ""
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <div>
              <Label>Current Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2" onClick={() => removeSkill(skill)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </EditDialog>
      )}

      {editingSection === "social" && (
        <EditDialog title="Edit Social Links" onSave={saveChanges} onCancel={cancelEditing}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={tempData.linkedin || ""}
                onChange={(e) => setTempData((prev) => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={tempData.twitter || ""}
                onChange={(e) => setTempData((prev) => ({ ...prev, twitter: e.target.value }))}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={tempData.github || ""}
                onChange={(e) => setTempData((prev) => ({ ...prev, github: e.target.value }))}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={tempData.website || ""}
                onChange={(e) => setTempData((prev) => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </EditDialog>
      )}
    </div>
  )
}
