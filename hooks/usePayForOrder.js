import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export const usePayForOrder = () => {
  const pay = async (orderId) => {
    try {
      const res = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const { clientSecret } = await res.json();

      const stripe = await stripePromise;
      if (stripe && clientSecret) {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: { /* TODO: replace with actual CardElement */ }
          }
        });
        if (result.error) {
          console.error(result.error.message);
        } else if (result.paymentIntent?.status === 'succeeded') {
          console.log('Payment succeeded!');
        }
      }
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  return { pay };
};
