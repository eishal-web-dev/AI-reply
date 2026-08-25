import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import Reply from "@/models/Reply";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ success: true, demo: true });
  }

  const { id } = await params;
  await connectToDatabase();
  await Reply.deleteOne({ _id: id, userId });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ success: true, demo: true });
  }

  const body = await req.json().catch(() => ({}));
  const { id } = await params;
  await connectToDatabase();
  await Reply.updateOne(
    { _id: id, userId },
    { $set: { saved: Boolean(body.saved) } }
  );

  return NextResponse.json({ success: true });
}
