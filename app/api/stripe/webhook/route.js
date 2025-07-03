import Stripe from 'stripe';
import { connectToDB } from '@/lib/db';
import Orders from '@/models/orders';
import Transaction from '@/models/transaction';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const rawBody = await req.text(); // read raw body
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  await connectToDB();

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object;
      const orderId = pi.metadata.orderId;

      await Orders.findByIdAndUpdate(orderId, { paymentStatus: 'succeeded' });
      await Transaction.create({
        orderId,
        type: 'payment',
        stripeTransactionId: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: 'succeeded',
      });
      break;
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object;
      const orderId = pi.metadata.orderId;

      await Orders.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      await Transaction.create({
        orderId,
        type: 'payment',
        stripeTransactionId: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: 'failed',
      });
      break;
    }

    // ⚡ Add payout or refund events here if needed
  }

  return new Response('ok', { status: 200 });
}
