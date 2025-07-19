"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  FileText,
  Upload,
  Download,
  MessageSquare,
  Star,
  Eye,
  RefreshCw,
  X,
  Loader2,
  User,
  Briefcase
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/(nav2)/context/AuthContext";
import { useSocket } from "@/app/(nav2)/context/SocketContext";


const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  awaiting_requirements: { label: "Awaiting Requirements", color: "bg-blue-100 text-blue-800", icon: FileText },
  active: { label: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  delivered: { label: "Delivered", color: "bg-purple-100 text-purple-800", icon: Package },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: X },
  revision: { label: "Revision", color: "bg-orange-100 text-orange-800", icon: RefreshCw },
  overdue: { label: "Overdue", color: "bg-red-100 text-red-800", icon: AlertCircle },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-800", icon: AlertCircle }
};

const uploadFileToCloudinary = async (file) => {
  console.log("[Frontend] Starting Cloudinary upload for delivery file:", file.name);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_DELIVERY_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary configuration");
  }

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: data
    });
    
    const json = await res.json();
    console.log("[Frontend] Cloudinary response:", json);
    
    if (json.secure_url) {
      return json.secure_url;
    } else {
      throw new Error(json.error?.message || "Upload failed");
    }
  } catch (error) {
    console.error("[Frontend] Cloudinary upload error:", error);
    throw error;
  }
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, activeRole } = useAuth();
  const { createNotification } = useSocket();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [deliverModalOpen, setDeliverModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [requirementsModalOpen, setRequirementsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form states
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState([]);
  const [revisionMessage, setRevisionMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [activeTab, searchQuery, page, activeRole]);

  const fetchOrders = async () => {
    try {
      console.log("[Frontend] Fetching orders with params:", { activeRole, activeTab, searchQuery, page });
      setLoading(true);
      
      const params = {
        role: activeRole,
        page,
        limit: 10
      };

      if (activeTab !== "all") {
        params.status = activeTab;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      const res = await api.get("/api/user/orders", { params });
      console.log("[Frontend] Orders response:", res.data);

      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.pagination?.pages || 1);
      } else {
        setOrders([]);
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("[Frontend] Error fetching orders:", error);
      setOrders([]);
      toast.error("Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("[Frontend] Delivery files selected:", selectedFiles.length);
    
    // Validate file size (max 50MB per file for delivery)
    const maxSize = 50 * 1024 * 1024;
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Max size is 50MB.`);
        return false;
      }
      return true;
    });

    setDeliveryFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setDeliveryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeliver = async () => {
    if (!selectedOrder || !deliveryMessage.trim()) {
      toast.error("Please provide delivery message");
      return;
    }

    try {
      console.log("[Frontend] Starting delivery process for order:", selectedOrder._id);
      setSubmitting(true);

      // Upload files to Cloudinary
      const uploadedFiles = [];
      for (const file of deliveryFiles) {
        try {
          const url = await uploadFileToCloudinary(file);
          uploadedFiles.push({
            name: file.name,
            url: url,
            type: file.type
          });
        } catch (error) {
          console.error("[Frontend] Failed to upload file:", file.name, error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // Submit delivery
      const res = await api.patch(`/api/orders/${selectedOrder._id}/deliver`, {
        deliveryMessage,
        deliveryFiles: uploadedFiles
      });

      console.log("[Frontend] Delivery response:", res.data);

      if (res.data.success) {
        toast.success("Order delivered successfully!");
        
        // Create notification for buyer
        if (createNotification && res.data.notification) {
          await createNotification(res.data.notification);
        }

        // Reset form and close modal
        setDeliveryMessage("");
        setDeliveryFiles([]);
        setDeliverModalOpen(false);
        setSelectedOrder(null);
        
        // Refresh orders
        fetchOrders();
      } else {
        throw new Error(res.data.message || "Failed to deliver order");
      }
    } catch (error) {
      console.error("[Frontend] Error delivering order:", error);
      toast.error(error.response?.data?.message || "Failed to deliver order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      console.log("[Frontend] Accepting order:", orderId);
      
      const res = await api.patch(`/api/orders/${orderId}/accept`);
      console.log("[Frontend] Accept response:", res.data);

      if (res.data.success) {
        toast.success("Order accepted successfully!");
        
        // Create notification for seller
        if (createNotification && res.data.notification) {
          await createNotification(res.data.notification);
        }

        fetchOrders();
      } else {
        throw new Error(res.data.message || "Failed to accept order");
      }
    } catch (error) {
      console.error("[Frontend] Error accepting order:", error);
      toast.error(error.response?.data?.message || "Failed to accept order");
    }
  };

  const handleRequestRevision = async () => {
    if (!selectedOrder || !revisionMessage.trim()) {
      toast.error("Please provide revision details");
      return;
    }

    try {
      console.log("[Frontend] Requesting revision for order:", selectedOrder._id);
      setSubmitting(true);

      const res = await api.patch(`/api/orders/${selectedOrder._id}/request-revision`, {
        revisionMessage
      });

      console.log("[Frontend] Revision request response:", res.data);

      if (res.data.success) {
        toast.success("Revision requested successfully!");
        
        // Create notification for seller
        if (createNotification && res.data.notification) {
          await createNotification(res.data.notification);
        }

        // Reset form and close modal
        setRevisionMessage("");
        setRevisionModalOpen(false);
        setSelectedOrder(null);
        
        // Refresh orders
        fetchOrders();
      } else {
        throw new Error(res.data.message || "Failed to request revision");
      }
    } catch (error) {
      console.error("[Frontend] Error requesting revision:", error);
      toast.error(error.response?.data?.message || "Failed to request revision");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} border-0 flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActionButtons = (order) => {
    const buttons = [];

    if (activeRole === "seller") {
      if (order.status === "awaiting_requirements") {
        buttons.push(
          <Button key="view-req" size="sm" variant="outline" disabled>
            <Clock className="h-3 w-3 mr-1" />
            Awaiting Requirements
          </Button>
        );
      } else if (order.status === "active") {
        buttons.push(
          <Button
            key="deliver"
            size="sm"
            onClick={() => {
              setSelectedOrder(order);
              setDeliverModalOpen(true);
            }}
          >
            <Package className="h-3 w-3 mr-1" />
            Deliver
          </Button>
        );
      }
    } else if (activeRole === "buyer") {
      if (order.status === "awaiting_requirements") {
        buttons.push(
          <Button
            key="submit-req"
            size="sm"
            onClick={() => router.push(`/orders/${order._id}/submit-requirements`)}
          >
            <FileText className="h-3 w-3 mr-1" />
            Submit Requirements
          </Button>
        );
      } else if (order.status === "delivered") {
        buttons.push(
          <Button
            key="accept"
            size="sm"
            variant="default"
            onClick={() => handleAcceptOrder(order._id)}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Accept
          </Button>,
          <Button
            key="revision"
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedOrder(order);
              setRevisionModalOpen(true);
            }}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Request Revision
          </Button>
        );
      }
    }

    return buttons;
  };

  const tabs = [
    { value: "all", label: "All Orders" },
    { value: "active", label: "Active" },
    { value: "delivered", label: "Delivered" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  if (activeRole === "buyer") {
    tabs.splice(2, 0, { value: "awaiting_requirements", label: "Awaiting Requirements" });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {activeRole === "seller" ? "Manage Orders" : "My Orders"}
              </h1>
              <p className="text-gray-600">
                {activeRole === "seller" 
                  ? "Track and manage your client orders" 
                  : "Track your purchases and project progress"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {activeRole === "seller" ? "Seller View" : "Buyer View"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by service, buyer, or order ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); setPage(1); }}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">
                      {activeTab === "all" 
                        ? "You don't have any orders yet" 
                        : `No ${activeTab} orders to display`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {activeRole === "seller" ? "Buyer" : "Service"}
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {activeRole === "seller" ? (
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-3">
                                    <AvatarImage src={order.buyer?.avatar} />
                                    <AvatarFallback>
                                      {order.buyer?.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {order.buyer?.name || "Unknown"}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      @{order.buyer?.username || "user"}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {order.gig?.title || order.serviceTitle || "Service"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {order.selectedPackage?.name || "Basic"} Package
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                Order #{order._id.slice(-8)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatDate(order.createdAt)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {formatDate(order.dueDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm font-medium text-gray-900">
                                <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                ${order.price}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {getActionButtons(order)}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setRequirementsModalOpen(true);
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Message {activeRole === "seller" ? "Buyer" : "Seller"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <AlertCircle className="h-4 w-4 mr-2" />
                                      Report Issue
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Deliver Modal */}
        <Dialog open={deliverModalOpen} onOpenChange={setDeliverModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Deliver Order</DialogTitle>
              <DialogDescription>
                Upload your completed work and provide delivery details
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="delivery-message">Delivery Message *</Label>
                <Textarea
                  id="delivery-message"
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  placeholder="Describe what you've delivered and any important notes..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div>
                <Label>Upload Delivery Files</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your completed work files
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="delivery-upload"
                    accept="*/*"
                  />
                  <Label htmlFor="delivery-upload" className="cursor-pointer">
                    <Button variant="outline" type="button">
                      Choose Files
                    </Button>
                  </Label>
                </div>

                {deliveryFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-700">Selected Files:</h4>
                    {deliveryFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeliverModalOpen(false);
                    setDeliveryMessage("");
                    setDeliveryFiles([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeliver}
                  disabled={submitting || !deliveryMessage.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Delivering...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Deliver Order
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Revision Request Modal */}
        <Dialog open={revisionModalOpen} onOpenChange={setRevisionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Revision</DialogTitle>
              <DialogDescription>
                Explain what needs to be changed or improved
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="revision-message">Revision Details *</Label>
                <Textarea
                  id="revision-message"
                  value={revisionMessage}
                  onChange={(e) => setRevisionMessage(e.target.value)}
                  placeholder="Please describe what needs to be revised..."
                  className="mt-2"
                  rows={4}
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Be specific about what needs to be changed to help the seller deliver exactly what you need.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setRevisionModalOpen(false);
                    setRevisionMessage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRequestRevision}
                  disabled={submitting || !revisionMessage.trim()}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Request Revision
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order Details Modal */}
        <Dialog open={requirementsModalOpen} onOpenChange={setRequirementsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Complete information about this order
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Order ID</Label>
                    <p className="font-mono text-sm">#{selectedOrder._id.slice(-8)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Service</Label>
                    <p>{selectedOrder.gig?.title || selectedOrder.serviceTitle}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Package</Label>
                    <p>{selectedOrder.selectedPackage?.name || "Basic"}</p>
                  </div>
                </div>

                {/* Requirements */}
                {selectedOrder.requirements && selectedOrder.requirements.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Requirements</Label>
                    <div className="mt-2 space-y-3">
                      {selectedOrder.requirements.map((req, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-sm">{req.question}</p>
                          <p className="text-sm text-gray-600 mt-1">{req.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files */}
                {selectedOrder.requirementsFile && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Requirement Files</Label>
                    <div className="mt-2">
                      <a
                        href={selectedOrder.requirementsFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600">View Requirements File</span>
                        <Download className="h-4 w-4 text-blue-600 ml-auto" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Delivery */}
                {selectedOrder.delivery && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Delivery</Label>
                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm">{selectedOrder.delivery.message}</p>
                      {selectedOrder.delivery.files && selectedOrder.delivery.files.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {selectedOrder.delivery.files.map((file, index) => (
                            <a
                              key={index}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-green-600 hover:text-green-700"
                            >
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">{file.name}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}