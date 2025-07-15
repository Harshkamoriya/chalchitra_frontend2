// "use client"

// import { useState, useMemo } from "react"
// import { useEffect } from "react"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import axios from "axios"
// import api from "@/lib/axios"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   AlertCircle,
//   Calendar,
//   Clock,
//   DollarSign,
//   Eye,
//   Filter,
//   MessageSquare,
//   MoreHorizontal,
//   Search,
//   Star,
//   StarOff,
//   CheckCircle2,
//   XCircle,
//   Timer,
//   Package,
//   TrendingUp,
// } from "lucide-react"

// // Mock orders data
// const mockOrders = [
//   {
//     id: "ORD-001",
//     buyer: {
//       name: "Sarah Johnson",
//       avatar: null,
//       username: "sarah_creative",
//     },
//     service: "Logo Design & Brand Identity",
//     category: "Graphic Design",
//     dueDate: "2024-01-25",
//     amount: 150,
//     status: "urgent",
//     isStarred: true,
//     note: "Rush delivery needed for startup launch",
//     createdAt: "2024-01-20",
//     lastUpdate: "2024-01-22",
//   },
//   {
//     id: "ORD-002",
//     buyer: {
//       name: "Mike Chen",
//       avatar: null,
//       username: "mike_tech",
//     },
//     service: "Website Development",
//     category: "Web Development",
//     dueDate: "2024-01-28",
//     amount: 450,
//     status: "in-progress",
//     isStarred: false,
//     note: "E-commerce site with payment integration",
//     createdAt: "2024-01-18",
//     lastUpdate: "2024-01-23",
//   },
//   {
//     id: "ORD-003",
//     buyer: {
//       name: "Emma Wilson",
//       avatar: null,
//       username: "emma_marketing",
//     },
//     service: "Social Media Content Package",
//     category: "Digital Marketing",
//     dueDate: "2024-01-30",
//     amount: 200,
//     status: "pending",
//     isStarred: false,
//     note: "Monthly content for Instagram and Facebook",
//     createdAt: "2024-01-19",
//     lastUpdate: "2024-01-21",
//   },
//   {
//     id: "ORD-004",
//     buyer: {
//       name: "David Rodriguez",
//       avatar: null,
//       username: "david_business",
//     },
//     service: "Business Presentation Design",
//     category: "Presentation",
//     dueDate: "2024-01-15",
//     amount: 120,
//     status: "delivered",
//     isStarred: true,
//     note: "Investor pitch deck with animations",
//     createdAt: "2024-01-10",
//     lastUpdate: "2024-01-15",
//   },
//   {
//     id: "ORD-005",
//     buyer: {
//       name: "Lisa Thompson",
//       avatar: null,
//       username: "lisa_startup",
//     },
//     service: "Mobile App UI/UX Design",
//     category: "UI/UX Design",
//     dueDate: "2024-01-12",
//     amount: 350,
//     status: "completed",
//     isStarred: false,
//     note: "Fitness tracking app interface",
//     createdAt: "2024-01-05",
//     lastUpdate: "2024-01-12",
//   },
//   {
//     id: "ORD-006",
//     buyer: {
//       name: "James Park",
//       avatar: null,
//       username: "james_agency",
//     },
//     service: "Video Editing & Motion Graphics",
//     category: "Video Production",
//     dueDate: "2024-01-08",
//     amount: 280,
//     status: "cancelled",
//     isStarred: false,
//     note: "Marketing video for product launch",
//     createdAt: "2024-01-03",
//     lastUpdate: "2024-01-08",
//   },
//   {
//     id: "ORD-007",
//     buyer: {
//       name: "Anna Martinez",
//       avatar: null,
//       username: "anna_blogger",
//     },
//     service: "Content Writing & SEO",
//     category: "Content Creation",
//     dueDate: "2024-01-18",
//     amount: 95,
//     status: "overdue",
//     isStarred: true,
//     note: "Blog posts with keyword optimization",
//     createdAt: "2024-01-12",
//     lastUpdate: "2024-01-16",
//   },
// ]

