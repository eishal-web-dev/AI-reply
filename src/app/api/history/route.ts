import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import Reply from "@/models/Reply";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ items: [], demo: true });
  }

  await connectToDatabase();
  const items = await Reply.find({ userId }).sort({ createdAt: -1 }).limit(100).lean();

  return NextResponse.json({
    items: items.map((item) => ({
      id: item._id.toString(),
      inputExcerpt: item.inputExcerpt,
      output: item.output,
      action: item.action,
      tone: item.tone,
      language: item.language,
      context: item.context,
      saved: item.saved,
      createdAt: item.createdAt,
    })),
  });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ success: true, demo: true });
  }

  await connectToDatabase();

  const url = new URL(req.url);
  if (url.searchParams.get("all") === "true") {
    await Reply.deleteMany({ userId });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Missing id. Use /api/history/[id] to delete a single item." }, { status: 400 });
}
