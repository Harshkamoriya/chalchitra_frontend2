"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Eye,
  Package,
  Plus,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Timer,
} from "lucide-react"

// Mock user data
const userData = {
  name: "John Doe",
  username: "john_creator",
  email: "john@example.com",
  avatar: null,
  currentBadge: 1, // 1-4 representing the badge levels
  successScore: 85,
  rating: 4.8,
  responseRate: 95,
  totalEarnings: 2450,
  activeDays: 127,
  totalGigs: 12,
  avgRating: 4.8,
  highestRating: 5.0,
}

const orderStats = {
  active: 3,
  completed: 24,
  cancelled: 2,
  queued: 1,
  total: 30,
}

const badges = [
  {
    id: 1,
    name: "New Talent",
    emoji: "🏷️",
    color: "bg-blue-500",
    description: "Welcome to Chalchitra! Start your creative journey.",
  },
  {
    id: 2,
    name: "Rising Star",
    emoji: "🌟",
    color: "bg-yellow-500",
    description: "You're gaining momentum and building your reputation.",
  },
  {
    id: 3,
    name: "Screen Pro",
    emoji: "🎬",
    color: "bg-purple-500",
    description: "Professional level creator with proven expertise.",
  },
  {
    id: 4,
    name: "Chalchitra Elite",
    emoji: "🏆",
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    description: "Top-tier creator with exceptional performance.",
  },
]

export default function SellerDashboard() {
  const [isAvailable, setIsAvailable] = useState(true)
  const currentBadge = badges.find((badge) => badge.id === userData.currentBadge)
  const initials = userData.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-6">
        {/* Greeting Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {getGreeting()}, {userData.name}! 👋
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Welcome to your seller dashboard. Here's your performance overview and important updates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="lg:sticky lg:top-20">
              <CardContent className="p-4 md:p-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar
                    className="h-16 w-16 md:h-20 md:w-20 mb-4 border-4 border-background shadow-lg">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback
                      className="bg-primary text-primary-foreground text-lg md:text-xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-base md:text-lg">{userData.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">@{userData.username}</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full text-xs md:text-sm">
                    <Eye className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    View Profile
                  </Button>
                </div>

                {/* Badge Level */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm md:text-base">Badge Level</h4>
                  <div className="flex items-center justify-center mb-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform ${currentBadge?.color}`}>
                          {currentBadge?.emoji}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{currentBadge?.name}</p>
                          <p className="text-xs text-muted-foreground">{currentBadge?.description}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {currentBadge?.name}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-muted-foreground">Success Score</span>
                    <span className="font-medium text-sm md:text-base">{userData.successScore}%</span>
                  </div>
                  <Progress value={userData.successScore} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-sm md:text-base">{userData.rating}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-medium text-sm md:text-base">{userData.responseRate}%</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mb-6 text-xs md:text-sm">
                  View Progress
                </Button>

                {/* Availability */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-sm md:text-base">Availability</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm">
                      {isAvailable ? "Available for new orders" : "Currently unavailable"}
                    </span>
                    <Button
                      variant={isAvailable ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className="ml-2 text-xs">
                      {isAvailable ? "Online" : "Offline"}
                    </Button>
                  </div>
                  {!isAvailable && (
                    <p className="text-xs text-muted-foreground mt-2">
                      While unavailable, your gigs are hidden and you won't receive new orders.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Dashboard Overview */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Top Section with Notice and Quick Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
              {/* Important Notice */}
              <div className="xl:col-span-2">
                <Card className="border-orange-200 bg-orange-50 h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-orange-900 text-sm md:text-base">Verify your information</h4>
                        <p className="text-xs md:text-sm text-orange-700 mb-3">
                          Stay compliant to continue working with international clients
                        </p>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-xs md:text-sm">
                          Verify
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="xl:col-span-1">
                <Card className="h-full">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 text-sm md:text-base">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full justify-start text-xs md:text-sm h-8">
                        <Plus className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        Create Gig
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs md:text-sm h-8">
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        View Orders
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs md:text-sm h-8">
                        <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Total Earnings</p>
                      <p className="text-lg md:text-xl font-bold">${userData.totalEarnings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Total Gigs</p>
                      <p className="text-lg md:text-xl font-bold">{userData.totalGigs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Active Days</p>
                      <p className="text-lg md:text-xl font-bold">{userData.activeDays}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Avg Rating</p>
                      <p className="text-lg md:text-xl font-bold">{userData.avgRating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders and Earnings Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Users className="h-4 w-4 md:h-5 md:w-5" />
                    Orders Overview
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Your order statistics and status breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between p-2 md:p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                        <span className="font-medium text-xs md:text-sm">Active Orders</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {orderStats.active}
                      </Badge>
                    </div>

                    <div
                      className="flex items-center justify-between p-2 md:p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                        <span className="font-medium text-xs md:text-sm">Completed</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {orderStats.completed}
                      </Badge>
                    </div>

                    <div
                      className="flex items-center justify-between p-2 md:p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Timer className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                        <span className="font-medium text-xs md:text-sm">Queued</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {orderStats.queued}
                      </Badge>
                    </div>

                    <div
                      className="flex items-center justify-between p-2 md:p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                        <span className="font-medium text-xs md:text-sm">Cancelled</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {orderStats.cancelled}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                    Earnings Overview
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Your monthly earnings trend</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-muted-foreground">This Month</span>
                      <span className="text-xl md:text-2xl font-bold text-green-600">$1,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-muted-foreground">Last Month</span>
                      <span className="text-base md:text-lg font-semibold">$900</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-muted-foreground">Growth</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">+66.7%</Badge>
                    </div>
                    <div className="pt-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">75% of monthly goal achieved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
