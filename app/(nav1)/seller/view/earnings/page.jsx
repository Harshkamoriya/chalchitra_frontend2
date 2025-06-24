"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  Mail,
  MoreHorizontal,
  PiggyBank,
  TrendingUp,
  Wallet,
  BarChart3,
  Plus,
} from "lucide-react"

// Mock earnings data
const mockEarningsData = {
  availableBalance: 1250.75,
  pendingClearance: 450.0,
  activeOrdersValue: 680.5,
  totalEarnings: 5420.25,
  totalWithdrawn: 4169.5,
  totalExpenses: 125.8,
  monthlyEarnings: [
    { month: "Jan", earnings: 420, expenses: 15 },
    { month: "Feb", earnings: 680, expenses: 25 },
    { month: "Mar", earnings: 890, expenses: 20 },
    { month: "Apr", earnings: 1200, expenses: 30 },
    { month: "May", earnings: 950, expenses: 18 },
    { month: "Jun", earnings: 1280, expenses: 17.8 },
  ],
}

const mockTransactions = [
  {
    id: "TXN-001",
    type: "earning",
    description: "Logo Design Project - Sarah Johnson",
    amount: 150.0,
    status: "completed",
    date: "2024-01-22",
    orderId: "ORD-001",
    fee: 7.5,
  },
  {
    id: "TXN-002",
    type: "earning",
    description: "Website Development - Mike Chen",
    amount: 450.0,
    status: "pending",
    date: "2024-01-21",
    orderId: "ORD-002",
    fee: 22.5,
  },
  {
    id: "TXN-003",
    type: "withdrawal",
    description: "Bank Transfer - Chase ****1234",
    amount: -300.0,
    status: "completed",
    date: "2024-01-20",
    fee: 2.5,
  },
  {
    id: "TXN-004",
    type: "earning",
    description: "Social Media Package - Emma Wilson",
    amount: 200.0,
    status: "clearing",
    date: "2024-01-19",
    orderId: "ORD-003",
    fee: 10.0,
  },
  {
    id: "TXN-005",
    type: "expense",
    description: "Platform Service Fee",
    amount: -15.8,
    status: "completed",
    date: "2024-01-18",
  },
]

const mockPayoutMethods = [
  {
    id: "PM-001",
    type: "bank",
    name: "Chase Bank",
    details: "****1234",
    isDefault: true,
  },
  {
    id: "PM-002",
    type: "paypal",
    name: "PayPal",
    details: "john@example.com",
    isDefault: false,
  },
]

export default function EarningsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("last-30-days")
  const [transactionFilter, setTransactionFilter] = useState("all")

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case "earning":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case "withdrawal":
        return <ArrowDownRight className="h-4 w-4 text-blue-600" />;
      case "expense":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: "Completed", color: "bg-green-100 text-green-800" },
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      clearing: { label: "Clearing", color: "bg-blue-100 text-blue-800" },
      failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>;
  }

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (transactionFilter === "all") return true
    return transaction.type === transactionFilter
  })

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">Track your income, expenses, and manage payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Summary
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="documents">Statements & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Available Balance */}
            <Card className="relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Available Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockEarningsData.availableBalance)}
                  </p>
                  <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1">
                      <CreditCard className="h-3 w-3 mr-2" />
                      Withdraw
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => (window.location.href = "/earnings/available-balance")}>
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Earnings */}
            <Card className="relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PiggyBank className="h-4 w-4" />
                  Pending Clearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(mockEarningsData.pendingClearance)}
                  </p>
                  <p className="text-xs text-muted-foreground">Processing payments</p>
                  <div className="flex items-center gap-1 mt-2 mb-3">
                    <div className="h-1 bg-yellow-200 rounded-full flex-1">
                      <div className="h-1 bg-yellow-500 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-muted-foreground">2-3 days</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = "/earnings/pending-clearance")}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Orders Value */}
            <Card className="relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Active Orders Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(mockEarningsData.activeOrdersValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">From ongoing projects</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-2 mb-3">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12% from last month</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = "/earnings/active-orders")}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Total Lifetime Earnings */}
            <Card className="relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <CardHeader className="pb-2">
                <CardTitle
                  className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Lifetime Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-purple-600">{formatCurrency(mockEarningsData.totalEarnings)}</p>
                  <p className="text-xs text-muted-foreground">Since joining Chalchitra</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>Growing steadily</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Chart and Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earnings Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Earnings Trend</CardTitle>
                    <CardDescription>Monthly earnings and expenses over time</CardDescription>
                  </div>
                  <Select value={dateRange} onValueChange={setDateRange}>
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
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="h-64 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive earnings chart would appear here</p>
                    <p className="text-sm text-muted-foreground mt-1">Showing monthly trends and projections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Breakdown</CardTitle>
                <CardDescription>Your money at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Total Earned</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(mockEarningsData.totalEarnings)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium">Withdrawn</span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(mockEarningsData.totalWithdrawn)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium">Fees & Expenses</span>
                    </div>
                    <span className="font-semibold text-red-600">{formatCurrency(mockEarningsData.totalExpenses)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Net Available</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(mockEarningsData.availableBalance + mockEarningsData.pendingClearance)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payout Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payout Methods</CardTitle>
                  <CardDescription>Manage how you receive your earnings</CardDescription>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPayoutMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg ${method.isDefault ? "border-primary bg-primary/5" : "border-border"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">{method.name}</span>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Set as Default</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div
                className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent financial activity</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="earning">Earnings</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="expense">Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                          {transaction.orderId && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <Badge variant="outline" className="text-xs">
                                {transaction.orderId}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(transaction.status)}
                        {transaction.fee && (
                          <span className="text-xs text-muted-foreground">Fee: {formatCurrency(transaction.fee)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center pt-4">
                <Button variant="outline">Load More Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Documents</CardTitle>
              <CardDescription>Download your statements, invoices, and tax documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div
                  className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Document Center</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Access your monthly statements, annual tax documents, and detailed transaction reports.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Monthly Statement
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Tax Documents
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Transaction Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
