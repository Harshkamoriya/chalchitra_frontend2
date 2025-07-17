// // 'use client';
// // import React, { useState, useEffect } from 'react';
// // import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// // import { loadStripe } from '@stripe/stripe-js';
// // import { toast } from 'react-hot-toast';
// // import { useParams } from 'next/navigation';
// // import api from '@/lib/axios';

// // const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// // function CheckoutForm({ orderId }) {
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   const [clientSecret, setClientSecret] = useState(null);

// //   const [loading, setLoading] = useState(false);
// //   const [orderData, setOrderData] = useState(null);

// //   useEffect(() => {
// //     const fetchOrder = async () => {
// //       try {
// //         const res = await api.get(`/api/orders/pending_payment/${orderId}`);
// //         if (res.data.success) {
// //           console.log(res.data, "data in the order page");
// //           setOrderData(res.data.order);
// //         } else {
// //           console.log("failed to fetch order");
// //         }
// //       } catch (error) {
// //         console.error("something went wrong:", error.message);
// //       }
// //     };

// //     fetchOrder();
// //   }, [orderId]);
// // const handleSubmit = async (e) => {
// //   e.preventDefault();
// //   if (!stripe || !elements) return;

// //   setLoading(true);
// //   try {
// //     // send correct JSON body
// //     const res = await api.post('/api/stripe/create-payment', { orderId });
// //     const { clientSecret } = res.data;

// //     const result = await stripe.confirmCardPayment(clientSecret, {
// //       payment_method: { card: elements.getElement(CardElement) }
// //     });

// //     if (result.error) {
// //       toast.error(result.error.message || 'Payment failed');
// //     } else if (result.paymentIntent?.status === 'succeeded') {
// //       toast.success('🎉 Payment succeeded!');
// //     }
// //   } catch (err) {
// //     console.error(err);
// //     toast.error('Something went wrong');
// //   } finally {
// //     setLoading(false);
// //   }
// // };


// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded">
// //       <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
// //       <button
// //         type="submit"
// //         disabled={!stripe || loading}
// //         className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
// //       >
// //         {loading ? 'Processing…' : 'Pay Now'}
// //       </button>
// //     </form>
// //   );
// // }

// // export default function PaymentPage() {
// //   const params = useParams();
// //   const orderId = params.id; // get id from URL

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-2xl mb-4">Complete your payment</h1>
// //       <Elements stripe={stripePromise}>
// //         <CheckoutForm orderId={orderId} />
// //       </Elements>
// //     </div>
// //   );
// // }


// // 'use client';
// // import React, { useState, useEffect } from 'react';
// // import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// // import { loadStripe } from '@stripe/stripe-js';
// // import { toast } from 'react-hot-toast';
// // import { useParams } from 'next/navigation';
// // import api from '@/lib/axios';

// // const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// // function CheckoutForm({ clientSecret, orderId }) {
// //   const stripe = useStripe();
// //   const elements = useElements();
// //   const [loading, setLoading] = useState(false);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!stripe || !elements) return;

// //     setLoading(true);
// //     try {
// //       const result = await stripe.confirmCardPayment(clientSecret, {
// //         payment_method: { card: elements.getElement(CardElement) }
// //       });

// //       if (result.error) {
// //         toast.error(result.error.message || 'Payment failed');
// //       } else if (result.paymentIntent?.status === 'succeeded') {
// //         toast.success('🎉 Payment succeeded!');
// //         // optionally redirect or update UI
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       toast.error('Something went wrong');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded">
// //       <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
// //       <button
// //         type="submit"
// //         disabled={!stripe || loading}
// //         className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
// //       >
// //         {loading ? 'Processing…' : 'Pay Now'}
// //       </button>
// //     </form>
// //   );
// // }

// // export default function PaymentPage() {
// //   const params = useParams();
// //   const orderId = params.id;
// //   const [clientSecret, setClientSecret] = useState(null);

