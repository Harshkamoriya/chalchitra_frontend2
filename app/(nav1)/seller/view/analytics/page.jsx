"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  Eye,
  Clock,
  CheckCircle,
  Download,
  Calendar,
  Target,
  Award,
  Zap,
  AlertCircle,
  Loader2,
  UserCheck
} from "lucide-react"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/app/(nav2)/context/UserContext"
import { useAuth } from "@/app/(nav2)/context/AuthContext"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AnalyticsPage() {
  const router = useRouter()
  const { user, activeRole } = useAuth()
  const {userData} = useUserContext();
  
  const [timeRange, setTimeRange] = useState("last-3-months")
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [performanceData, setPerformanceData] = useState(null)
  const [insightsData, setInsightsData] = useState(null)

    console.log(userData , "userdat")
    console.log(userData?.isSeller , "userdata seller")

      useEffect(()=>{
      fetchAnalyticsData();
    },[])
  // Check access permissions
  useEffect(() => {
    console.log("[Frontend] Checking user access - activeRole:", activeRole, "isSeller:", user?.isSeller)
    
    if (!user) {
      console.log("[Frontend] No user found, redirecting to login")
      router.push("/login")
      return
    }

    if (!userData) {
      console.log("[Frontend] No userData found, redirecting to login")
      // router.push("/login")
      console.log(userData)
      console.log(userData?.isSeller , "isSeller")
      return
    }

  

    if (activeRole !== "seller") {
      console.log("[Frontend] User is not in seller mode")
      return
    }

    if (!userData?.isSeller) {
      console.log("[Frontend] User is not a seller")
      return
    }
  }, [user, activeRole, router])

  // Fetch analytics data
  useEffect(() => {
    if (user && activeRole === "seller" && userData?.isSeller) {
      fetchAnalyticsData()
    }
  }, [timeRange, user, activeRole])

  const fetchAnalyticsData = async () => {
    try {
      console.log("[Frontend] Fetching analytics data for timeRange:", timeRange)
      setLoading(true)

      // Fetch overview data
      const overviewRes = await api.get("/api/seller/analytics/overview", {
        params: { timeRange }
      })

      // Fetch performance data
      const performanceRes = await api.get("/api/seller/analytics/performance", {
        params: { timeRange }
      })

      // Fetch insights data
      const insightsRes = await api.get("/api/seller/analytics/insights")

      console.log("[Frontend] Analytics data fetched successfully")

      if (overviewRes.data.success) {
        setAnalyticsData(overviewRes.data.data)
      }

      if (performanceRes.data.success) {
        setPerformanceData(performanceRes.data.data)
      }

      if (insightsRes.data.success) {
        setInsightsData(insightsRes.data.data)
      }

    } catch (error) {
      console.error("[Frontend] Error fetching analytics:", error)
      toast.error("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)
  }

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`
  }

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (growth < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return <div className="h-3 w-3" />
  }

  const getGrowthColor = (growth) => {
    if (growth > 0) return "text-green-600"
    if (growth < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Target className="h-4 w-4 text-blue-600" />
      default: return <Award className="h-4 w-4 text-purple-600" />
    }
  }

  const getInsightBgColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-purple-50 border-purple-200'
    }
  }

  const getInsightTextColor = (type) => {
    switch (type) {
      case 'positive': return 'text-green-800'
      case 'warning': return 'text-yellow-800'
      case 'info': return 'text-blue-800'
      default: return 'text-purple-800'
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === "earnings" ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const handleExport = async () => {
    try {
      console.log("[Frontend] Exporting analytics report...")
      toast.success("Export feature coming soon!")
    } catch (error) {
      console.error("[Frontend] Export failed:", error)
      toast.error("Export failed")
    }
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
          <p className="text-gray-600 mb-6">You need to be in seller mode to view analytics</p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Switch to Seller Mode
          </Button>
        </div>
      </div>
    )
  }

  if (!userData?.isSeller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Become a Seller</h1>
          <p className="text-gray-600 mb-6">You need to complete seller registration to view analytics</p>
          <Button onClick={() => router.push("/become-seller")} className="w-full">
            Become a Seller
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Performance Analytics</h1>
          <p className="text-muted-foreground">Track your business growth and optimize your services</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Business Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          <TabsTrigger value="insights">Growth Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Key Performance Indicators */}
          {analyticsData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalEarnings)}</p>
                      <div className="flex items-center gap-1 text-sm">
                        {getGrowthIcon(insightsData?.growthMetrics?.earningsGrowth || 0)}
                        <span className={`font-medium ${getGrowthColor(insightsData?.growthMetrics?.earningsGrowth || 0)}`}>
                          {insightsData?.growthMetrics?.earningsGrowth > 0 ? '+' : ''}{formatPercentage(insightsData?.growthMetrics?.earningsGrowth || 0)}
                        </span>
                        <span className="text-muted-foreground">vs last period</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Total Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{analyticsData.overview.totalOrders}</p>
                      <div className="flex items-center gap-1 text-sm">
                        {getGrowthIcon(insightsData?.growthMetrics?.orderGrowth || 0)}
                        <span className={`font-medium ${getGrowthColor(insightsData?.growthMetrics?.orderGrowth || 0)}`}>
                          {insightsData?.growthMetrics?.orderGrowth > 0 ? '+' : ''}{formatPercentage(insightsData?.growthMetrics?.orderGrowth || 0)}
                        </span>
                        <span className="text-muted-foreground">vs last period</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Avg Order Value
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{formatCurrency(analyticsData.overview.avgOrderValue)}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">Stable</span>
                        <span className="text-muted-foreground">performance</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Client Satisfaction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">{analyticsData.overview.clientSatisfaction.toFixed(1)}/5</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">Excellent</span>
                        <span className="text-muted-foreground">rating</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Trends Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Business Trends Overview</CardTitle>
                      <CardDescription>Track your key metrics over time</CardDescription>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Earnings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.trends}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          name="Earnings"
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Orders"
                          dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="completedOrders"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          name="Completed"
                          dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-xl font-bold">{formatPercentage(analyticsData.overview.completionRate)}</p>
                      <Progress value={analyticsData.overview.completionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {analyticsData.overview.completionRate > 90 ? 'Excellent' : 'Good'} performance
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Avg Delivery Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xl font-bold">{analyticsData.overview.avgDeliveryTime.toFixed(1)} days</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">Fast</span>
                        <span className="text-muted-foreground">delivery</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Repeat Clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xl font-bold">{formatPercentage(analyticsData.overview.repeatClientRate)}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">Growing</span>
                        <span className="text-muted-foreground">loyalty</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Profile Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xl font-bold">{analyticsData.overview.profileViews.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">+12.8%</span>
                        <span className="text-muted-foreground">vs last period</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-8">
          {performanceData && (
            <>
              {/* Service Category Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Category Performance</CardTitle>
                    <CardDescription>Revenue distribution by service type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {performanceData.categoryBreakdown.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={performanceData.categoryBreakdown}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name} ${value}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {performanceData.categoryBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No category data available</p>
                          <p className="text-sm">Complete some orders to see category breakdown</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Category Details</CardTitle>
                    <CardDescription>Detailed breakdown by service category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {performanceData.categoryBreakdown.length > 0 ? (
                      <div className="space-y-4">
                        {performanceData.categoryBreakdown.map((category, index) => (
                          <div key={category.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></div>
                                <span className="font-medium text-sm">{category.name}</span>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatCurrency(category.earnings)}</p>
                                <p className="text-xs text-muted-foreground">{category.orders} orders</p>
                              </div>
                            </div>
                            <Progress value={category.value} className="h-2" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No category data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance Comparison</CardTitle>
                  <CardDescription>Track your growth month over month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData.monthlyComparison}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="earnings" fill="#3b82f6" name="Earnings" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="orders" fill="#10b981" name="Orders" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Gigs */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Gigs</CardTitle>
                  <CardDescription>Your most successful services</CardDescription>
                </CardHeader>
                <CardContent>
                  {performanceData.topGigs.length > 0 ? (
                    <div className="space-y-4">
                      {performanceData.topGigs.map((gig, index) => (
                        <div key={gig.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{gig.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {gig.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(gig.earnings)}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{gig.orders} orders</span>
                              <span>•</span>
                              <span>{gig.conversionRate}% conversion</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No gig performance data available</p>
                      <p className="text-sm">Create and publish gigs to see performance metrics</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-8">
          {insightsData && (
            <>
              {/* Growth Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Key Insights
                    </CardTitle>
                    <CardDescription>AI-powered business insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {insightsData.insights.length > 0 ? (
                      insightsData.insights.map((insight, index) => (
                        <div key={index} className={`p-4 border rounded-lg ${getInsightBgColor(insight.type)}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {getInsightIcon(insight.type)}
                            <span className={`font-medium ${getInsightTextColor(insight.type)}`}>
                              {insight.title}
                            </span>
                          </div>
                          <p className={`text-sm ${getInsightTextColor(insight.type)}`}>
                            {insight.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No insights available yet</p>
                        <p className="text-sm">Complete more orders to get personalized insights</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Recommendations
                    </CardTitle>
                    <CardDescription>Actionable steps to grow your business</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {insightsData.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {insightsData.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              rec.priority === 'high' ? 'bg-red-500' : 
                              rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <div>
                              <p className="font-medium text-sm">{rec.title}</p>
                              <p className="text-xs text-muted-foreground">{rec.description}</p>
                              <Badge 
                                variant="outline" 
                                className={`mt-1 text-xs ${
                                  rec.priority === 'high' ? 'border-red-200 text-red-700' :
                                  rec.priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                                  'border-green-200 text-green-700'
                                }`}
                              >
                                {rec.priority} priority
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recommendations available</p>
                        <p className="text-sm">Keep growing your business to get personalized recommendations</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Performance Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Goals</CardTitle>
                  <CardDescription>Track your progress towards key business objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {insightsData.performanceGoals.map((goal, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{goal.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {goal.unit === 'currency' ? formatCurrency(goal.target) :
                             goal.unit === 'rating' ? `${goal.target}/5` :
                             `${goal.target}%`}
                          </span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {goal.unit === 'currency' ? formatCurrency(goal.current) :
                             goal.unit === 'rating' ? `${goal.current.toFixed(1)}/5` :
                             `${goal.current.toFixed(1)}%`} achieved
                          </span>
                          <span className="font-medium">{Math.round(goal.progress)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Business Health Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Health Summary</CardTitle>
                  <CardDescription>Overall health of your seller account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="font-semibold">{formatPercentage(insightsData.businessHealth.completionRate)}</p>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="h-8 w-8 text-yellow-600" />
                      </div>
                      <p className="font-semibold">{insightsData.businessHealth.avgRating.toFixed(1)}/5</p>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="font-semibold">{formatPercentage(insightsData.businessHealth.retentionRate)}</p>
                      <p className="text-sm text-muted-foreground">Client Retention</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Eye className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="font-semibold">{insightsData.businessHealth.activeGigs}</p>
                      <p className="text-sm text-muted-foreground">Active Gigs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}