// const statusConfig = {
//   urgent: { label: "Urgent", color: "bg-red-100 text-red-800", icon: AlertCircle },
//   "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: Clock },
//   pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Timer },
//   delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle2 },
//   completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
//   cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: XCircle },
//   overdue: { label: "Overdue", color: "bg-red-100 text-red-800", icon: AlertCircle },
// }

// const tabConfig = {
//   urgent: { label: "Urgent", count: 2, icon: AlertCircle },
//   active: { label: "Active", count: 3, icon: Clock },
//   overdue: { label: "Overdue", count: 1, icon: AlertCircle },
//   delivered: { label: "Delivered", count: 1, icon: Package },
//   completed: { label: "Completed", count: 1, icon: CheckCircle2 },
//   cancelled: { label: "Cancelled", count: 1, icon: XCircle },
//   starred: { label: "Starred", count: 3, icon: Star },
// }

// export default function OrdersPage() {
//   const [activeTab, setActiveTab] = useState("urgent")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [sortBy, setSortBy] = useState("dueDate")
//   const [orders, setOrders] = useState([]);
//   const [loading , setLoading] = useState(false);
//   const [page ,setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
// const limit = 10; // items per page

//   const filteredOrders = useMemo(() => {
//     let filtered = [...orders]

//     // Filter by tab
//     switch (activeTab) {
//       case "starred":
//         filtered = filtered.filter((order) => order.status === "urgent")
//         break
//       case "active":
//         filtered = filtered.filter((order) => ["in-progress", "pending"].includes(order.status))
//         break
//       // case "overdue":
//       //   filtered = filtered.filter((order) => order.status === "overdue")
//       //   break
//       // case "delivered":
//       //   filtered = filtered.filter((order) => order.status === "delivered")
//       //   break
//       // case "completed":
//       //   filtered = filtered.filter((order) => order.status === "completed")
//       //   break
//       // case "cancelled":
//       //   filtered = filtered.filter((order) => order.status === "cancelled")
//       //   break
//       // case "starred":
//       //   filtered = filtered.filter((order) => order.isStarred)
//       //   break
//       default:
//         break
//     }



//     // Filter by search query
//     if (searchQuery) {
//       filtered = filtered.filter((order) =>
//         order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         order.id.toLowerCase().includes(searchQuery.toLowerCase()))
//     }

//     // Sort orders
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "dueDate":
//           return new Date(a.dueDate) - new Date(b.dueDate);
//         case "amount":
//           return b.amount - a.amount
//         case "recent":
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         default:
//           return 0
//       }
//     })

//     return filtered
//   }, [activeTab, searchQuery, sortBy])

//   useEffect(()=>{
//     const fetchOrders = async ()=>{

//       try {
      
//         setLoading(true);
//          const res = await api.get(`/api/user/orders?role=seller&status=${activeTab}&page=${page}&limit=${limit}`)
//         const data  = res.data;
//         if(data.success){
//           setOrders(data.orders);
//             setTotalPages(data.pagination.pages || 1);

//           setLoading(false);
//         }else{
//           console.error("failed to fetch orders ", data.message);
//           setOrders([]);
//           setTotalPages(1);
//         }
//       } catch (error) {
//         console.error("Error fetching orders:", error.message)
//           setOrders([])
//           setTotalPages(1);
//       }finally{
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   } , [activeTab ,page, sortBy ,searchQuery])

//   const getInitials = (name) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   }

