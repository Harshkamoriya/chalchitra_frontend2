"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Edit3,
  MapPin,
  Globe,
  Phone,
  Mail,
  Star,
  Award,
  GraduationCap,
  CheckCircle,
  Calendar,
  ExternalLink,
} from "lucide-react"

// Mock user data
const mockUserData = {
  name: "Harhs K",
  displayName: "Harhs K",
  email: "harhs@example.com",
  image: "/placeholder.svg",
  role: "user",
  isSeller: true,
  sellerLevel: "level_1",
  description:
    "I have developed a full-stack salon appointment booking system that enables customers to book appointments seamlessly while allowing salon owners to manage bookings, track revenue, and analyze business performance. Built with the MERN stack (MongoDB, React, Node, Express), it includes features like real-time appointment scheduling, an admin dashboard, customer management, business analytics, and service management.",
  country: "India",
  languages: ["Hindi", "English"],
  skills: ["MongoDB", "React", "JavaScript", "HTML", "CSS", "Git"],
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
      name: "Full Stack Web Development (MERN)",
      issuer: "Tech Academy",
      date: new Date("2024-01-01"),
      link: "https://example.com/cert",
    },
  ],
  socialLinks: {
    linkedin: "https://linkedin.com/in/harshk",
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
  memberSince: new Date("2023-06-15"),
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

  const getSellerLevelInfo = (level) => {
    const levels = {
      new: { label: "New Seller", color: "bg-gray-100 text-gray-700" },
      level_1: { label: "Level 1", color: "bg-blue-100 text-blue-700" },
      level_2: { label: "Level 2", color: "bg-purple-100 text-purple-700" },
      top_rated: { label: "Top Rated", color: "bg-yellow-100 text-yellow-700" },
    }
    return levels[level] || levels.new
  }

  const startEditing = (section, data = {}) => {
    setEditingSection(section)
    setTempData(data)
    setIsEditing(true)
  }

  const saveChanges = () => {
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={userData.image} alt={userData.name} />
              <AvatarFallback className="text-xl font-semibold bg-gray-100">
                {userData.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{userData.displayName}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => startEditing("basic", { name: userData.name, displayName: userData.displayName })}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-2">{userData.occupation}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {userData.country}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {userData.languages.join(", ")}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {formatDate(userData.memberSince)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={getSellerLevelInfo(userData.sellerLevel).color}>
                  {getSellerLevelInfo(userData.sellerLevel).label}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {userData.rating.average} ({userData.rating.count})
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 md:text-right">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-2">
              <div className="text-center md:text-right">
                <div className="text-2xl font-bold text-gray-900">{userData.completedOrders}</div>
                <div className="text-sm text-gray-500">Orders completed</div>
              </div>
              <div className="text-center md:text-right">
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">About</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing("about", { description: userData.description })}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{userData.description}</p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Skills</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing("skills")}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userData.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Education */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Education</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditing("education")}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {userData.education.length > 0 ? (
              <div className="space-y-4">
                {userData.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <h4 className="font-medium text-gray-900">
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(edu.from)} - {formatDate(edu.to)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No education added</p>
            )}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold">Certifications</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditing("certifications")}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {userData.certifications.length > 0 ? (
              <div className="space-y-4">
                {userData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{cert.name}</h4>
                      <p className="text-gray-600">{cert.issuer}</p>
                      <p className="text-sm text-gray-500">{formatDate(cert.date)}</p>
                      {cert.link && (
                        <a 
                          href={cert.link} 
                          className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Certificate <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No certifications added</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Social Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Links</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => startEditing("social", userData.socialLinks)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(userData.socialLinks).map(([platform, url]) => 
              url && (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{platform}</p>
                    <p className="text-sm text-gray-500 truncate">{url}</p>
                  </div>
                </a>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialogs */}
      {editingSection === "basic" && (
        <Dialog open={isEditing} onOpenChange={(open) => !open && cancelEditing()}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Basic Information</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={tempData.name || ""}
                  onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={tempData.displayName || ""}
                  onChange={(e) => setTempData(prev => ({ ...prev, displayName: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
              <Button onClick={saveChanges}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingSection === "about" && (
        <Dialog open={isEditing} onOpenChange={(open) => !open && cancelEditing()}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit About</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                value={tempData.description || ""}
                onChange={(e) => setTempData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Tell us about your professional experience..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
              <Button onClick={saveChanges}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingSection === "skills" && (
        <Dialog open={isEditing} onOpenChange={(open) => !open && cancelEditing()}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Skills</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label>Current Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
              <Button onClick={saveChanges}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editingSection === "social" && (
        <Dialog open={isEditing} onOpenChange={(open) => !open && cancelEditing()}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Links</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={tempData.linkedin || ""}
                  onChange={(e) => setTempData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={tempData.github || ""}
                  onChange={(e) => setTempData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={tempData.website || ""}
                  onChange={(e) => setTempData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
              <Button onClick={saveChanges}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}