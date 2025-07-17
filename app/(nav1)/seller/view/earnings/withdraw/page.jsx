"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Star,
  Building,
  Mail
} from "lucide-react"

import api from "@/lib/axios"

export default function WithdrawPage() {
  const [availableBalance, setAvailableBalance] = useState(0)
  const [payoutMethods, setPayoutMethods] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Withdrawal form state
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState("")
  const [withdrawalNotes, setWithdrawalNotes] = useState("")
  
  // Add payout method form state
  const [addMethodDialogOpen, setAddMethodDialogOpen] = useState(false)
  const [methodType, setMethodType] = useState("bank_account")
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
    accountType: "checking",
    country: "US"
  })
  const [paypalDetails, setPaypalDetails] = useState({
    email: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log("[Frontend] Fetching withdrawal data...")
      setLoading(true)
      
      // Fetch available balance
      const earningsRes = await api.get("/api/seller/earnings")
      setAvailableBalance(earningsRes.data.availableBalance || 0)
      
      // Fetch payout methods
      const methodsRes = await api.get("/api/seller/payout-methods")
      setPayoutMethods(methodsRes.data.payoutMethods || [])
      
      // Fetch withdrawal history
      const withdrawalsRes = await api.get("/api/seller/withdrawals")
      setWithdrawals(withdrawalsRes.data.withdrawals || [])
      
      console.log("[Frontend] Data fetched successfully")
    } catch (error) {
      console.error("[Frontend] Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawal = async (e) => {
    e.preventDefault()
    
    if (!withdrawalAmount || !selectedPayoutMethod) {
      alert("Please fill in all required fields")
      return
    }
    
    const amount = parseFloat(withdrawalAmount)
    if (amount <= 0 || amount > availableBalance) {
      alert("Invalid withdrawal amount")
      return
    }

    try {
      console.log("[Frontend] Submitting withdrawal request...")
      setSubmitting(true)
      
      const res = await api.post("/api/seller/withdrawals", {
        amount,
        payoutMethodId: selectedPayoutMethod,
        notes: withdrawalNotes
      })
      
      if (res.data.success) {
        alert("Withdrawal request submitted successfully!")
        setWithdrawalAmount("")
        setWithdrawalNotes("")
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("[Frontend] Withdrawal failed:", error)
      alert(error.response?.data?.error || "Withdrawal failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddPayoutMethod = async (e) => {
    e.preventDefault()
    
    try {
      console.log("[Frontend] Adding payout method...")
      
      const payload = {
        type: methodType,
        isDefault: payoutMethods.length === 0
      }
      
      if (methodType === "bank_account") {
        payload.bankDetails = bankDetails
      } else if (methodType === "paypal") {
        payload.paypalDetails = paypalDetails
      }
      
      const res = await api.post("/api/seller/payout-methods", payload)
      
      if (res.data.success) {
        alert("Payout method added successfully!")
        setAddMethodDialogOpen(false)
        fetchData() // Refresh data
        
        // Reset form
        setBankDetails({
          accountHolderName: "",
          accountNumber: "",
          routingNumber: "",
          bankName: "",
          accountType: "checking",
          country: "US"
        })
        setPaypalDetails({ email: "" })
      }
    } catch (error) {
      console.error("[Frontend] Failed to add payout method:", error)
      alert(error.response?.data?.error || "Failed to add payout method")
    }
  }

  const handleDeletePayoutMethod = async (methodId) => {
    if (!confirm("Are you sure you want to delete this payout method?")) {
      return
    }
    
    try {
      console.log("[Frontend] Deleting payout method...")
      
      const res = await api.delete(`/api/seller/payout-methods/${methodId}`)
      
      if (res.data.success) {
        alert("Payout method deleted successfully!")
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("[Frontend] Failed to delete payout method:", error)
      alert(error.response?.data?.error || "Failed to delete payout method")
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
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      processing: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Loader2 },
      completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
      failed: { label: "Failed", color: "bg-red-100 text-red-800", icon: AlertCircle },
      cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: AlertCircle }
    }[status] || { label: status, color: "bg-gray-100 text-gray-800", icon: AlertCircle }
    
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getPayoutMethodIcon = (type) => {
    switch (type) {
      case "bank_account": return <Building className="h-4 w-4" />
      case "paypal": return <Mail className="h-4 w-4" />
      default: return <CreditCard className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading withdrawal data...</span>
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
          <h1 className="text-2xl md:text-3xl font-bold">Withdraw Earnings</h1>
          <p className="text-muted-foreground">Transfer your available balance to your bank account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Balance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Available Balance
              </CardTitle>
              <CardDescription>Funds ready for withdrawal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(availableBalance)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Available for immediate withdrawal
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>Transfer funds to your selected payout method</CardDescription>
            </CardHeader>
            <CardContent>
              {availableBalance <= 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You don't have any available balance to withdraw. Complete more orders to earn money.
                  </AlertDescription>
                </Alert>
              ) : payoutMethods.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to add a payout method before you can withdraw funds.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Withdrawal Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="1"
                      max={availableBalance}
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="Enter amount to withdraw"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum: {formatCurrency(availableBalance)}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="payoutMethod">Payout Method</Label>
                    <Select value={selectedPayoutMethod} onValueChange={setSelectedPayoutMethod} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payout method" />
                      </SelectTrigger>
                      <SelectContent>
                        {payoutMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              {getPayoutMethodIcon(method.type)}
                              {method.displayName} ****{method.lastFourDigits}
                              {method.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={withdrawalNotes}
                      onChange={(e) => setWithdrawalNotes(e.target.value)}
                      placeholder="Add any notes about this withdrawal..."
                      rows={3}
                    />
                  </div>

                  {withdrawalAmount && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Withdrawal Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Withdrawal Amount:</span>
                          <span>{formatCurrency(parseFloat(withdrawalAmount) || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Fee (2.5%):</span>
                          <span>-{formatCurrency((parseFloat(withdrawalAmount) || 0) * 0.025)}</span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-1">
                          <span>You'll Receive:</span>
                          <span>{formatCurrency((parseFloat(withdrawalAmount) || 0) * 0.975)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Request Withdrawal
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payout Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payout Methods</CardTitle>
                  <CardDescription>Manage your withdrawal methods</CardDescription>
                </div>
                <Dialog open={addMethodDialogOpen} onOpenChange={setAddMethodDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Payout Method</DialogTitle>
                      <DialogDescription>Add a new way to receive your earnings</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPayoutMethod} className="space-y-4">
                      <div>
                        <Label>Method Type</Label>
                        <Select value={methodType} onValueChange={setMethodType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank_account">Bank Account</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {methodType === "bank_account" && (
                        <>
                          <div>
                            <Label htmlFor="accountHolderName">Account Holder Name</Label>
                            <Input
                              id="accountHolderName"
                              value={bankDetails.accountHolderName}
                              onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                              id="bankName"
                              value={bankDetails.bankName}
                              onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input
                              id="accountNumber"
                              value={bankDetails.accountNumber}
                              onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="routingNumber">Routing Number</Label>
                            <Input
                              id="routingNumber"
                              value={bankDetails.routingNumber}
                              onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label>Account Type</Label>
                            <Select 
                              value={bankDetails.accountType} 
                              onValueChange={(value) => setBankDetails({...bankDetails, accountType: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="checking">Checking</SelectItem>
                                <SelectItem value="savings">Savings</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {methodType === "paypal" && (
                        <div>
                          <Label htmlFor="paypalEmail">PayPal Email</Label>
                          <Input
                            id="paypalEmail"
                            type="email"
                            value={paypalDetails.email}
                            onChange={(e) => setPaypalDetails({...paypalDetails, email: e.target.value})}
                            required
                          />
                        </div>
                      )}

                      <Button type="submit" className="w-full">
                        Add Payout Method
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payoutMethods.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No payout methods added yet
                  </p>
                ) : (
                  payoutMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getPayoutMethodIcon(method.type)}
                        <div>
                          <p className="font-medium text-sm">{method.displayName}</p>
                          <p className="text-xs text-muted-foreground">****{method.lastFourDigits}</p>
                        </div>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePayoutMethod(method.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Withdrawals */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Withdrawals</CardTitle>
              <CardDescription>Your withdrawal history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {withdrawals.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No withdrawals yet
                  </p>
                ) : (
                  withdrawals.slice(0, 5).map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{formatCurrency(withdrawal.amount)}</p>
                          {getStatusBadge(withdrawal.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(withdrawal.requestedAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {withdrawal.payoutMethod?.displayName}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {withdrawals.length > 5 && (
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm">
                    View All Withdrawals
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}