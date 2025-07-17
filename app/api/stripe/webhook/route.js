// import Stripe from 'stripe';
// import { connectToDB } from '@/lib/db';
// import Orders from '@/models/orders';
// import Transaction from '@/models/transaction';

// const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// export async function POST(req) {
//   const rawBody = await req.text(); // read raw body
//   const sig = req.headers.get('stripe-signature');

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
//   } catch (err) {
//     return new Response(`Webhook error: ${err.message}`, { status: 400 });
//   }

//   await connectToDB();

//   switch (event.type) {
//     case 'payment_intent.succeeded': {
//       const pi = event.data.object;
//       const orderId = pi.metadata.orderId;

//       await Orders.findByIdAndUpdate(orderId, { paymentStatus: 'succeeded' });
//       await Transaction.create({
//         orderId,
//         type: 'payment',
//         stripeTransactionId: pi.id,
//         amount: pi.amount,
//         currency: pi.currency,
//         status: 'succeeded',
//       });
//       break;
//     }

//     case 'payment_intent.payment_failed': {
//       const pi = event.data.object;
//       const orderId = pi.metadata.orderId;

//       await Orders.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
//       await Transaction.create({
//         orderId,
//         type: 'payment',
//         stripeTransactionId: pi.id,
//         amount: pi.amount,
//         currency: pi.currency,
//         status: 'failed',
//       });
//       break;
//     }

//     // ⚡ Add payout or refund events here if needed
//   }

//   return new Response('ok', { status: 200 });
// }
import Stripe from 'stripe';
import { connectToDB } from '@/lib/db';
import Orders from '@/models/orders';
import Transaction from '@/models/transaction';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  console.log("[Webhook] Stripe webhook received");

  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    console.log("[Webhook] Event verified:", event.type);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  await connectToDB();
  console.log("[DB] Connected successfully");

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log("[Webhook] Payment succeeded:", paymentIntent.id);

        const order = await Orders.findOne({ paymentIntentId: paymentIntent.id });
        if (order && order.paymentStatus !== 'succeeded') {
          // Update order status
          await Orders.findByIdAndUpdate(order._id, { 
            paymentStatus: 'succeeded',
            status: 'awaiting_requirements',
            ispaid: true,
            lastUpdate: new Date()
          });

          // Create or update transaction
          const existingTransaction = await Transaction.findOne({ 
            paymentIntentId: paymentIntent.id 
          });

          if (!existingTransaction) {
            await Transaction.create({
              orderId: order._id,
              type: 'payment',
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              status: 'succeeded',
            });
          }

          console.log("[Webhook] Order and transaction updated for succeeded payment");
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log("[Webhook] Payment failed:", paymentIntent.id);

        const order = await Orders.findOne({ paymentIntentId: paymentIntent.id });
        if (order) {
          await Orders.findByIdAndUpdate(order._id, { 
            paymentStatus: 'failed',
            lastUpdate: new Date()
          });

          // Create transaction record for failed payment
          const existingTransaction = await Transaction.findOne({ 
            paymentIntentId: paymentIntent.id 
          });

          if (!existingTransaction) {
            await Transaction.create({
              orderId: order._id,
              type: 'payment',
              paymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              status: 'failed',
            });
          }

          console.log("[Webhook] Order updated for failed payment");
        }
        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object;
        console.log("[Webhook] Payment canceled:", paymentIntent.id);

        const order = await Orders.findOne({ paymentIntentId: paymentIntent.id });
        if (order) {
          await Orders.findByIdAndUpdate(order._id, { 
            paymentStatus: 'failed',
            status: 'cancelled',
            lastUpdate: new Date()
          });

          console.log("[Webhook] Order canceled");
        }
        break;
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error.message);
    return NextResponse.json({ 
      error: "Webhook processing failed" 
    }, { status: 500 });
  }
}