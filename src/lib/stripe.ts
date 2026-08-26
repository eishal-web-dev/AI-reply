import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey
  ? new Stripe(secretKey, { apiVersion: "2025-06-30.basil" })
  : null;

export const SAYIT_PRO_PRICE_ID =
  process.env.STRIPE_PRICE_ID || "price_1U8aZbGZza7hhpfqSTPcYVhu";

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel.");
  }
  return stripe;
}