//   const getDaysUntilDue = (dueDate) => {
//     const today = new Date()
//     const due = new Date(dueDate)
//     const diffTime = due - today
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   const OrderCard = ({ order }) => {
//     const StatusIcon = statusConfig[order.status]?.icon || Clock
//     const daysUntilDue = getDaysUntilDue(order.dueDate)

//     return (
//       <Card className="hover:shadow-md transition-shadow">
//         <CardContent className="p-4 md:p-6">
//           <div
//             className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             {/* Left Section - Order Info */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-start gap-3 mb-3">
//                 <Avatar className="h-10 w-10 flex-shrink-0">
//                   <AvatarImage src={order.buyer.avatar || "/placeholder.svg"} alt={order.buyer.name} />
//                   <AvatarFallback className="bg-primary text-primary-foreground text-sm">
//                     {getInitials(order.buyer.name)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-1">
//                     <h3 className="font-semibold text-sm md:text-base truncate">{order.buyer.name}</h3>
//                     <Badge variant="outline" className="text-xs">
//                       {order.id}
//                     </Badge>
//                     {order.isStarred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
//                   </div>
//                   <p className="text-sm text-muted-foreground mb-1">@{order.buyer.username}</p>
//                   <p className="font-medium text-sm md:text-base mb-2 line-clamp-1">{order.service}</p>
//                   <Badge variant="secondary" className="text-xs">
//                     {order.category}
//                   </Badge>
//                 </div>
//               </div>

//               {order.note && (
//                 <p
//                   className="text-sm text-muted-foreground bg-muted p-2 rounded-md mb-3 line-clamp-2">{order.note}</p>
//               )}
//             </div>

//             {/* Right Section - Status & Actions */}
//             <div className="flex flex-col md:items-end gap-3 md:min-w-[200px]">
//               <div className="flex items-center justify-between md:justify-end gap-4">
//                 <div className="text-right">
//                   <p className="font-bold text-lg">${order.amount}</p>
//                   <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                     <Calendar className="h-3 w-3" />
//                     <span>Due {formatDate(order.dueDate)}</span>
//                   </div>
//                   {daysUntilDue <= 3 && daysUntilDue > 0 && (
//                     <p className="text-xs text-orange-600 font-medium">
//                       {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} left
//                     </p>
//                   )}
//                   {daysUntilDue < 0 && <p className="text-xs text-red-600 font-medium">Overdue</p>}
//                 </div>
//               </div>

//               <div className="flex items-center justify-between md:justify-end gap-2">
//                 <Badge className={statusConfig[order.status]?.color}>
//                   <StatusIcon className="h-3 w-3 mr-1" />
//                   {statusConfig[order.status]?.label}
//                 </Badge>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                       <MoreHorizontal className="h-4 w-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem>
//                       <Eye className="h-4 w-4 mr-2" />
//                       View Details
//                     </DropdownMenuItem>
//                     <DropdownMenuItem>
//                       <MessageSquare className="h-4 w-4 mr-2" />
//                       Message Buyer
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>
//                       {order.isStarred ? (
//                         <>
//                           <StarOff className="h-4 w-4 mr-2" />
//                           Remove Star
//                         </>
//                       ) : (
//                         <>
//                           <Star className="h-4 w-4 mr-2" />
//                           Add Star
//                         </>
//                       )}
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   const EmptyState = ({ tab }) => {
//     const TabIcon = tabConfig[tab]?.icon

//     return (
//       <div className="text-center py-12">
//         <div
//           className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
//           {TabIcon && <TabIcon className="h-8 w-8 text-muted-foreground" />}
//         </div>
//         <h3 className="text-lg font-semibold mb-2">No {tabConfig[tab]?.label.toLowerCase()} orders</h3>
//         <p className="text-muted-foreground mb-4">
//           {tab === "urgent"
//             ? "Great! You don't have any urgent orders at the moment."
//             : tab === "active"
//               ? "No active orders to work on right now."
//               : tab === "overdue"
//                 ? "Excellent! All your orders are on track."
//                 : tab === "starred"
//                   ? "Star important orders to keep track of them easily."
//                   : `No ${tabConfig[tab]?.label.toLowerCase()} orders to display.`}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Header */}
//       <div
//         className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Management</h1>
//           <p className="text-muted-foreground">Track and manage all your client orders in one place</p>
//         </div>

//         {/* Search and Filter */}
//         <div className="flex flex-col sm:flex-row gap-2 md:min-w-[400px]">
//           <div className="relative flex-1">
//             <Search
//               className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search orders, buyers, or services..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10" />
//           </div>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="flex items-center gap-2">
//                 <Filter className="h-4 w-4" />
//                 Sort
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
//                 <Calendar className="h-4 w-4 mr-2" />
//                 Due Date
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSortBy("amount")}>
//                 <DollarSign className="h-4 w-4 mr-2" />
//                 Amount
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSortBy("recent")}>
//                 <Clock className="h-4 w-4 mr-2" />
//                 Most Recent
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-red-600" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Urgent</p>
//                 <p className="text-xl font-bold">{tabConfig.urgent.count}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center gap-2">
//               <Clock className="h-5 w-5 text-blue-600" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Active</p>
//                 <p className="text-xl font-bold">{tabConfig.active.count}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center gap-2">
//               <CheckCircle2 className="h-5 w-5 text-green-600" />
//               <div>
//                 <p className="text-sm text-muted-foreground">Completed</p>
//                 <p className="text-xl font-bold">{tabConfig.completed.count}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center gap-2">
//               <TrendingUp className="h-5 w-5 text-purple-600" />
//               <div>
//                 <p className="text-sm text-muted-foreground">This Month</p>
//                 <p className="text-xl font-bold">${orders.reduce((sum, order) => sum + order.amount, 0)}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {/* Orders Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 mb-6">
//           {Object.entries(tabConfig).map(([key, config]) => (
//             <TabsTrigger
//               key={key}
//               value={key}
//               className="flex items-center gap-1 text-xs md:text-sm">
//               <config.icon className="h-3 w-3 md:h-4 md:w-4" />
//               <span className="hidden sm:inline">{config.label}</span>
//               <Badge variant="secondary" className="ml-1 text-xs">
//                 {config.count}
//               </Badge>
//             </TabsTrigger>
//           ))}
//         </TabsList>