// //   useEffect(() => {
// //     const createPaymentIntent = async () => {
// //       try {
// //         const res = await api.post('/api/stripe/create-payment', { orderId });
// //         if (res.data.success) {
// //           console.log('Got clientSecret:', res.data.clientSecret);
// //           setClientSecret(res.data.clientSecret);
// //         } else {
// //           console.log('Failed to create payment intent');
// //         }
// //       } catch (error) {
// //         console.error('Error creating payment intent:', error.message);
// //         toast.error('Could not initialize payment');
// //       }
// //     };

// //     if (orderId) {
// //       createPaymentIntent();
// //     }
// //   }, [orderId]);

// //   const appearance = { theme: 'stripe' };
// //   const options = { clientSecret, appearance };

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-2xl mb-4">Complete your payment</h1>
// //       {clientSecret ? (
// //         <Elements stripe={stripePromise} options={options}>
// //           <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
// //         </Elements>
// //       ) : (
// //         <p>Loading payment...</p>
// //       )}
// //     </div>
// //   );
// // }

// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import { toast } from 'react-hot-toast';
// import { useParams } from 'next/navigation';
// import api from '@/lib/axios';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// function CheckoutForm({ clientSecret }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     try {
//       const result = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           // after payment success, where to redirect
//           return_url: `${window.location.origin}/payment-success`
//         }
//       });

//       if (result.error) {
//         toast.error(result.error.message || 'Payment failed');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded shadow">
//       <PaymentElement options={{ layout: "tabs" }} />
//       <button
//         type="submit"
//         disabled={!stripe || loading}
//         className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 w-full"
//       >
//         {loading ? 'Processing…' : 'Confirm & Pay'}
//       </button>
//     </form>
//   );
// }

// export default function PaymentPage() {
//   const params = useParams();
//   const orderId = params.id;
//   const [orderData , setOrderData] = useState(null);
//   const [clientSecret, setClientSecret] = useState(null);

//   useEffect(() => {
//   const fetchOrderAndCreatePaymentIntent = async () => {
//     try {
//       // fetch order details
//       const orderRes = await api.get(`/api/orders/pending_payment/${orderId}`);
//       if (orderRes.data.success) {
//         console.log('Order data:', orderRes.data.order);
//         setOrderData(orderRes.data.order);
//       } else {
//         toast.error('Failed to load order details');
//       }

//       // create payment intent
//       const paymentRes = await api.post('/api/stripe/create-payment', { orderId });
//       if (paymentRes.data.success) {
//         console.log('Got clientSecret:', paymentRes.data.clientSecret);
//         setClientSecret(paymentRes.data.clientSecret);
//       } else {
//         toast.error('Failed to initialize payment');
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       toast.error('Could not load payment page');
//     }
//   };

//   if (orderId) fetchOrderAndCreatePaymentIntent();
// }, [orderId]);

//   const appearance = { theme: 'stripe' }; // Stripe default theme
//   const options = { clientSecret, appearance };

//   return (
//    <div className="p-8">
//   <h1 className="text-2xl mb-4 font-semibold">Complete your payment</h1>

//   {orderData && (
//     <div className="mb-6 p-4 border rounded shadow">
//       <h2 className="text-lg font-medium mb-2">{orderData.title}</h2>
//       <p className="text-gray-700">Price: ${orderData.price}</p>
//       <p className="text-gray-500 text-sm">Delivery time: {orderData.deliveryTime || 'N/A'} days</p>
//     </div>
//   )}

//   {clientSecret ? (
//     <Elements stripe={stripePromise} options={options}>
//       <CheckoutForm clientSecret={clientSecret} />
//     </Elements>
//   ) : (
//     <p>Loading payment form...</p>
//   )}
// </div>

//   );
// }



// "use client"
// import React, { useState, useEffect } from 'react';
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import { toast } from 'react-hot-toast';
// import { Clock, Shield, CreditCard, Check, Package, Star } from 'lucide-react';
// import api from '@/lib/axios';
// import { useRef } from 'react';
// import { useParams } from 'next/navigation';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// function CheckoutForm({ clientSecret, orderData }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setLoading(true);
//     try {
//       const result = await stripe.confirmPayment({
//         elements,
//         confirmParams: {
//           return_url: `${window.location.origin}/payment-success`
//         }
//       });

