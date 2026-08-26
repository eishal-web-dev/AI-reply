import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { requireStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const PRO_STATUSES = new Set(["active", "trialing"]);

async function updateFromSubscription(subscription: Stripe.Subscription) {
  await connectToDatabase();

  const userId = subscription.metadata?.sayitUserId;
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  const query = userId
    ? { _id: userId }
    : customerId
      ? { stripeCustomerId: customerId }
      : null;

  if (!query) return;

  await User.findOneAndUpdate(query, {
    $set: {
      plan: PRO_STATUSES.has(subscription.status) ? "pro" : "free",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: subscription.status,
    },
  });
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  try {
    const stripe = requireStripe();
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.sayitUserId || session.client_reference_id;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (userId) {
          await connectToDatabase();
          await User.findByIdAndUpdate(userId, {
            $set: {
              plan: "pro",
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripeSubscriptionStatus: "active",
            },
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await updateFromSubscription(event.data.object as Stripe.Subscription);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook." },
      { status: 400 }
    );
  }
}
