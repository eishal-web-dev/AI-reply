import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { requireStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in with Ashes first." }, { status: 401 });
  }

  try {
    const stripe = requireStripe();
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user?.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe billing profile found." }, { status: 404 });
    }

    const origin = process.env.NEXTAUTH_URL || "https://aireply-dusky.vercel.app";
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("Stripe portal error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not open billing portal." },
      { status: 500 }
    );
  }
}
