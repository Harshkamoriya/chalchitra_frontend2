"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalEarnings: 5420.25,
    totalOrders: 47,
    avgOrderValue: 115.32,
    completionRate: 95.7,
    avgDeliveryTime: 3.2,
    clientSatisfaction: 4.8,
    repeatClientRate: 34.5,
    profileViews: 1250,
  },
  trends: [
    { date: "Jan 1", earnings: 320, orders: 3, views: 45, messages: 8, completedOrders: 2 },
    { date: "Jan 8", earnings: 480, orders: 4, views: 62, messages: 12, completedOrders: 4 },
    { date: "Jan 15", earnings: 650, orders: 6, views: 78, messages: 15, completedOrders: 5 },
    { date: "Jan 22", earnings: 420, orders: 4, views: 55, messages: 10, completedOrders: 3 },
    { date: "Jan 29", earnings: 780, orders: 7, views: 95, messages: 18, completedOrders: 6 },
    { date: "Feb 5", earnings: 920, orders: 8, views: 110, messages: 22, completedOrders: 7 },
    { date: "Feb 12", earnings: 1100, orders: 9, views: 125, messages: 25, completedOrders: 8 },
    { date: "Feb 19", earnings: 850, orders: 7, views: 88, messages: 16, completedOrders: 6 },
    { date: "Feb 26", earnings: 1250, orders: 11, views: 140, messages: 28, completedOrders: 10 },
    { date: "Mar 5", earnings: 1380, orders: 12, views: 155, messages: 30, completedOrders: 11 },
  ],
  categoryBreakdown: [
    { name: "Graphic Design", value: 35, earnings: 1897, orders: 16 },
    { name: "Web Development", value: 28, earnings: 1518, orders: 13 },
    { name: "Content Writing", value: 20, earnings: 1084, orders: 11 },
    { name: "Video Editing", value: 17, earnings: 921, orders: 7 },
  ],
  monthlyComparison: [
    { month: "Oct", earnings: 1200, orders: 12, avgRating: 4.6 },
    { month: "Nov", earnings: 1450, orders: 15, avgRating: 4.7 },
    { month: "Dec", earnings: 1680, orders: 18, avgRating: 4.8 },
    { month: "Jan", earnings: 1920, orders: 21, avgRating: 4.9 },
  ],
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last-3-months")
  const [activeTab, setActiveTab] = useState("overview")

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === "Earnings" ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
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
          <Button variant="outline">
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
                  <p className="text-2xl font-bold">{formatCurrency(mockAnalyticsData.overview.totalEarnings)}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+23.5%</span>
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
                  <p className="text-2xl font-bold">{mockAnalyticsData.overview.totalOrders}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+18.2%</span>
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
                  <p className="text-2xl font-bold">{formatCurrency(mockAnalyticsData.overview.avgOrderValue)}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+4.8%</span>
                    <span className="text-muted-foreground">vs last period</span>
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
                  <p className="text-2xl font-bold">{mockAnalyticsData.overview.clientSatisfaction}/5</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+0.3</span>
                    <span className="text-muted-foreground">vs last period</span>
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
                    <span>Profile Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Messages</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockAnalyticsData.trends}>
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
                      dataKey="views"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Profile Views"
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="messages"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Messages"
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
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
                  <p className="text-xl font-bold">{mockAnalyticsData.overview.completionRate}%</p>
                  <Progress value={mockAnalyticsData.overview.completionRate} className="h-2" />
                  <p className="text-xs text-muted-foreground">Excellent performance</p>
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
                  <p className="text-xl font-bold">{mockAnalyticsData.overview.avgDeliveryTime} days</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingDown className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">-0.5 days</span>
                    <span className="text-muted-foreground">faster</span>
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
                  <p className="text-xl font-bold">{mockAnalyticsData.overview.repeatClientRate}%</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+5.2%</span>
                    <span className="text-muted-foreground">vs last period</span>
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
                  <p className="text-xl font-bold">{mockAnalyticsData.overview.profileViews.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">+12.8%</span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-8">
          {/* Service Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Category Performance</CardTitle>
                <CardDescription>Revenue distribution by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAnalyticsData.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockAnalyticsData.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>Detailed breakdown by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.categoryBreakdown.map((category, index) => (
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
                  <BarChart data={mockAnalyticsData.monthlyComparison}>
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
        </TabsContent>

        <TabsContent value="insights" className="space-y-8">
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
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Strong Growth</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your earnings have increased by 23.5% compared to the previous period. Keep up the excellent work!
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">High Quality Service</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your 95.7% completion rate and 4.8/5 client satisfaction score indicate exceptional service quality.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Optimization Opportunity</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Consider focusing more on Graphic Design services as they show the highest profit margin.
                  </p>
                </div>
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
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Increase Service Pricing</p>
                      <p className="text-xs text-muted-foreground">
                        Your high satisfaction rate suggests you can increase prices by 10-15%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Expand Popular Services</p>
                      <p className="text-xs text-muted-foreground">
                        Create more gigs in Graphic Design as it's your top-performing category
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Improve Response Time</p>
                      <p className="text-xs text-muted-foreground">
                        Faster responses can increase your conversion rate by up to 20%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-sm">Client Retention Program</p>
                      <p className="text-xs text-muted-foreground">
                        Offer discounts to repeat clients to increase your 34.5% retention rate
                      </p>
                    </div>
                  </div>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Monthly Earnings Goal</span>
                    <span className="text-sm text-muted-foreground">$2,000</span>
                  </div>
                  <Progress value={75} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">$1,500 achieved</span>
                    <span className="font-medium">75%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Client Satisfaction</span>
                    <span className="text-sm text-muted-foreground">4.9/5</span>
                  </div>
                  <Progress value={96} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">4.8/5 current</span>
                    <span className="font-medium">96%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Order Completion</span>
                    <span className="text-sm text-muted-foreground">98%</span>
                  </div>
                  <Progress value={97.7} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">95.7% current</span>
                    <span className="font-medium">97.7%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
