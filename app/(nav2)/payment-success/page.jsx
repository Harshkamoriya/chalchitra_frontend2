"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, Package, Calendar, Star, ArrowRight, Download, MessageCircle, Home } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/axios';
import { useSearchParams, useRouter } from 'next/navigation'; // ✅ fix
// removed useParams (was unused)

export default function PaymentSuccess() {
  const searchParams = useSearchParams(); // ✅ get search params
  const router = useRouter(); // ✅ correct Next.js router
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [error, setError] = useState(null);

  const paymentIntent = searchParams.get('payment_intent');
  const clientSecret = searchParams.get('payment_intent_client_secret');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (!paymentIntent || redirectStatus !== 'succeeded') {
        setError('Invalid payment confirmation');
        setLoading(false);
        return;
      }

      try {
        const response = await api.patch('/api/orders/confirm-payment', {
         
          clientSecret :clientSecret
        });

        if (response.data.success) {
          setOrderData(response.data.order);
          setTransactionData(response.data.transaction);
          toast.success('Payment confirmed successfully!');
        } else {
          throw new Error(response.data.message || 'Failed to confirm payment');
        }
      } catch (error) {
        console.error('Error confirming payment:', error);
        setError(error.response?.data?.message || 'Failed to confirm payment');
        toast.error('There was an issue confirming your payment');
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, [paymentIntent, redirectStatus ,clientSecret]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Confirming your payment...</h2>
          <p className="text-gray-500">Please wait while we process your order</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Confirmation Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/orders')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ChalChitra</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-xl text-gray-600 mb-2">Thank you for your order on ChalChitra</p>
          <p className="text-gray-500">Your payment has been processed and your order is confirmed</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            </div>

            {orderData && (
              <div className="space-y-6">
                {/* Package Info */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {orderData.selectedPackage?.name || 'Basic'} Package
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {orderData.selectedPackage?.deliveryTime || 2} days delivery
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {orderData.selectedPackage?.revisions || 1} revision{orderData.selectedPackage?.revisions !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  {orderData.selectedPackage?.features && orderData.selectedPackage.features.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
                      <ul className="space-y-1">
                        {orderData.selectedPackage.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Delivery Information */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Expected Delivery</span>
                  </div>
                  <p className="text-blue-700">
                    {orderData.dueDate ? formatDate(orderData.dueDate) : 'To be determined'}
                  </p>
                </div>

                {/* Order Status */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800">Order Status: Confirmed</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your order is now in progress
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment & Transaction Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Summary</h2>
            </div>

            {transactionData && orderData && (
              <div className="space-y-6">
                {/* Transaction Info */}
                <div className="p-6 bg-gray-50 rounded-xl">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Transaction ID</span>
                      <span className="font-mono text-sm text-gray-900">{transactionData._id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="text-gray-900 capitalize">{transactionData.paymentMethod || 'Card'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Date</span>
                      <span className="text-gray-900">
                        {formatDate(transactionData.createdAt)} at {formatTime(transactionData.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Package Price</span>
                    <span className="text-gray-900">${orderData.price}</span>
                  </div>
                  
                  {orderData.applicationFeeAmount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="text-gray-900">${(orderData.applicationFeeAmount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                      <span className="text-xl font-bold text-green-600">
                        ${transactionData.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Payment Status: Completed</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your payment has been successfully processed
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>View My Orders</span>
            </button>
            
            <button
              onClick={() => navigate('/messages')}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message Seller</span>
            </button>
            
            <button
              onClick={() => window.print()}
              className="border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Order Confirmation</h4>
              <p className="text-gray-600 text-sm">You'll receive an email confirmation with order details</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Work Begins</h4>
              <p className="text-gray-600 text-sm">The seller will start working on your project</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
              <p className="text-gray-600 text-sm">You'll receive your completed order by the due date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}