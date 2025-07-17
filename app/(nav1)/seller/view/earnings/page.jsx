"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Download, Filter, Mail, MoreHorizontal,
  PiggyBank, TrendingUp, Wallet, BarChart3, Plus, Eye, Banknote
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import api from "@/lib/axios"

export default function EarningsPage() {
  const [earningsData, setEarningsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState("last-30-days")
  const [transactionFilter, setTransactionFilter] = useState("all")

  useEffect(() => {
    fetchEarnings()
  }, [])

  const fetchEarnings = async () => {
    try {
      console.log("[Frontend] Fetching seller earnings...")
      setLoading(true)
      const res = await api.get("/api/seller/earnings")
      console.log("[Frontend] Earnings data received:", res.data)
      setEarningsData(res.data)
    } catch (error) {
      console.error("[Frontend] Failed to fetch earnings:", error)
      // Handle error appropriately
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0)

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const getTransactionIcon = (type) => {
    switch (type) {
      case "earning": return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "payout": return <ArrowDownRight className="h-4 w-4 text-blue-600" />
      case "refund": return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      completed: { label: "Completed", color: "bg-green-100 text-green-800" },
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      succeeded: { label: "Completed", color: "bg-green-100 text-green-800" },
      failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    }[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const filteredTransactions = earningsData?.recentTransactions?.filter((tx) =>
    transactionFilter === "all" ? true : tx.type === transactionFilter
  ) || []

  const handleExport = async () => {
    try {
      console.log("[Frontend] Exporting earnings data...")
      // Implementation for export functionality
    } catch (error) {
      console.error("[Frontend] Export failed:", error)
    }
  }

  const handleEmailReport = async () => {
    try {
      console.log("[Frontend] Sending email report...")
      // Implementation for email report functionality
    } catch (error) {
      console.error("[Frontend] Email report failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading earnings data...</span>
        </div>
      </div>
    )
  }

  if (!earningsData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load earnings data. Please try again.</p>
          <Button onClick={fetchEarnings} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Financial Dashboard</h1>
          <p className="text-muted-foreground">Track your income, expenses, and manage payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="outline" onClick={handleEmailReport}>
            <Mail className="h-4 w-4 mr-2" /> Email Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="documents">Statements & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard 
              icon={<Wallet />} 
              title="Available Balance" 
              color="green"
              value={formatCurrency(earningsData.availableBalance)}
              subtitle={`${earningsData.totalOrders} completed orders`}
              showWithdrawButton={true}
              availableAmount={earningsData.availableBalance}
            />
            <SummaryCard 
              icon={<PiggyBank />} 
              title="Pending Clearance" 
              color="yellow"
              value={formatCurrency(earningsData.pendingClearance)}
              subtitle="Clearing in 7 days"
            />
            <SummaryCard 
              icon={<TrendingUp />} 
              title="Active Orders Value" 
              color="blue"
              value={formatCurrency(earningsData.activeOrdersValue)}
              subtitle="In progress"
            />
            <SummaryCard 
              icon={<DollarSign />} 
              title="Lifetime Earnings" 
              color="purple"
              value={formatCurrency(earningsData.totalEarnings)}
              subtitle={`Avg: ${formatCurrency(earningsData.averageOrderValue)}`}
            />
          </div>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link href="/earnings/available-balance">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Available Balance Details
                  </Button>
                </Link>
                <Link href="/earnings/pending-clearance">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Pending Clearance Details
                  </Button>
                </Link>
                <Link href="/earnings/withdraw">
                  <Button 
                    variant="default" 
                    className="flex items-center gap-2"
                    disabled={earningsData.availableBalance <= 0}
                  >
                    <Banknote className="h-4 w-4" />
                    Withdraw Earnings
                  </Button>
                </Link>
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* TRANSACTION HISTORY */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                      <SelectItem value="payout">Withdrawals</SelectItem>
                      <SelectItem value="refund">Refunds</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found for the selected filter.
                  </div>
                ) : (
                  filteredTransactions.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-full">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${tx.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(tx.status)}
                          {tx.fee && tx.fee > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Fee: {formatCurrency(tx.fee)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Documents</CardTitle>
              <CardDescription>Download statements & tax documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Monthly Statement</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Detailed breakdown of your earnings and transactions
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Statement
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Tax Documents</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    1099 forms and other tax-related documents
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Tax Docs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/** Simple summary card component */
function SummaryCard({ icon, title, color, value, subtitle, showWithdrawButton, availableAmount }) {
  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-${color}-500/10 rounded-full -translate-y-10 translate-x-10`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {showWithdrawButton && (
          <div className="mt-3 space-y-2">
            <Link href="/earnings/withdraw">
              <Button 
                size="sm" 
                className="w-full" 
                disabled={availableAmount <= 0}
              >
                <Banknote className="h-3 w-3 mr-2" />
                Withdraw Now
              </Button>
            </Link>
            <Link href="/earnings/available-balance">
              <Button size="sm" variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}