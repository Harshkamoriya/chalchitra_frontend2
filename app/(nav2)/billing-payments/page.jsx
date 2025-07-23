"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Search,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import api from "@/lib/axios"

export default function BillingPaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [transactions, setTransactions] = useState([])
  const [billingSummary, setBillingSummary] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  // Filters
  const [orderStatus, setOrderStatus] = useState("all")
  const [transactionType, setTransactionType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Pagination
  const [orderPagination, setOrderPagination] = useState({})
  const [transactionPagination, setTransactionPagination] = useState({})

  console.log("BillingPaymentsPage component mounted")

  // Fetch billing summary
  const fetchBillingSummary = async () => {
    console.log("Fetching billing summary...")
    try {
      const response = await api.get("/api/buyer/billing-summary")
      const data  = response.data

      console.log("Billing summary response:", data)

      if (data.success) {
        setBillingSummary(data.summary)
      } else {
        console.log("Failed to fetch billing summary:", data.error)
      }
    } catch (error) {
      console.log("Error fetching billing summary:", error)
    }
  }

  // Fetch orders
  const fetchOrders = async (page = 1, status = "all") => {
    console.log("Fetching orders - page:", page, "status:", status)
    try {
      const token = localStorage.getItem("token")
      const response = await api.get(`/api/buyer/orders?page=${page}&status=${status}&limit=10`)

      const data = response.data;
      console.log("Orders response:", data)

      if (data.success) {
        setOrders(data.orders)
        setOrderPagination(data.pagination)
      } else {
        console.log("Failed to fetch orders:", data.error)
      }
    } catch (error) {
      console.log("Error fetching orders:", error)
    }
  }

  // Fetch transactions
  const fetchTransactions = async (page = 1, type = "all") => {
    console.log("Fetching transactions - page:", page, "type:", type)
    try {
    //   const token = localStorage.getItem("token")
      const response = await api.get(`/api/buyer/transactions?page=${page}&type=${type}&limit=20`)

      const data = response.data
      console.log("Transactions response:", data)

      if (data.success) {
        setTransactions(data.transactions)
        setTransactionPagination(data.pagination)
      } else {
        console.log("Failed to fetch transactions:", data.error)
      }
    } catch (error) {
      console.log("Error fetching transactions:", error)
    }
  }

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      console.log("Loading initial data...")
      setLoading(true)

      await Promise.all([fetchBillingSummary(), fetchOrders(), fetchTransactions()])

      setLoading(false)
      console.log("Initial data loaded")
    }

    loadData()
  }, [])

  // Handle filter changes
  useEffect(() => {
    if (!loading) {
      console.log("Order status filter changed:", orderStatus)
      fetchOrders(1, orderStatus)
    }
  }, [orderStatus])

  useEffect(() => {
    if (!loading) {
      console.log("Transaction type filter changed:", transactionType)
      fetchTransactions(1, transactionType)
    }
  }, [transactionType])

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100) // Assuming amount is in cents
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get status badge variant
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", icon: Clock },
      active: { variant: "default", icon: AlertCircle },
      completed: { variant: "success", icon: CheckCircle },
      cancelled: { variant: "destructive", icon: XCircle },
      delivered: { variant: "success", icon: CheckCircle },
      revision: { variant: "warning", icon: AlertCircle },
    }

    const config = statusConfig[status] || { variant: "secondary", icon: Clock }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing & Payments</h1>
        <p className="text-gray-600">Manage your orders, transactions, and payment history</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {billingSummary && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(billingSummary.overall.totalSpent)}</div>
                    <p className="text-xs text-muted-foreground">Across {billingSummary.overall.totalOrders} orders</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(billingSummary.thisMonth.monthlySpent)}</div>
                    <p className="text-xs text-muted-foreground">
                      {billingSummary.thisMonth.monthlyOrders} orders this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(billingSummary.overall.avgOrderValue || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Average per order</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{billingSummary.overall.completedOrders}</div>
                    <p className="text-xs text-muted-foreground">Successfully completed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest payment activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingSummary.recentTransactions.map((transaction) => (
                      <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{transaction.orderId?.gig?.title || "Order Payment"}</p>
                            <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                          <Badge variant={transaction.status === "succeeded" ? "success" : "secondary"}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Spending */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Your top spending categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {billingSummary.categorySpending.map((category, index) => (
                      <div key={category._id || index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{category._id || "Uncategorized"}</p>
                          <p className="text-sm text-gray-500">{category.orderCount} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(category.totalSpent)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <Select value={orderStatus} onValueChange={setOrderStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={order.gig?.images?.[0] || "/placeholder.svg?height=60&width=60"}
                        alt={order.gig?.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{order.gig?.title}</h3>
                        <p className="text-gray-600">by {order.seller?.name}</p>
                        <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(order.price)}</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Package</p>
                      <p className="font-medium">{order.selectedPackage?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{formatDate(order.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Order Date</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {orderPagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                disabled={!orderPagination.hasPrev}
                onClick={() => fetchOrders(orderPagination.currentPage - 1, orderStatus)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {orderPagination.currentPage} of {orderPagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!orderPagination.hasNext}
                onClick={() => fetchOrders(orderPagination.currentPage + 1, orderStatus)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export Transactions
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "payment"
                            ? "bg-blue-100"
                            : transaction.type === "refund"
                              ? "bg-green-100"
                              : "bg-gray-100"
                        }`}
                      >
                        <CreditCard
                          className={`w-5 h-5 ${
                            transaction.type === "payment"
                              ? "text-blue-600"
                              : transaction.type === "refund"
                                ? "text-green-600"
                                : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.orderId?.gig?.title || "Transaction"}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} •{" "}
                          {formatDate(transaction.createdAt)}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {transaction.paymentIntentId || transaction._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === "refund" ? "text-green-600" : ""}`}>
                        {transaction.type === "refund" ? "+" : "-"}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                      <Badge
                        variant={
                          transaction.status === "succeeded"
                            ? "success"
                            : transaction.status === "failed"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Pagination */}
          {transactionPagination.totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                disabled={!transactionPagination.hasPrev}
                onClick={() => fetchTransactions(transactionPagination.currentPage - 1, transactionType)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {transactionPagination.currentPage} of {transactionPagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!transactionPagination.hasNext}
                onClick={() => fetchTransactions(transactionPagination.currentPage + 1, transactionType)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {billingSummary && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Spending Trend</CardTitle>
                    <CardDescription>Your spending pattern over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {billingSummary.monthlyTrend.map((month, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {new Date(month._id.year, month._id.month - 1).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-gray-500">{month.orders} orders</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(month.spent)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Spending Comparison</CardTitle>
                    <CardDescription>This month vs last month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">This Month</span>
                          <span className="font-medium">{formatCurrency(billingSummary.thisMonth.monthlySpent)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (billingSummary.thisMonth.monthlySpent / Math.max(billingSummary.thisMonth.monthlySpent, billingSummary.lastMonth.lastMonthSpent)) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">Last Month</span>
                          <span className="font-medium">{formatCurrency(billingSummary.lastMonth.lastMonthSpent)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-400 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (billingSummary.lastMonth.lastMonthSpent / Math.max(billingSummary.thisMonth.monthlySpent, billingSummary.lastMonth.lastMonthSpent)) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500">
                          {billingSummary.thisMonth.monthlySpent > billingSummary.lastMonth.lastMonthSpent
                            ? `You spent ${formatCurrency(billingSummary.thisMonth.monthlySpent - billingSummary.lastMonth.lastMonthSpent)} more this month`
                            : `You spent ${formatCurrency(billingSummary.lastMonth.lastMonthSpent - billingSummary.thisMonth.monthlySpent)} less this month`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Yearly Overview</CardTitle>
                  <CardDescription>Your spending summary for {new Date().getFullYear()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(billingSummary.yearly.yearlySpent)}
                      </p>
                      <p className="text-sm text-gray-500">Total Spent This Year</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{billingSummary.yearly.yearlyOrders}</p>
                      <p className="text-sm text-gray-500">Orders This Year</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {formatCurrency(billingSummary.yearly.yearlySpent / billingSummary.yearly.yearlyOrders || 0)}
                      </p>
                      <p className="text-sm text-gray-500">Avg Order Value</p>
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
