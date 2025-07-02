'use client';
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-hot-toast'; // or your favorite toast lib
import { usePayForOrder } from '@/hooks/usePayForOrder';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Call backend to create PaymentIntent
      const res = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const { clientSecret } = await res.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        toast.success('🎉 Payment succeeded!');
        // optionally redirect or update UI
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded">
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const orderId = '1234567890abcdef'; // Replace with real orderId

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Complete your payment</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm orderId={orderId} />
      </Elements>
    </div>
  );
}