//         {Object.keys(tabConfig).map((tab) => (
//           <TabsContent key={tab} value={tab}>
//           {loading ? (
//   <p className="text-center text-muted-foreground">Loading orders...</p>
// ) : filteredOrders.length > 0 ? (
//   <div className="space-y-4">
//     {filteredOrders.map((order) => (
//       <OrderCard key={order.id} order={order} />
//     ))}
//   </div>
// ) : (
//   <EmptyState tab={tab} />
// )}
//           </TabsContent>
          
//         ))}
//         {totalPages > 1 && (
//   <div className="flex justify-center items-center gap-2 mt-6">
//     <Button
//   variant="outline"
//   size="sm"
//   disabled={page === 1}
//   onClick={() => {
//     setPage(p => Math.max(p - 1, 1));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }}
// >
//   Previous
// </Button>

//     <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
//   <Button
//   variant="outline"
//   size="sm"
//   disabled={page === totalPages}
//   onClick={() => {
//     setPage(p => Math.min(p + 1, totalPages));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }}
// >
//   Next
// </Button>

//   </div>
// )}

//       </Tabs>
//     </div>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-hot-toast"
import { useAuth } from "@/app/(nav2)/context/AuthContext"
import Modal from "react-modal"
import { useSocket } from "@/app/(nav2)/context/SocketContext"

const tabs = [
  "PRIORITY", "ACTIVE", "LATE", "DELIVERED", "COMPLETED", "CANCELLED", "STARRED"
]