//       if (result.error) {
//         toast.error(result.error.message || 'Payment failed');
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
//         <p className="text-gray-600">Complete your secure payment to get started</p>
//       </div>

//       <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <div className="flex items-center gap-2 mb-2">
//           <Shield className="w-5 h-5 text-blue-600" />
//           <span className="text-blue-800 font-medium">Secure Payment</span>
//         </div>
//         <p className="text-blue-700 text-sm">Your payment information is encrypted and secure</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="payment-element-container">
//           <PaymentElement 
//             options={{ 
//               layout: "tabs",
//               style: {
//                 base: {
//                   fontSize: '16px',
//                   color: '#374151',
//                   fontFamily: 'Inter, system-ui, sans-serif',
//                   '::placeholder': {
//                     color: '#9CA3AF'
//                   }
//                 }
//               }
//             }} 
//           />
//         </div>

//         <div className="pt-4 border-t border-gray-200">
//           <button
//             type="submit"
//             disabled={!stripe || loading}
//             className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//           >
//             <CreditCard className="w-5 h-5" />
//             {loading ? 'Processing Payment...' : `Pay $${orderData?.price || 0}`}
//           </button>
//         </div>

//         <div className="text-center text-sm text-gray-500">
//           <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
//         </div>
//       </form>
//     </div>
//   );
// }

// function OrderSummary({ orderData }) {
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const applicationFee = orderData?.applicationFeeAmount ? (orderData.applicationFeeAmount / 100) : 0;
//   const subtotal = orderData?.price || 0;
//   const total = subtotal + applicationFee;

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
//         <p className="text-gray-600">Review your order details</p>
//       </div>

//       {/* Package Details */}
//       <div className="mb-6 p-6 bg-gray-50 rounded-lg">
//         <div className="flex items-center gap-3 mb-4">
//           <Package className="w-6 h-6 text-green-600" />
//           <h3 className="text-lg font-semibold text-gray-900">
//             {orderData?.selectedPackage?.name || 'Basic'} Package
//           </h3>
//         </div>
        
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Package Price</span>
//             <span className="font-semibold text-gray-900">${orderData?.selectedPackage?.price || orderData?.price || 0}</span>
//           </div>
          
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Clock className="w-4 h-4" />
//             <span>{orderData?.selectedPackage?.deliveryTime || 2} days delivery</span>
//           </div>
          
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Star className="w-4 h-4" />
//             <span>{orderData?.selectedPackage?.revisions || 1} revision{orderData?.selectedPackage?.revisions !== 1 ? 's' : ''}</span>
//           </div>
//         </div>

//         {/* Package Features */}
//         {orderData?.selectedPackage?.features && orderData.selectedPackage.features.length > 0 && (
//           <div className="mt-4 pt-4 border-t border-gray-200">
//             <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
//             <ul className="space-y-2">
//               {orderData.selectedPackage.features.map((feature, index) => (
//                 <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
//                   <span>{feature}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Addons */}
//       {orderData?.addons && orderData.addons.length > 0 && (
//         <div className="mb-6 p-6 bg-gray-50 rounded-lg">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-ons</h3>
//           <div className="space-y-3">
//             {orderData.addons.map((addon, index) => (
//               <div key={index} className="flex justify-between items-center">
//                 <span className="text-gray-600">{addon.name}</span>
//                 <span className="font-semibold text-gray-900">${addon.price}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Delivery Info */}
//       <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//         <div className="flex items-center gap-2 mb-1">
//           <Clock className="w-5 h-5 text-blue-600" />
//           <span className="font-medium text-blue-800">Delivery Date</span>
//         </div>
//         <p className="text-blue-700">
//           {orderData?.dueDate ? formatDate(orderData.dueDate) : 'To be determined'}
//         </p>
//       </div>

