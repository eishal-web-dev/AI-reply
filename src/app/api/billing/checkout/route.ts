import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { requireStripe, SAYIT_PRO_PRICE_ID } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email?.toLowerCase();

  if (!userId || !email) {
    return NextResponse.json({ error: "Sign in with Ashes first." }, { status: 401 });
  }

  try {
    const stripe = requireStripe();
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    if (user.plan === "pro") {
      return NextResponse.json({ error: "You already have SayIt Pro.", code: "ALREADY_PRO" }, { status: 409 });
    }

    const origin = process.env.NEXTAUTH_URL || "https://aireply-dusky.vercel.app";
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: SAYIT_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/dashboard?billing=success`,
      cancel_url: `${origin}/#pricing`,
      client_reference_id: user._id.toString(),
      customer: user.stripeCustomerId || undefined,
      customer_email: user.stripeCustomerId ? undefined : email,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          sayitUserId: user._id.toString(),
          sayitEmail: email,
        },
      },
      metadata: {
        sayitUserId: user._id.toString(),
        sayitEmail: email,
        plan: "pro",
      },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start checkout." },
      { status: 500 }
    );
  }
}