const statusConfig = {
  active: "bg-blue-100 text-blue-800",
  urgent: "bg-red-100 text-red-800",
  overdue: "bg-red-100 text-red-800",
  delivered: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
  starred: "bg-purple-100 text-purple-800",
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("PRIORITY")
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const limit = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [deliveryFile, setDeliveryFile] = useState(null)
  const [viewRequirementsUrl, setViewRequirementsUrl] = useState(null)

  const { activeRole } = useAuth();
  const { sendNotification } = useSocket();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const res = await api.get('/api/user/orders', {
          params: {
            role: activeRole,
            status: activeTab.toLowerCase(),
            search: searchQuery,
            page,
            limit
          }
        })
        if (res.data.success) {
          setOrders(res.data.orders)
          setTotalPages(res.data.pagination?.pages || 1)
        } else {
          setOrders([])
        }
      } catch (err) {
        console.error("Error fetching orders", err)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [activeTab, searchQuery, page, activeRole])
  
  useEffect(() => {
  Modal.setAppElement('body')
}, [])

  const filteredOrders = orders.filter(order => {
    switch (activeTab) {
      case "PRIORITY": return order.status === "urgent"
      case "ACTIVE": return order.status === "active"
      case "LATE": return order.status === "overdue"
      case "DELIVERED": return order.status === "delivered"
      case "COMPLETED": return order.status === "completed"
      case "CANCELLED": return order.status === "cancelled"
      case "STARRED": return order.starred
      default: return true
    }
  })

  const handleUploadAndDeliver = async () => {
    if (!deliveryFile || !selectedOrderId) return

    try {
      const formData = new FormData()
      formData.append("file", deliveryFile)
      formData.append("upload_preset", "your_unsigned_preset") // replace with real

      const uploadRes = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/video/upload", {
        method: "POST",
        body: formData
      })
      const uploadData = await uploadRes.json()

      if (uploadData.secure_url) {
        const res = await api.patch(`/api/orders/${selectedOrderId}/deliver`, {
          deliveryFileUrl: uploadData.secure_url
        })
        toast.success("Delivered successfully!")
        sendNotification(res.data.notification)
        setIsModalOpen(false)
        setDeliveryFile(null)
      } else {
        throw new Error("Upload failed")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to deliver")
    }
  }

  const handleAccept = async (orderId) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/accept`)
      sendNotification(res.data.notification)
      toast.success("Order accepted!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to accept")
    }
  }

  const handleRequestRevision = async (orderId) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/request-revision`)
      toast.success("Revision requested!")
      sendNotification(res.data.notification)
    } catch (err) {
      console.error(err)
      toast.error("Failed to request revision")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Manage Orders ({activeRole})</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setPage(1) }}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-gray-800 text-gray-800"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search by buyer, gig, note..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
          <span className="text-gray-500 text-sm mt-2">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Gig</th>
              <th className="px-4 py-3">Due On</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Requirements</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-6">Loading...</td></tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">{order.buyer?.name || "N/A"}</td>
                  <td className="px-4 py-3">{order.service || "N/A"}</td>
                  <td className="px-4 py-3">{new Date(order.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">${order.amount?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge className={`${statusConfig[order.status] || "bg-gray-100 text-gray-800"} border-0`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </Badge>
                  </td>
                  {/* Requirements column */}
                  <td className="px-4 py-3">
                    {order.requirementsFile ? (
                      <>
                        <Button size="xs" onClick={() => setViewRequirementsUrl(order.requirementsFile)}>View</Button>
                        <a href={order.requirementsFile} download target="_blank" rel="noreferrer">
                          <Button size="xs" variant="secondary" className="ml-2">Download</Button>
                        </a>
                      </>
                    ) : "N/A"}
                  </td>
                  {/* Delivery column */}
                  <td className="px-4 py-3">
                    {order.deliveryFileUrl ? (
                      <>
                        <video src={order.deliveryFileUrl} controls className="w-32 mb-1" />
                        <a href={order.deliveryFileUrl} download target="_blank" rel="noreferrer">
                          <Button size="xs">Download</Button>
                        </a>
                      </>
                    ) : activeRole === "seller" && order.status === "active" && (
                      <span>Not delivered</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3 space-x-2">
                    {activeRole === "seller" && order.status === "active" && (
                      <Button size="sm" onClick={() => { setSelectedOrderId(order._id); setIsModalOpen(true) }}>Deliver</Button>
                    )}
                    {activeRole === "buyer" && order.status === "delivered" && (
                      <>
                        <Button size="sm" variant="success" onClick={() => handleAccept(order._id)}>Accept</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRequestRevision(order._id)}>Request Revision</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No {activeTab.toLowerCase()} orders to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Deliver Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Deliver Work" className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Deliver Work</h2>
        <input type="file" accept="video/*" onChange={e => setDeliveryFile(e.target.files[0])} className="mb-4" />
        <Button onClick={handleUploadAndDeliver} disabled={!deliveryFile}>Upload & Deliver</Button>
      </Modal>

      {/* View Requirements Modal */}
      <Modal isOpen={!!viewRequirementsUrl} onRequestClose={() => setViewRequirementsUrl(null)} contentLabel="View Requirements" className="max-w-2xl mx-auto mt-24 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Requirement File</h2>
        {viewRequirementsUrl && (
          <video src={viewRequirementsUrl} controls className="w-full rounded mb-4" />
        )}
        <div className="flex justify-end">
          <a href={viewRequirementsUrl} download target="_blank" rel="noreferrer">
            <Button>Download</Button>
          </a>
        </div>
      </Modal>
    </div>
  )
}
