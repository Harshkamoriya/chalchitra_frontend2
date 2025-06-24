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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Cookies from 'js-cookie'; // client-side cookie library
import {
  Edit,
  Eye,
  MapPin,
  Globe,
  Phone,
  Mail,
  Plus,
  X,
  Star,
  Calendar,
  Clock,
  MessageSquare,
  Target,
  Camera,
  Save,
  CheckCircle,
  ShoppingCart,
  Users,
  Briefcase,
  Info,
  RefreshCw,
  Home,
  ChevronRight,
  Wand2,
} from "lucide-react"

// Mock buyer data
const mockBuyerData = {
  name: "Harhs K",
  displayName: "Harhs K",
  username: "harshkamoriya",
  email: "harhs@example.com",
  image: "/placeholder.svg",
  country: "India",
  languages: ["Hindi (Fluent)", "English (Conversational)"],
  joinedDate: new Date("2025-01-01"),
  description: "I'm a startup founder looking for talented freelancers to help build innovative digital solutions. I value clear communication, quality work, and long-term partnerships.",
  phoneNumber: "+91-9876543210",
  phoneVerified: true,
  emailVerified: true,
  totalOrders: 12,
  activeOrders: 3,
  completedOrders: 9,
  averageRating: 4.9,
  totalSpent: 2450,
  preferredWorkingHours: "9 AM - 6 PM IST",
  communicationStyle: "Direct and detailed",
  projectTypes: ["Web Development", "Mobile Apps", "UI/UX Design", "Digital Marketing"],
  budgetRange: "$500 - $2000",
  workingStyle: "Collaborative",
  responseTime: "Within 2 hours",
  feedbackStyle: "Constructive and detailed",
  profileCompleteness: 85,
}
import { useAuth } from "@/app/(nav2)/context/AuthContext"

