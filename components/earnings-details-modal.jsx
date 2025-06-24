"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, DollarSign, Search, Download } from "lucide-react"
import { useState } from "react"

// Mock detailed data for each category
const mockDetailedData = {
  available: [
    {
      id: "AVL-001",
      client: {
        name: "Sarah Johnson",
        username: "sarah_creative",
        avatar: null,
      },
      gig: "Professional Logo Design Package",
      orderId: "ORD-001",
      completedDate: "2024-01-20",
      clearedDate: "2024-01-22",
      amount: 150.0,
      fee: 7.5,
      netAmount: 142.5,
      status: "available",
    },
    {
      id: "AVL-002",
      client: {
        name: "David Rodriguez",
        username: "david_business",
        avatar: null,
      },
      gig: "Business Presentation Design",
      orderId: "ORD-004",
      completedDate: "2024-01-15",
      clearedDate: "2024-01-17",
      amount: 120.0,
      fee: 6.0,
      netAmount: 114.0,
      status: "available",
    },
    {
      id: "AVL-003",
      client: {
        name: "Lisa Thompson",
        username: "lisa_startup",
        avatar: null,
      },
      gig: "Mobile App UI/UX Design",
      orderId: "ORD-005",
      completedDate: "2024-01-12",
      clearedDate: "2024-01-14",
      amount: 350.0,
      fee: 17.5,
      netAmount: 332.5,
      status: "available",
    },
  ],
  pending: [
    {
      id: "PND-001",
      client: {
        name: "Mike Chen",
        username: "mike_tech",
        avatar: null,
      },
      gig: "Website Development",
      orderId: "ORD-002",
      completedDate: "2024-01-21",
      expectedClearance: "2024-01-24",
      amount: 450.0,
      fee: 22.5,
      netAmount: 427.5,
      status: "clearing",
      daysRemaining: 2,
    },
    {
      id: "PND-002",
      client: {
        name: "Emma Wilson",
        username: "emma_marketing",
        avatar: null,
      },
      gig: "Social Media Content Package",
      orderId: "ORD-003",
      completedDate: "2024-01-19",
      expectedClearance: "2024-01-22",
      amount: 200.0,
      fee: 10.0,
      netAmount: 190.0,
      status: "clearing",
      daysRemaining: 1,
    },
  ],
  active: [
    {
      id: "ACT-001",
      client: {
        name: "James Park",
        username: "james_agency",
        avatar: null,
      },
      gig: "Video Editing & Motion Graphics",
      orderId: "ORD-006",
      startDate: "2024-01-18",
      dueDate: "2024-01-25",
      amount: 280.0,
      progress: 65,
      status: "in-progress",
      daysRemaining: 3,
    },
    {
      id: "ACT-002",
      client: {
        name: "Anna Martinez",
        username: "anna_blogger",
        avatar: null,
      },
      gig: "Content Writing & SEO",
      orderId: "ORD-007",
      startDate: "2024-01-20",
      dueDate: "2024-01-27",
      amount: 95.0,
      progress: 40,
      status: "in-progress",
      daysRemaining: 5,
    },
    {
      id: "ACT-003",
      client: {
        name: "Robert Kim",
        username: "robert_ecom",
        avatar: null,
      },
      gig: "E-commerce Store Setup",
      orderId: "ORD-008",
      startDate: "2024-01-22",
      dueDate: "2024-01-29",
      amount: 380.0,
      progress: 20,
      status: "just-started",
      daysRemaining: 7,
    },
  ],
}

const typeConfig = {
  available: {
    title: "Available Balance Details",
    description: "Funds ready for withdrawal from completed orders",
    emptyTitle: "No Available Funds",
    emptyDescription: "Complete more orders to see available funds here.",
  },
  pending: {
    title: "Pending Clearance Details",
    description: "Payments currently being processed",
    emptyTitle: "No Pending Payments",
    emptyDescription: "All your payments have been cleared!",
  },
  active: {
    title: "Active Orders Details",
    description: "Ongoing projects and their expected earnings",
    emptyTitle: "No Active Orders",
    emptyDescription: "You don't have any active orders at the moment.",
  },
}

export default function EarningsDetailsModal({ isOpen, onClose, type, formatCurrency, formatDate }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")

  if (!type || !isOpen) return null

  const data = mockDetailedData[type] || []
  const config = typeConfig[type]

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { label: "Available", color: "bg-green-100 text-green-800" },
      clearing: { label: "Clearing", color: "bg-yellow-100 text-yellow-800" },
      "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800" },
      "just-started": { label: "Just Started", color: "bg-purple-100 text-purple-800" },
    }

    const badgeConfig = statusConfig[status] || statusConfig.available
    return <Badge className={badgeConfig.color}>{badgeConfig.label}</Badge>;
  }

  const EmptyState = () => (
    <div className="text-center py-12">
      <div
        className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <DollarSign className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{config.emptyTitle}</h3>
      <p className="text-muted-foreground">{config.emptyDescription}</p>
    </div>
  )

  const AvailableBalanceTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Completed</TableHead>
          <TableHead>Cleared</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.client.avatar || "/placeholder.svg"} alt={item.client.name} />
                  <AvatarFallback className="text-xs">{getInitials(item.client.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{item.client.name}</p>
                  <p className="text-xs text-muted-foreground">@{item.client.username}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-sm">{item.gig}</p>
                {getStatusBadge(item.status)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {item.orderId}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {formatDate(item.completedDate)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {formatDate(item.clearedDate)}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div>
                <p className="font-semibold text-green-600">{formatCurrency(item.netAmount)}</p>
                <p className="text-xs text-muted-foreground">Fee: {formatCurrency(item.fee)}</p>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const PendingClearanceTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Completed</TableHead>
          <TableHead>Expected Clearance</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.client.avatar || "/placeholder.svg"} alt={item.client.name} />
                  <AvatarFallback className="text-xs">{getInitials(item.client.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{item.client.name}</p>
                  <p className="text-xs text-muted-foreground">@{item.client.username}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-sm">{item.gig}</p>
                {getStatusBadge(item.status)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {item.orderId}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                {formatDate(item.completedDate)}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="flex items-center gap-1 text-sm mb-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(item.expectedClearance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.daysRemaining} day{item.daysRemaining !== 1 ? "s" : ""} remaining
                </p>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div>
                <p className="font-semibold text-yellow-600">{formatCurrency(item.netAmount)}</p>
                <p className="text-xs text-muted-foreground">Fee: {formatCurrency(item.fee)}</p>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const ActiveOrdersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="text-right">Expected Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.client.avatar || "/placeholder.svg"} alt={item.client.name} />
                  <AvatarFallback className="text-xs">{getInitials(item.client.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{item.client.name}</p>
                  <p className="text-xs text-muted-foreground">@{item.client.username}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-sm">{item.gig}</p>
                {getStatusBadge(item.status)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {item.orderId}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="flex items-center gap-1 text-sm mb-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.dueDate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.daysRemaining} day{item.daysRemaining !== 1 ? "s" : ""} remaining
                </p>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div>
                <p className="font-semibold text-blue-600">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-muted-foreground">Gross amount</p>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderTable = () => {
    switch (type) {
      case "available":
        return <AvailableBalanceTable />;
      case "pending":
        return <PendingClearanceTable />;
      case "active":
        return <ActiveOrdersTable />;
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {data.length > 0 ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 pb-4 border-b">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10" />
              </div>
              <div className="flex gap-2">
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
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">{renderTable()}</div>
          </div>
        ) : (
          <EmptyState />
        )}
      </DialogContent>
    </Dialog>
  );
}