//       {/* Price Breakdown */}
//       <div className="border-t border-gray-200 pt-6">
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Subtotal</span>
//             <span className="text-gray-900">${subtotal}</span>
//           </div>
          
//           {applicationFee > 0 && (
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Service Fee</span>
//               <span className="text-gray-900">${applicationFee}</span>
//             </div>
//           )}
          
//           <div className="border-t border-gray-200 pt-3">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-gray-900">Total</span>
//               <span className="text-xl font-bold text-gray-900">${total}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Status */}
//       <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//           <span className="font-medium text-yellow-800">Payment Status: Pending</span>
//         </div>
//         <p className="text-yellow-700 text-sm mt-1">
//           Complete your payment to start the order
//         </p>
//       </div>
//     </div>
//   );
// }

// export default function PaymentPage() {
//   const params = useParams();
//   const orderId = params.id;
//   const [orderData, setOrderData] = useState(null);
//   const [clientSecret, setClientSecret] = useState(null);
//   const [loading, setLoading] = useState(true);


//   const paymentCreatedRef = useRef(false); // ✅ useRef instead of state

//   useEffect(() => {
//     const fetchOrderAndCreatePaymentIntent = async () => {
//       try {
//         // Fetch order details
//         const orderRes = await api.get(`/api/orders/pending_payment/${orderId}`);
//         if (orderRes.data.success) {
//           setOrderData(orderRes.data.order);
//         } else {
//           toast.error('Failed to load order details');
//         }

//         // Create payment intent
//         const paymentRes = await api.post('/api/stripe/create-payment', { orderId });
//         if (paymentRes.data.success) {
//           setClientSecret(paymentRes.data.clientSecret);
//           paymentCreatedRef.current = true; // ✅ mark as created
//         } else {
//           toast.error('Failed to initialize payment');
//         }
//       } catch (error) {
//         console.error('Error:', error.message);
//         toast.error('Could not load payment page');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId && !paymentCreatedRef.current) {
//       fetchOrderAndCreatePaymentIntent();
//     }
//   }, [orderId]);



//   const appearance = { 
//     theme: 'stripe',
//     variables: {
//       colorPrimary: '#16a34a',
//       colorBackground: '#ffffff',
//       colorText: '#374151',
//       fontFamily: 'Inter, system-ui, sans-serif',
//       borderRadius: '8px'
//     }
//   };
  
//   const options = { clientSecret, appearance };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading payment details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
//           <p className="text-gray-600">Secure checkout powered by Stripe</p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Order Summary - Left Side */}
//           <div className="order-2 lg:order-1">
//             <OrderSummary orderData={orderData} />
//           </div>

