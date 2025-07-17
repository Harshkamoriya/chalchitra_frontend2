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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  MessageSquare,
  Search,
  Star,
  CheckCircle,
  Send,
  Loader2
} from "lucide-react"

import api from "@/lib/axios"

export default function AvailableBalancePage() {
  const [availableBalanceData, setAvailableBalanceData] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalAvailable: 0,
    totalFees: 0,
    orderCount: 0
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [chatDialogOpen, setChatDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    fetchAvailableBalance()
  }, [searchQuery, sortBy])

  const fetchAvailableBalance = async () => {
    try {
      console.log("[Frontend] Fetching available balance details...")
      setLoading(true)
      
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (sortBy) params.append('sortBy', sortBy)
      
      const res = await api.get(`/api/seller/available-balance?${params}`)
      console.log("[Frontend] Available balance data received:", res.data)
      
      setAvailableBalanceData(res.data.orders || [])
      setSummary({
        totalAvailable: res.data.totalAvailable || 0,
        totalFees: res.data.totalFees || 0,
        orderCount: res.data.orderCount || 0
      })
    } catch (error) {
      console.error("[Frontend] Failed to fetch available balance:", error)
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
      console.log("[Frontend] Exporting available balance data...")
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
          <span className="ml-2">Loading available balance details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/seller/view/earnings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Earnings
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Available Balance Details</h1>
          <p className="text-muted-foreground">Funds ready for withdrawal from completed orders</p>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(summary.totalAvailable)}
              </p>
              <p className="text-sm text-muted-foreground">Total Available</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">{summary.orderCount}</p>
              <p className="text-sm text-muted-foreground">Completed Orders</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold">{formatCurrency(summary.totalFees)}</p>
              <p className="text-sm text-muted-foreground">Total Fees</p>
            </div>
            <div className="text-center">
              <Button className="w-full" disabled={summary.totalAvailable === 0}>
                <Download className="h-4 w-4 mr-2" />
                Withdraw All
              </Button>
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
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="amount">Sort by Amount</SelectItem>
                <SelectItem value="client">Sort by Client</SelectItem>
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
            {availableBalanceData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No available balance found.
              </div>
            ) : (
              availableBalanceData.map((item) => (
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

                      {/* Dates */}
                      <div className="lg:col-span-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {formatDate(item.order.completedDate)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Cleared {formatDate(item.order.clearedDate)}
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="lg:col-span-2 text-right">
                        <p className="font-bold text-green-600">{formatCurrency(item.netAmount)}</p>
                        <p className="text-xs text-muted-foreground">Fee: {formatCurrency(item.fee)}</p>
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

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Delivery Time</label>
                                <p className="text-sm font-medium">{item.gig.deliveryTime} days</p>
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Revisions</label>
                                <p className="text-sm font-medium">{item.gig.revisions} included</p>
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

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">Member Since</label>
                              <p className="text-sm">{formatDate(item.client.joinDate)}</p>
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