export default function BuyerProfile() {
  const [userData, setUserData] = useState(mockBuyerData)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [tempData, setTempData] = useState({})
  const pathb = "/categories";
  const paths = "/seller/profile/edit";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }
  // const {handleSwitch}=useAuth();

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



  const EditDialog = ({ title, children, onSave, onCancel }) => (
    <Dialog open={isEditing} onOpenChange={(open) => !open && cancelEditing()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Update your profile information to help freelancers understand you better</DialogDescription>
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Home className="h-4 w-4" />
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">My Profile</span>
      </div>

      {/* Profile Notice */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">This is your profile when ordering services.</p>
              <p className="text-blue-700 text-sm">
                For your freelancer profile click{" "}
<Link
  href="/seller/profile/edit"
>
  <span className="underline hover:no-underline">here</span>
</Link>              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative mb-4 inline-block">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold">{userData.displayName || userData.name}</h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        startEditing("basic", {
                          name: userData.name,
                          displayName: userData.displayName,
                        })
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground">@{userData.username}</p>

                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Located in {userData.country}
                  </div>

                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined in {formatDate(userData.joinedDate)}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Languages */}
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Languages</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        startEditing("languages", {
                          languages: userData.languages,
                        })
                      }
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {userData.languages.map((lang, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Working Hours */}
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Preferred working hours</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        startEditing("workingHours", {
                          preferredWorkingHours: userData.preferredWorkingHours,
                        })
                      }
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{userData.preferredWorkingHours}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Preview Button */}
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview public profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Hi <Wand2 className="inline h-8 w-8 text-yellow-500" /> Let's help freelancers get to know you
            </h1>
            <p className="text-muted-foreground text-lg">
              Get the most out of Fiverr by sharing a bit more about yourself and how you prefer to work with freelancers.
            </p>
          </div>

          {/* Profile Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Profile checklist
              </CardTitle>
              <CardDescription>Complete your profile to help freelancers understand your needs better</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profile completion</span>
                  <span className="text-sm text-muted-foreground">{userData.profileCompleteness}%</span>
                </div>
                <Progress value={userData.profileCompleteness} className="h-2" />
                
                <div className="space-y-3 mt-6">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Share how you plan to use Fiverr</h4>
                      <p className="text-sm text-muted-foreground">Tell us if you're here to find services or offer them.</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="p-2 bg-green-100 rounded-full">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Set your communication preferences</h4>
                      <p className="text-sm text-muted-foreground">Let freelancers know your collaboration preferences.</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>About Me</CardTitle>
                  <CardDescription>Help freelancers understand your background and working style</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("about", { description: userData.description })}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {userData.description ? (
                <p className="text-muted-foreground leading-relaxed">{userData.description}</p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Tell freelancers about yourself and your projects</p>
                  <Button onClick={() => startEditing("about", { description: "" })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add description
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buyer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userData.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userData.completedOrders}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userData.averageRating}</p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Working Preferences */}
          {/* <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Working Preferences</CardTitle>
                  <CardDescription>Help freelancers understand how you like to collaborate</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("preferences", {
                    communicationStyle: userData.communicationStyle,
                    workingStyle: userData.workingStyle,
                    responseTime: userData.responseTime,
                    feedbackStyle: userData.feedbackStyle,
                  })}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit preferences
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Communication Style</h4>
                  <p className="text-sm text-muted-foreground">{userData.communicationStyle}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Working Style</h4>
                  <p className="text-sm text-muted-foreground">{userData.workingStyle}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Response Time</h4>
                  <p className="text-sm text-muted-foreground">{userData.responseTime}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Feedback Style</h4>
                  <p className="text-sm text-muted-foreground">{userData.feedbackStyle}</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Project Interests */}
          {/* <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Interests</CardTitle>
                  <CardDescription>What types of projects are you typically looking for?</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("interests", {
                    projectTypes: userData.projectTypes,
                    budgetRange: userData.budgetRange,
                  })}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit interests
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Project Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {userData.projectTypes.map((type, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Typical Budget Range</h4>
                  <Badge variant="outline" className="text-sm">
                    {userData.budgetRange}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Verification</CardTitle>
              <CardDescription>Verify your account to build trust with freelancers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <span className="font-medium">Email Address</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {userData.emailVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600">
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">Phone Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {userData.phoneVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600">
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
          </div>
        </EditDialog>
      )}

      {editingSection === "about" && (
        <EditDialog title="Tell Freelancers About Yourself" onSave={saveChanges} onCancel={cancelEditing}>
          <div>
            <Label htmlFor="description">About Me</Label>
            <Textarea
              id="description"
              rows={6}
              value={tempData.description || ""}
              onChange={(e) => setTempData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Tell freelancers about your background, the types of projects you work on, and what you're looking for in a collaboration..."
            />
            <p className="text-sm text-muted-foreground mt-2">{tempData.description?.length || 0}/500 characters</p>
          </div>
        </EditDialog>
      )}

      {editingSection === "preferences" && (
        <EditDialog title="Edit Working Preferences" onSave={saveChanges} onCancel={cancelEditing}>
          <div className="space-y-4">
            <div>
              {/* <Label htmlFor="communicationStyle">Communication Style</Label>
              <Select
                value={tempData.communicationStyle || ""}
                onValueChange={(value) => setTempData((prev) => ({ ...prev, communicationStyle: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select communication style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct and detailed">Direct and detailed</SelectItem>
                  <SelectItem value="Casual and friendly">Casual and friendly</SelectItem>
                  <SelectItem value="Professional and formal">Professional and formal</SelectItem>
                  <SelectItem value="Brief and to the point">Brief and to the point</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            <div>
              {/* <Label htmlFor="workingStyle">Working Style</Label>
              <Select
                value={tempData.workingStyle || ""}
                onValueChange={(value) => setTempData((prev) => ({ ...prev, workingStyle: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select working style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Collaborative">Collaborative</SelectItem>
                  <SelectItem value="Independent">Independent</SelectItem>
                  <SelectItem value="Hands-on">Hands-on</SelectItem>
                  <SelectItem value="Delegative">Delegative</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            <div>
              {/* <Label htmlFor="responseTime">Typical Response Time</Label>
              <Select
                value={tempData.responseTime || ""}
                onValueChange={(value) => setTempData((prev) => ({ ...prev, responseTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select response time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Within 1 hour">Within 1 hour</SelectItem>
                  <SelectItem value="Within 2 hours">Within 2 hours</SelectItem>
                  <SelectItem value="Within 4 hours">Within 4 hours</SelectItem>
                  <SelectItem value="Within 24 hours">Within 24 hours</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
            <div>
              {/* <Label htmlFor="feedbackStyle">Feedback Style</Label> */}
              {/* <Select
                value={tempData.feedbackStyle || ""}
                onValueChange={(value) => setTempData((prev) => ({ ...prev, feedbackStyle: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Constructive and detailed">Constructive and detailed</SelectItem>
                  <SelectItem value="Quick and direct">Quick and direct</SelectItem>
                  <SelectItem value="Encouraging and supportive">Encouraging and supportive</SelectItem>
                  <SelectItem value="Technical and specific">Technical and specific</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </EditDialog>
      )}
    </div>
  )
}