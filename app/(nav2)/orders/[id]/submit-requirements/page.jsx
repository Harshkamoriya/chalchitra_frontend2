"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Package,
  User,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useSocket } from "@/app/(nav2)/context/SocketContext";
const uploadFileToCloudinary = async (file) => {
  console.log("[Frontend] Starting Cloudinary upload for file:", file.name);
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_REQUIREMENTS_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("[Frontend] Missing Cloudinary config");
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

export default function SubmitRequirementsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  const { createNotification } = useSocket();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [requirements, setRequirements] = useState([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      console.log("[Frontend] Fetching order details for:", orderId);
      setLoading(true);
      
      const res = await api.get(`/api/orders/${orderId}`);
      console.log("[Frontend] Order details response:", res.data);
      
      if (res.data.success) {
        setOrderData(res.data.order);
        
        // Initialize requirements based on gig questions
        if (res.data.order.gig?.questions) {
          setRequirements(
            res.data.order.gig.questions.map(q => ({
              question: q,
              answer: ""
            }))
          );
        }
      } else {
        toast.error("Failed to load order details");
        // router.push("/orders");
      }
    } catch (error) {
      console.error("[Frontend] Error fetching order:", error);
      toast.error("Could not load order details");
      // router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("[Frontend] Files selected:", selectedFiles.length);
    
    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024;
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];

    console.log("[Frontend] Starting upload for", files.length, "files");
    const uploadedUrls = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        setUploadProgress(((i + 1) / files.length) * 100);
        const url = await uploadFileToCloudinary(files[i]);
        uploadedUrls.push({
          name: files[i].name,
          url: url,
          type: files[i].type
        });
        console.log("[Frontend] File uploaded successfully:", files[i].name);
      } catch (error) {
        console.error("[Frontend] Failed to upload file:", files[i].name, error);
        toast.error(`Failed to upload ${files[i].name}`);
      }
    }

    return uploadedUrls;
  };

  const handleRequirementChange = (index, value) => {
    setRequirements(prev => 
      prev.map((req, i) => 
        i === index ? { ...req, answer: value } : req
      )
    );
  };

  const validateForm = () => {
    // Check if all requirements are answered
    const unansweredReqs = requirements.filter(req => !req.answer.trim());
    if (unansweredReqs.length > 0) {
      toast.error("Please answer all requirements");
      return false;
    }

    // Check if message is provided
    if (!message.trim()) {
      toast.error("Please provide additional details");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    console.log("[Frontend] Starting requirements submission");
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setUploadProgress(0);

      // Upload files first
      const uploadedFileUrls = await uploadFiles();
      console.log("[Frontend] All files uploaded:", uploadedFileUrls);

      // Submit requirements
      const res = await api.patch(`/api/orders/${orderId}/submit-requirements`, {
        requirements,
        message,
        files: uploadedFileUrls
      });

      console.log("[Frontend] Requirements submission response:", res.data);

      if (res.data.success) {
        toast.success("Requirements submitted successfully!");
        
        // Create notification for seller
        if (createNotification && res.data.notification) {
          await createNotification(res.data.notification);
          console.log("[Frontend] Notification sent to seller");
        }

        // Redirect to orders page after short delay
        // setTimeout(() => {
        //   router.push("/orders");
        // }, 2000);
      } else {
        throw new Error(res.data.message || "Failed to submit requirements");
      }
    } catch (error) {
      console.error("[Frontend] Error submitting requirements:", error);
      toast.error(error.response?.data?.message || "Failed to submit requirements");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Requirements</h1>
          <p className="text-gray-600">Provide detailed requirements to help the seller deliver exactly what you need</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirements Questions */}
            {requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Project Requirements
                  </CardTitle>
                  <CardDescription>
                    Please answer all questions to help the seller understand your needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {requirements.map((req, index) => (
                    <div key={index} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {req.question} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        value={req.answer}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        placeholder="Please provide detailed information..."
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Provide any additional information or special instructions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any additional details, preferences, or special instructions..."
                  className="min-h-[120px]"
                  required
                />
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Files
                </CardTitle>
                <CardDescription>
                  Upload reference files, documents, or any materials that will help the seller (Max 10MB per file)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop files
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="mt-2">
                      Choose Files
                    </Button>
                  </Label>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Selected Files:</h4>
                    {files.map((file, index) => (
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

                {/* Upload Progress */}
                {submitting && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading files...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 cursor-pointer"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Requirements
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Service</Label>
                  <p className="font-medium">{orderData.gig?.title || orderData.serviceTitle}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">Package</Label>
                  <p className="font-medium">{orderData.selectedPackage?.name || 'Basic'}</p>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Seller</Label>
                    <p className="font-medium">{orderData.seller?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Due Date</Label>
                    <p className="font-medium">{formatDate(orderData.dueDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total</Label>
                    <p className="font-medium">${orderData.price}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <Badge variant="secondary">Awaiting Requirements</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Be as detailed as possible in your requirements. This helps the seller deliver exactly what you need and reduces revision requests.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}