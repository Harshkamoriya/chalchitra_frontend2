"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Copy,
  Edit,
  Eye,
  Filter,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
  UserCheck,
  AlertCircle,
  Loader2
} from "lucide-react"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"
import { useAuth } from "@/app/(nav2)/context/AuthContext"

const statusConfig = {
  live: { label: "Published", color: "bg-green-100 text-green-800", icon: CheckCircle },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Edit },
  pending: { label: "Under Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  requires_modification: { label: "Needs Changes", color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  paused: { label: "Paused", color: "bg-blue-100 text-blue-800", icon: Pause },
  denied: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function GigsPage() {
  const router = useRouter()
  const { user, activeRole } = useAuth()
  
  const [activeTab, setActiveTab] = useState("live")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [acceptingCustomOrders, setAcceptingCustomOrders] = useState(true)
  const [selectedGig, setSelectedGig] = useState(null)
  const [gigs, setGigs] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    live: 0,
    draft: 0,
    pending: 0,
    requires_modification: 0,
    paused: 0,
    denied: 0
  })

  // Check if user can access this page
  useEffect(() => {
    console.log("[Frontend] Checking user access - activeRole:", activeRole, "isSeller:", user?.isSeller)
    
    if (!user) {
      console.log("[Frontend] No user found, redirecting to login")
      // router.push("/login")
      return
    }

    // if (activeRole !== "seller") {
    //   console.log("[Frontend] User is not in seller mode")
    //   toast.error("Please switch to seller mode to access gigs")
    //   return
    // }

    if (!user.isSeller) {
      console.log("[Frontend] User is not a seller")
      toast.error("You need to become a seller first")
      // router.push("/become-seller")
      return
    }
  }, [user, activeRole, router])

  useEffect(() => {
    if (user && activeRole === "seller" && user.isSeller) {
      console.log(activeRole  , "activeRole")
      fetchGigs()
      fetchStats()
    }
  }, [activeTab, page, user, activeRole])

  const fetchGigs = async () => {
    try {
      console.log("[Frontend] Fetching gigs with params:", { status: activeTab, page })
      setLoading(true)
      
      const res = await api.get("/api/user/gigs", {
        params: {
          status: activeTab,
          page,
          limit: 10,
          search: searchQuery
        }
      })
      
      console.log("[Frontend] Gigs response:", res.data)
      
      if (res.data.success) {
        setGigs(res.data.gigs)
        setTotalPages(res.data.pagination.pages)
      } else {
        setGigs([])
        toast.error("Failed to fetch gigs")
      }
    } catch (error) {
      console.error("[Frontend] Error fetching gigs:", error)
      setGigs([])
      toast.error("Could not load gigs")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      console.log("[Frontend] Fetching gig stats")
      const res = await api.get("/api/user/gigs/stats")
      
      if (res.data.success) {
        setStats(res.data.stats)
        console.log("[Frontend] Stats received:", res.data.stats)
      }
    } catch (error) {
      console.error("[Frontend] Error fetching stats:", error)
    }
  }

  const handleStatusChange = async (gigId, newStatus) => {
    try {
      console.log("[Frontend] Changing gig status:", gigId, "to", newStatus)
      
      const res = await api.patch(`/api/user/gigs/${gigId}/status`, {
        status: newStatus
      })
      
      if (res.data.success) {
        toast.success(`Gig ${newStatus === "paused" ? "paused" : "activated"} successfully`)
        fetchGigs()
        fetchStats()
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error("[Frontend] Error changing status:", error)
      toast.error("Failed to update gig status")
    }
  }

  const handleDeleteGig = async (gigId) => {
    if (!confirm("Are you sure you want to delete this gig? This action cannot be undone.")) {
      return
    }

    try {
      console.log("[Frontend] Deleting gig:", gigId)
      
      const res = await api.delete(`/api/user/gigs/${gigId}`)
      
      if (res.data.success) {
        toast.success("Gig deleted successfully")
        fetchGigs()
        fetchStats()
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error("[Frontend] Error deleting gig:", error)
      toast.error("Failed to delete gig")
    }
  }

  const handleDuplicateGig = async (gigId) => {
    try {
      console.log("[Frontend] Duplicating gig:", gigId)
      
      const res = await api.post(`/api/user/gigs/${gigId}/duplicate`)
      
      if (res.data.success) {
        toast.success("Gig duplicated successfully")
        fetchGigs()
        fetchStats()
      } else {
        throw new Error(res.data.message)
      }
    } catch (error) {
      console.error("[Frontend] Error duplicating gig:", error)
      toast.error("Failed to duplicate gig")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getConversionRate = (clicks, orders) => {
    if (clicks === 0) return 0
    return ((orders / clicks) * 100).toFixed(1)
  }

  const formatRevisions = (revisions) => {
    return revisions === "unlimited" ? "Unlimited" : `${revisions} revision${revisions !== 1 ? 's' : ''}`
  }

  // Show access control messages
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (activeRole !== "seller") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Switch to Seller Mode</h1>
          <p className="text-gray-600 mb-6">You need to be in seller mode to manage your gigs</p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Switch to Seller Mode
          </Button>
        </div>
      </div>
    )
  }

  // if (!user.isSeller) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="max-w-md mx-auto text-center p-8">
  //         <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
  //           <AlertCircle className="w-8 h-8 text-orange-600" />
  //         </div>
  //         <h1 className="text-2xl font-bold text-gray-900 mb-4">Become a Seller</h1>
  //         <p className="text-gray-600 mb-6">You need to complete seller registration to create and manage gigs</p>
  //         <Button onClick={() => router.push("/become-seller")} className="w-full">
  //           Become a Seller
  //         </Button>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Gigs</h1>
            <p className="text-gray-600">Create and manage your services to attract clients</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Custom Orders Toggle */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Switch
                checked={acceptingCustomOrders}
                onCheckedChange={setAcceptingCustomOrders}
              />
              <span className="text-sm font-medium">Accepting Custom Orders</span>
            </div>

            {/* Create Gig Button */}
            <Link href="/seller/manage/gigs/create-gig">
              <Button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4" />
                Create New Gig
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon
            return (
              <Card key={status} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${config.color.replace('text-', 'bg-').replace('100', '200')}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{config.label}</p>
                      <p className="text-xl font-bold">{stats[status] || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search gigs by title, category, or tags..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>
                    <Clock className="h-4 w-4 mr-2" />
                    Most Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("performance")}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Best Performance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price")}>
                    <span className="h-4 w-4 mr-2">$</span>
                    Highest Price
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("orders")}>
                    <Users className="h-4 w-4 mr-2" />
                    Most Orders
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Gigs Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setPage(1) }}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon
              return (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="flex items-center gap-1 text-xs md:text-sm"
                >
                  <Icon className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {stats[status] || 0}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.keys(statusConfig).map((status) => (
            <TabsContent key={status} value={status}>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading gigs...</span>
                </div>
              ) : gigs.length > 0 ? (
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="bg-white rounded-lg border">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-600">
                      <div className="col-span-4">GIG</div>
                      <div className="col-span-2">PERFORMANCE</div>
                      <div className="col-span-2">PRICING</div>
                      <div className="col-span-2">STATUS</div>
                      <div className="col-span-2">ACTIONS</div>
                    </div>

                    {/* Table Rows */}
                    {gigs.map((gig) => {
                      const StatusIcon = statusConfig[gig.status]?.icon || Clock
                      const conversionRate = getConversionRate(gig.clicks, gig.orders)
                      const basePrice = gig.packages?.[0]?.price || 0

                      return (
                        <div key={gig._id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 transition-colors">
                          {/* Gig Info */}
                          <div className="col-span-4">
                            <div className="flex items-start gap-3">
                              <img
                                src={gig.media?.coverImage || "/placeholder-gig.jpg"}
                                alt={gig.title}
                                className="w-16 h-12 object-cover rounded border"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                                  {gig.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Badge variant="outline" className="text-xs">
                                    {gig.category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                  <span>•</span>
                                  <span>Modified {formatDate(gig.lastModified)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Performance */}
                          <div className="col-span-2">
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Views:</span>
                                <span className="font-medium">{gig.impressions?.toLocaleString() || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Clicks:</span>
                                <span className="font-medium">{gig.clicks || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Orders:</span>
                                <span className="font-medium">{gig.orders || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Rate:</span>
                                <span className="font-medium">{conversionRate}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div className="col-span-2">
                            <div className="space-y-1">
                              <p className="text-lg font-bold text-gray-900">${basePrice}</p>
                              <p className="text-xs text-gray-500">
                                {gig.packages?.length || 0} package{gig.packages?.length !== 1 ? 's' : ''}
                              </p>
                              {gig.ordersInQueue > 0 && (
                                <p className="text-xs text-orange-600">
                                  {gig.ordersInQueue} in queue
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Status */}
                          <div className="col-span-2">
                            <Badge className={statusConfig[gig.status]?.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[gig.status]?.label}
                            </Badge>
                            {gig.rating?.average > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-gray-600">
                                  {gig.rating.average.toFixed(1)} ({gig.rating.count})
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedGig(gig)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                              </Dialog>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/seller/manage/gigs/create-gig?edit=${gig._id}`)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Gig
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicateGig(gig._id)}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(
                                      gig._id, 
                                      gig.status === "paused" ? "live" : "paused"
                                    )}
                                  >
                                    {gig.status === "paused" ? (
                                      <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Activate
                                      </>
                                    ) : (
                                      <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteGig(gig._id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {page} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page === totalPages}
                          onClick={() => setPage(page + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState status={status} />
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Gig Details Modal */}
        <Dialog>
          <GigDetailsModal gig={selectedGig} />
        </Dialog>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ status }) {
  const StatusIcon = statusConfig[status]?.icon || Clock

  return (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <StatusIcon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">
        No {statusConfig[status]?.label.toLowerCase()} gigs
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {status === "live"
          ? "You don't have any published gigs yet. Create your first gig to start earning!"
          : status === "draft"
          ? "No draft gigs found. Start creating a new gig to save it as draft."
          : `No ${statusConfig[status]?.label.toLowerCase()} gigs to display.`}
      </p>
      {(status === "live" || status === "draft") && (
        <Link href="/seller/manage/gigs/create-gig">
          <Button className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Gig
          </Button>
        </Link>
      )}
    </div>
  )
}

// Gig Details Modal Component
function GigDetailsModal({ gig }) {
  if (!gig) return null

  const formatRevisions = (revisions) => {
    return revisions === "unlimited" ? "Unlimited" : `${revisions} revision${revisions !== 1 ? 's' : ''}`
  }

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span>{gig.title}</span>
          <Badge className={statusConfig[gig.status]?.color}>
            {statusConfig[gig.status]?.label}
          </Badge>
        </DialogTitle>
        <DialogDescription>Gig ID: {gig._id}</DialogDescription>
      </DialogHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Column - Gig Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gig Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="mt-1">{gig.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="mt-1">{gig.category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Max Duration</label>
                  <p className="mt-1">{gig.maxDuration} minutes</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {gig.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {gig.packages?.map((pkg, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{pkg.name}</h4>
                    <p className="text-2xl font-bold text-green-600 mb-2">${pkg.price}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>🚚 {pkg.deliveryTime} days delivery</p>
                      <p>🔄 {formatRevisions(pkg.revisions)}</p>
                      <p>📹 {pkg.outputLength} min output</p>
                    </div>
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-600 mb-1">Features:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {pkg.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx}>✓ {feature.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                          ))}
                          {pkg.features.length > 3 && (
                            <li>+ {pkg.features.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          {gig.status === "live" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Analytics</CardTitle>
                <CardDescription>Last 30 days performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Eye className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="text-xl font-bold">{gig.impressions?.toLocaleString() || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Clicks</p>
                    <p className="text-xl font-bold">{gig.clicks || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Orders</p>
                    <p className="text-xl font-bold">{gig.orders || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Heart className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Favorites</p>
                    <p className="text-xl font-bold">{gig.favorites || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Settings & Actions */}
        <div className="space-y-6">
          {/* Gig Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gig Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className={statusConfig[gig.status]?.color}>
                  {statusConfig[gig.status]?.label}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Orders in Queue</span>
                <span className="text-sm">{gig.ordersInQueue || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">
                    {gig.rating?.average?.toFixed(1) || "0.0"} ({gig.rating?.count || 0})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gig Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gig Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Accept New Orders</p>
                  <p className="text-xs text-gray-600">Allow clients to place orders</p>
                </div>
                <Switch checked={gig.isAcceptingOrders} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Watermark Protection</p>
                  <p className="text-xs text-gray-600">Add watermark to previews</p>
                </div>
                <Switch checked={gig.hasWatermark} />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Gig
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Gig
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  )
}