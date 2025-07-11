"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import AccessToken from "twilio/lib/jwt/AccessToken"



const statusConfig = {
  live: { label: "Live", color: "bg-green-100 text-green-800", icon: CheckCircle },
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: Edit },
  pending: { label: "Under Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  requires_modification: { label: "Needs Changes", color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  paused: { label: "Paused", color: "bg-blue-100 text-blue-800", icon: Pause },
  denied: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
}

const tabConfig = {
  live: { label: "Published", count: 1, icon: CheckCircle },
  draft: { label: "Drafts", count: 1, icon: Edit },
  pending: { label: "Under Review", count: 1, icon: Clock },
  requires_modification: { label: "Needs Changes", count: 1, icon: AlertTriangle },
  paused: { label: "Paused", count: 1, icon: Pause },
  denied: { label: "Rejected", count: 0, icon: XCircle },
}

export default function GigsPage() {
  const [activeTab, setActiveTab] = useState("live")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [acceptingCustomOrders, setAcceptingCustomOrders] = useState(true)
  const [selectedGig, setSelectedGig] = useState(null)
  const [gigs, setGigs] = useState([]);
const [page, setPage] = useState(1);
const [pages, setPages] = useState(1); // total pages from backend
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchGigs = async () => {
     console.log("activeTab changed to:", activeTab);
  console.log("page changed to:", page);
    setLoading(true);
    try {
      console.log("inside the fetchgigs function")
      const token =  sessionStorage.getItem("accessToken");
      const res = await axios.get(`/api/user/gigs?status=${activeTab}&page=${page}&limit=10`,
       { headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Assuming you store token in localStorage
      }
    })
    const data = res.data;
    console.log(data  ,"data");
      if (data.success) {
        setGigs(data.gigs);
        setPages(data.pagination.pages);
        console.log(data, 
          'data'
        )
      }
    } catch (error) {
console.error("Error fetching gigs:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchGigs();
}, [activeTab, page]);


const filteredGigs = useMemo(() => {
  let filtered = gigs;

  // Search
  if (searchQuery) {
    filtered = filtered.filter((gig) =>
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Sort
  filtered = filtered.slice().sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastModified) - new Date(a.lastModified);
      case "performance":
        return b.impressions - a.impressions;
      case "price":
        return b.price - a.price;
      case "orders":
        return b.orders - a.orders;
      default:
        return 0;
    }
  });

  return filtered;
}, [gigs, searchQuery, sortBy]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const getConversionRate = (clicks, orders) => {
    if (clicks === 0) return 0
    return ((orders / clicks) * 100).toFixed(1);
  }

  const GigCard = ({ gig }) => {
    const StatusIcon = statusConfig[gig.status]?.icon || Clock
    const conversionRate = getConversionRate(gig.clicks, gig.orders)

    return (
      <Card className="hover:shadow-lg transition-all duration-200 group">
        <CardContent className="p-0">
          {/* Gig Image */}
          <div
            className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg overflow-hidden">
            <img
              src={gig.images || "/a.jpg"}
              alt={gig.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
            <div className="absolute top-3 left-3">
              <Badge className={statusConfig[gig.status]?.color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[gig.status]?.label}
              </Badge>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              {gig.rating > 0 && (
                <Badge variant="secondary" className="bg-white/90">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {gig.rating}
                </Badge>
              )}
            </div>
          </div>

          {/* Gig Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {gig.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{gig.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {gig.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{gig.deliveryTime} days delivery</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            {gig.status === "live" && (
              <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="font-semibold text-sm">{gig.impressions.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="font-semibold text-sm">{gig.clicks}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="font-semibold text-sm">{gig.orders}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Rate</p>
                  <p className="font-semibold text-sm">{conversionRate}%</p>
                </div>
              </div>
            )}

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">${gig.price}</p>
                {gig.ordersInQueue > 0 && <p className="text-xs text-muted-foreground">{gig.ordersInQueue} in queue</p>}
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedGig(gig)}
                      className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Details
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
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Service
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
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
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  // const gigcard end here it was code about gigcard

  //nos gigdetails modal is begining

  const GigDetailsModal = ({ gig }) => {
    if (!gig) return null

    return (
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{gig.title}</span>
            <Badge className={statusConfig[gig.status]?.color}>{statusConfig[gig.status]?.label}</Badge>
          </DialogTitle>
          <DialogDescription>Service ID: {gig._id}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Service Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="mt-1">{gig.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p className="mt-1">{gig.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subcategory</label>
                    <p className="mt-1">{gig.subcategory}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {gig.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Eye className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Impressions</p>
                      <p className="text-xl font-bold">{gig.impressions.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Users className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Clicks</p>
                      <p className="text-xl font-bold">{gig.clicks}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-xl font-bold">{gig.orders}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Heart className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-sm text-muted-foreground">Favorites</p>
                      <p className="text-xl font-bold">{gig.favorites}</p>
                    </div>
                  </div>
                  <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Performance chart would appear here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Settings & Status */}
          <div className="space-y-6">
            {/* Service Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Status</span>
                  <Badge className={statusConfig[gig.status]?.color}>{statusConfig[gig.status]?.label}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Delivery Time</span>
                  <span className="text-sm">{gig.deliveryTime} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Orders in Queue</span>
                  <span className="text-sm">{gig.ordersInQueue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Price</span>
                  <span className="text-lg font-bold">${gig.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* Service Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Accept New Orders</p>
                    <p className="text-xs text-muted-foreground">Allow clients to place orders</p>
                  </div>
                  <Switch checked={gig.isAcceptingOrders} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Watermark Protection</p>
                    <p className="text-xs text-muted-foreground">Add watermark to previews</p>
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
                  Edit Service
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    );
  }

  //  gig details modal end here

  const EmptyState = ({ tab }) => {
    const TabIcon = tabConfig[tab]?.icon

    return (
      <div className="text-center py-16">
        <div
          className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          {TabIcon && <TabIcon className="h-8 w-8 text-muted-foreground" />}
        </div>
        <h3 className="text-xl font-semibold mb-2">No {tabConfig[tab]?.label.toLowerCase()} services</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {tab === "live"
            ? "You don't have any published services yet. Create your first service to start earning!"
            : tab === "draft"
              ? "No draft services found. Start creating a new service to save it as draft."
              : `No ${tabConfig[tab]?.label.toLowerCase()} services to display.`}
        </p>
        {tab === "live" || tab === "draft" ? (
          <Link href="/users/harshkamoriya/handle_gigs/create_gig">
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Service
            </Button>
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Service Portfolio</h1>
          <p className="text-muted-foreground">Manage and track your creative services</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Custom Orders Toggle */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                checked={acceptingCustomOrders}
                onCheckedChange={setAcceptingCustomOrders} />
              <span className="text-sm font-medium">Accepting Custom Requests</span>
            </div>
          </div>

          {/* Create Gig Button */}
          <Link href="gigs/create_gigs">
            <Button
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4" />
              Create New Service
            </Button>
          </Link>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services, categories, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10" />
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
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-xl font-bold">{tabConfig.live.count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Drafts</p>
                <p className="text-xl font-bold">{tabConfig.draft.count}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{gigs.reduce((sum, gig) => sum + gig.orders, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-xl font-bold">{gigs.reduce((sum, gig) => sum + gig.impressions, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Services Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
          {Object.entries(tabConfig).map(([key, config]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-1 text-xs md:text-sm">
              <config.icon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{config.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {config.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(tabConfig).map((tab) => (
          <TabsContent key={tab} value={tab}>
            {filteredGigs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGigs.map((gig) => (
                  <GigCard key={gig._id} gig={gig} />
                ))}
              </div>
            ) : (
              <EmptyState tab={tab} />
            )}
          </TabsContent>
          
        ))}
        <div className="flex justify-center items-center mt-6 gap-2">
  <Button
    disabled={page <= 1}
    onClick={() => setPage((p) => p - 1)}
    variant="outline"
    size="sm"
  >
    Prev
  </Button>
  <span className="text-sm">
    Page {page} of {pages}
  </span>
  <Button
    disabled={page >= pages}
    onClick={() => setPage((p) => p + 1)}
    variant="outline"
    size="sm"
  >
    Next
  </Button>
</div>
      </Tabs>
      {/* Gig Details Modal */}
      <Dialog>
        <GigDetailsModal gig={selectedGig} />
      </Dialog>
    </div>
  );
}