//           {/* Payment Form - Right Side */}
//           <div className="order-1 lg:order-2">
//             {clientSecret ? (
//               <Elements stripe={stripePromise} options={options}>
//                 <CheckoutForm clientSecret={clientSecret} orderData={orderData} />
//               </Elements>
//             ) : (
//               <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
//                 <div className="text-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
//                   <p className="text-gray-600">Loading payment form...</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast';
import { Clock, Shield, CreditCard, Check, Package, Star, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret, orderData, onPaymentSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`
        }
      });

      if (result.error) {
        console.error('Payment failed:', result.error);
        setError(result.error.message || 'Payment failed');
        toast.error(result.error.message || 'Payment failed');
      } else {
        // Payment succeeded, will redirect to return_url
        console.log('Payment initiated successfully');
        toast.success('Payment processing...');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Something went wrong with the payment');
      toast.error('Something went wrong with the payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Details</h2>
        <p className="text-gray-600">Complete your secure payment to get started</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Secure Payment</span>
        </div>
        <p className="text-blue-700 text-sm">Your payment information is encrypted and secure</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">Payment Error</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="payment-element-container">
          <PaymentElement 
            options={{ 
              layout: "tabs",
              style: {
                base: {
                  fontSize: '16px',
                  color: '#374151',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  '::placeholder': {
                    color: '#9CA3AF'
                  }
                }
              }
            }} 
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            {loading ? 'Processing Payment...' : `Pay $${orderData?.price || 0}`}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>By proceeding, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </form>
    </div>
  );
}

function OrderSummary({ orderData }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const applicationFee = orderData?.applicationFeeAmount ? (orderData.applicationFeeAmount / 100) : 0;
  const subtotal = orderData?.price || 0;
  const total = subtotal + applicationFee;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
        <p className="text-gray-600">Review your order details</p>
      </div>

      {/* Package Details */}
      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {orderData?.selectedPackage?.name || 'Basic'} Package
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Package Price</span>
            <span className="font-semibold text-gray-900">${orderData?.selectedPackage?.price || orderData?.price || 0}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{orderData?.selectedPackage?.deliveryTime || 2} days delivery</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4" />
            <span>{orderData?.selectedPackage?.revisions || 1} revision{orderData?.selectedPackage?.revisions !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Package Features */}
        {orderData?.selectedPackage?.features && orderData.selectedPackage.features.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
            <ul className="space-y-2">
              {orderData.selectedPackage.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Addons */}
      {orderData?.addons && orderData.addons.length > 0 && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-ons</h3>
          <div className="space-y-3">
            {orderData.addons.map((addon, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{addon.name}</span>
                <span className="font-semibold text-gray-900">${addon.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-800">Delivery Date</span>
        </div>
        <p className="text-blue-700">
          {orderData?.dueDate ? formatDate(orderData.dueDate) : 'To be determined'}
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${subtotal}</span>
          </div>
          
          {applicationFee > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Fee</span>
              <span className="text-gray-900">${applicationFee}</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">${total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="font-medium text-yellow-800">Payment Status: Pending</span>
        </div>
        <p className="text-yellow-700 text-sm mt-1">
          Complete your payment to start the order
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id;
  
  const [orderData, setOrderData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to prevent unnecessary re-renders
  const fetchOrderAndCreatePaymentIntent = useCallback(async () => {
    if (!orderId) {
      setError('Order ID is required');
      setLoading(false);
      return;
    }

    try {
      console.log('[Frontend] Fetching order details for:', orderId);
      
      // Fetch order details
      const orderRes = await api.get(`/api/orders/pending_payment/${orderId}`);
      console.log('[Frontend] Order response:', orderRes.data);
      
      if (!orderRes.data.success) {
        throw new Error(orderRes.data.message || 'Failed to load order details');
      }

      setOrderData(orderRes.data.order);

      // Create payment intent
      console.log('[Frontend] Creating payment intent for order:', orderId);
      const paymentRes = await api.post('/api/stripe/create-payment', { orderId });
      console.log('[Frontend] Payment response:', paymentRes.data);
      
      if (!paymentRes.data.success) {
        throw new Error(paymentRes.data.message || 'Failed to initialize payment');
      }

      setClientSecret(paymentRes.data.clientSecret);
      console.log('[Frontend] Payment intent created successfully');

    } catch (error) {
      console.error('[Frontend] Error loading payment page:', error);
      setError(error.response?.data?.message || error.message || 'Could not load payment page');
      toast.error(error.response?.data?.message || error.message || 'Could not load payment page');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderAndCreatePaymentIntent();
  }, [fetchOrderAndCreatePaymentIntent]);

  const appearance = { 
    theme: 'stripe',
    variables: {
      colorPrimary: '#16a34a',
      colorBackground: '#ffffff',
      colorText: '#374151',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '8px'
    }
  };
  
  const options = { clientSecret, appearance };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/orders')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Return to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure checkout powered by Stripe</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary - Left Side */}
          <div className="order-2 lg:order-1">
            <OrderSummary orderData={orderData} />
          </div>

          {/* Payment Form - Right Side */}
          <div className="order-1 lg:order-2">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  orderData={orderData}
                />
              </Elements>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 h-fit">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading payment form...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}