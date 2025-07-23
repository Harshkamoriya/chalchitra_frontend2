"use client"

import { useEffect, useState, useRef } from "react"
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
import {
  Edit,
  Eye,
  MapPin,
  Globe,
  Phone,
  Mail,
  Plus,
  Star,
  Calendar,
  Clock,
  MessageSquare,
  Target,
  Camera,
  Save,
  CheckCircle,
  Home,
  ChevronRight,
  Wand2,
} from "lucide-react"
import { useUserContext } from "@/app/(nav2)/context/UserContext"
import api from "@/lib/axios"

export default function BuyerProfile() {
  const { userData, userLoading, setUserData } = useUserContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentField, setCurrentField] = useState(null)
  const [modalValue, setModalValue] = useState("")
  const [modalLanguages, setModalLanguages] = useState([])
  const pathb = "/categories"
  const paths = "/seller/profile/edit"

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "Unknown"
  }

  const startEditing = (field, initialValue = "") => {
    setCurrentField(field)
    if (field === "languages") {
      setModalLanguages(userData.languages || [])
      setModalValue((userData.languages || []).join(", "))
    } else {
      setModalValue(initialValue || userData[field] || "")
    }
    setIsModalOpen(true)
  }

const saveChanges = async () => {
  try {
    let updateData = {};

    if (currentField === "languages") {
      updateData = { languages: modalLanguages };
    } else {
      updateData = { [currentField]: modalValue };
    }

    console.log("[Client] Sending update data:", updateData);

    const res = await api.patch("/api/profile", updateData);
    console.log("[Client] Received response:", res);

    if (!res.data.success) {
      console.error("[Client] API responded with failure:", res.data);
      throw new Error(res.data.error || "Failed to update profile");
    }

    // Update local user state
    setUserData((prev) => ({ ...prev, ...res.data.user }));
    console.log("[Client] Updated userData:", res.data.user);

    // Reset modal state
    setIsModalOpen(false);
    setCurrentField(null);
    setModalValue("");
    setModalLanguages([]);
  } catch (error) {
    console.error("[Client] Error updating profile:", error.message);
    alert("Failed to update profile: " + error.message);
  }
};


  const cancelEditing = () => {
    setIsModalOpen(false)
    setCurrentField(null)
    setModalValue("")
    setModalLanguages([])
  }

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <p>Loading user information...</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <p>Error: Unable to load user data. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Home className="h-4 w-4" />
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">My Profile</span>
      </div>

      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">This is your profile when ordering services.</p>
              <p className="text-blue-700 text-sm">
                For your freelancer profile click{" "}
                <Link href="/seller/profile/edit">
                  <span className="underline hover:no-underline">here</span>
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative mb-4 inline-block">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.name || "User"} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {userData.name
                        ? userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    onClick={() => startEditing("image", userData.image || "")}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold">{userData.displayName || userData.name || "User"}</h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing("displayName", userData.displayName || userData.name || "")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground">@{userData.username || "username"}</p>

                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Located in {userData.country || "India"}
                  </div>

                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined in {formatDate(userData.joinedDate)}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Languages</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing("languages")}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {(userData.languages || []).map((lang, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{lang}</span>
                      </div>
                    ))}
                    {(!userData.languages || userData.languages.length === 0) && (
                      <p className="text-sm text-muted-foreground">No languages added</p>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">Preferred working hours</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing("preferredWorkingHours", userData.preferredWorkingHours || "")}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{userData.preferredWorkingHours || "Not specified"}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview public profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Hi <Wand2 className="inline h-8 w-8 text-yellow-500" /> Let's help freelancers get to know you
            </h1>
            <p className="text-muted-foreground text-lg">
              Get the most out of Fiverr by sharing a bit more about yourself and how you prefer to work with freelancers.
            </p>
          </div>

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
                  <span className="text-sm text-muted-foreground">{userData.profileCompleteness || 0}%</span>
                </div>
                <Progress value={userData.profileCompleteness || 0} className="h-2" />

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
                  onClick={() => startEditing("description", userData.description || "")}
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
                  <Button onClick={() => startEditing("description", "")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add description
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{`Edit ${currentField.charAt(0).toUpperCase() + currentField.slice(1)}`}</h2>
            <div className="space-y-4">
              <Label htmlFor="modal-input">{currentField === "languages" ? "Languages (comma-separated)" : currentField}</Label>
              {currentField === "languages" ? (
                <Input
                  id="modal-input"
                  value={modalValue}
                  onChange={(e) => {
                    setModalValue(e.target.value)
                    setModalLanguages(e.target.value.split(",").map((lang) => lang.trim()).filter(Boolean))
                  }}
                  placeholder="e.g., Hindi, English"
                />
              ) : (
                <Input
                  id="modal-input"
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  placeholder={`Enter ${currentField}`}
                />
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
              <Button onClick={saveChanges}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}