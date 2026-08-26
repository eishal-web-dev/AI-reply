import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import LocalPayment from "@/models/LocalPayment";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user = session?.user as { id?: string; email?: string } | undefined;
  if (!user?.id || !user.email) {
    return NextResponse.json({ error: "Please sign in with Ashes first." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Payment database is not configured." }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const method = String(body?.method || "");
  const reference = String(body?.reference || "").trim();

  if (!['raast', 'easypaisa', 'jazzcash', 'other'].includes(method)) {
    return NextResponse.json({ error: "Choose a valid payment method." }, { status: 400 });
  }
  if (reference.length < 4 || reference.length > 100) {
    return NextResponse.json({ error: "Enter a valid transaction/reference ID." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const payment = await LocalPayment.create({
      userId: user.id,
      email: user.email.toLowerCase(),
      method,
      reference,
      amount: 499,
      currency: "PKR",
      status: "pending",
    });
    return NextResponse.json({ ok: true, paymentId: payment._id, status: payment.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/duplicate key/i.test(message)) {
      return NextResponse.json({ error: "This transaction/reference ID was already submitted." }, { status: 409 });
    }
    console.error("Local payment submission failed", message);
    return NextResponse.json({ error: "Could not submit payment for verification." }, { status: 500 });
  }
}
