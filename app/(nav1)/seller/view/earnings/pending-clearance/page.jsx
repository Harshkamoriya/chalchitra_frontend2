"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  MessageSquare,
  Search,
  Star,
  CheckCircle,
  Send,
  AlertCircle,
  Loader2
} from "lucide-react"

import api from "@/lib/axios"

export default function PendingClearancePage() {
  const [pendingData, setPendingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalPending: 0,
    totalFees: 0,
    orderCount: 0,
    avgClearanceTime: 0
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("clearance-date")
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    fetchPendingClearance()
  }, [searchQuery, sortBy])

  const fetchPendingClearance = async () => {
    try {
      console.log("[Frontend] Fetching pending clearance details...")
      setLoading(true)
      
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (sortBy) params.append('sortBy', sortBy)
      
      const res = await api.get(`/api/seller/pending-clearance?${params}`)
      console.log("[Frontend] Pending clearance data received:", res.data)
      
      setPendingData(res.data.orders || [])
      setSummary({
        totalPending: res.data.totalPending || 0,
        totalFees: res.data.totalFees || 0,
        orderCount: res.data.orderCount || 0,
        avgClearanceTime: res.data.avgClearanceTime || 0
      })
    } catch (error) {
      console.error("[Frontend] Failed to fetch pending clearance:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const openChatDialog = (client, chatHistory) => {
    setSelectedClient({ ...client, chatHistory })
    setChatDialogOpen(true)
  }

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        console.log("[Frontend] Sending message:", newMessage)
        // Here you would implement the message sending API call
        // await api.post('/api/messages', { ... })
        setNewMessage("")
      } catch (error) {
        console.error("[Frontend] Failed to send message:", error)
      }
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
      />
    ));
  }

  const handleExport = async () => {
    try {
      console.log("[Frontend] Exporting pending clearance data...")
      // Implementation for export functionality
    } catch (error) {
      console.error("[Frontend] Export failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading pending clearance details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/earnings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Earnings
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pending Clearance Details</h1>
          <p className="text-muted-foreground">Payments currently being processed</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {formatCurrency(summary.totalPending)}
              </p>
              <p className="text-sm text-muted-foreground">Total Pending</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">{summary.orderCount}</p>
              <p className="text-sm text-muted-foreground">Orders Clearing</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">
                {summary.avgClearanceTime > 0 ? `${Math.ceil(summary.avgClearanceTime)} days` : '2-3 days'}
              </p>
              <p className="text-sm text-muted-foreground">Avg. Clearance Time</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Processing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clearance-date">Sort by Clearance Date</SelectItem>
                <SelectItem value="amount">Sort by Amount</SelectItem>
                <SelectItem value="completion-date">Sort by Completion</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardContent className="p-0">
          <div className="space-y-0">
            {pendingData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending clearance orders found.
              </div>
            ) : (
              pendingData.map((item) => (
                <div key={item.id} className="border-b last:border-b-0">
                  {/* Main Row */}
                  <div className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Client Info */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={item.client.avatar} alt={item.client.name} />
                            <AvatarFallback className="text-sm">
                              {getInitials(item.client.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.client.name}</p>
                            <p className="text-sm text-muted-foreground">@{item.client.username}</p>
                          </div>
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="lg:col-span-3">
                        <p className="font-medium text-sm">{item.gig.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.order.id.slice(-8)}
                        </Badge>
                      </div>

                      {/* Clearance Progress */}
                      <div className="lg:col-span-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Clearance Progress</span>
                            <span className="font-medium">{item.order.clearanceProgress}%</span>
                          </div>
                          <Progress value={item.order.clearanceProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Expected: {formatDate(item.order.expectedClearance)}
                          </p>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="lg:col-span-2 text-right">
                        <p className="font-bold text-yellow-600">{formatCurrency(item.netAmount)}</p>
                        <p className="text-xs text-muted-foreground">Fee: {formatCurrency(item.fee)}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Clock className="h-3 w-3 text-yellow-600" />
                          <span className="text-xs text-yellow-600">
                            {item.daysRemaining} day{item.daysRemaining !== 1 ? "s" : ""} left
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-2 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openChatDialog(item.client, item.chatHistory)}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Chat
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleRowExpansion(item.id)}>
                          {expandedRows.has(item.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <Collapsible open={expandedRows.has(item.id)}>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 bg-muted/30">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Order Details */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-sm">Order Details</h4>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Client Requirements</label>
                              <p className="text-sm mt-1 p-3 bg-background rounded border">
                                {item.order.requirements}
                              </p>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Deliverables</label>
                              <ul className="text-sm mt-1 space-y-1">
                                {item.order.deliverables.map((deliverable, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    {deliverable}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Completed</label>
                                <p className="text-sm font-medium">{formatDate(item.order.completedDate)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Expected</label>
                                <p className="text-sm font-medium">{formatDate(item.order.expectedClearance)}</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Days Left</label>
                                <p className="text-sm font-medium text-yellow-600">{item.daysRemaining}</p>
                              </div>
                            </div>
                          </div>

                          {/* Client Feedback & Rating */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-sm">Client Feedback</h4>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Rating</label>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">{renderStars(item.order.clientRating)}</div>
                                <span className="text-sm font-medium">{item.order.clientRating}/5</span>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Review</label>
                              <p className="text-sm mt-1 p-3 bg-background rounded border italic">
                                "{item.order.clientReview}"
                              </p>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Payment Status</label>
                              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  <span className="text-sm font-medium text-yellow-800">Payment Processing</span>
                                </div>
                                <p className="text-xs text-yellow-700">
                                  Your payment is being processed and will be available for withdrawal once cleared.
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Client Stats</label>
                              <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                  <p className="text-sm font-medium">{item.client.totalOrders}</p>
                                  <p className="text-xs text-muted-foreground">Total Orders</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{item.client.avgRating}/5</p>
                                  <p className="text-xs text-muted-foreground">Avg Rating Given</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      <Dialog open={chatDialogOpen} onOpenChange={setChatDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat with {selectedClient?.name}
            </DialogTitle>
            <DialogDescription>Continue your conversation about the project</DialogDescription>
          </DialogHeader>

          {selectedClient && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20 rounded-lg mb-4">
                {selectedClient.chatHistory?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "seller" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === "seller" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background border"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">{formatDateTime(message.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button onClick={sendMessage} className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}