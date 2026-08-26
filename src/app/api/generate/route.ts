import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@/lib/auth";
import { generateReply } from "@/lib/ai";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import Reply from "@/models/Reply";
import {
  generateRequestSchema,
  MAX_IMAGE_BYTES,
} from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  ANON_COOKIE_NAME,
  ANON_FREE_LIMIT,
  getUserDailyRemaining,
  incrementUserDailyUsage,
  recordAnonUsage,
} from "@/lib/usage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`generate:${ip}`, 20, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again shortly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.imageBase64) {
    const approxBytes = Math.ceil((data.imageBase64.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Screenshot is too large. Please use an image under 5MB." },
        { status: 400 }
      );
    }
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (userId) {
    const { remaining, plan } = await getUserDailyRemaining(userId);
    if (plan === "free" && remaining <= 0) {
      return NextResponse.json(
        {
          error:
            "You've used today's 3 free replies. Come back tomorrow, or upgrade to Pro for unlimited replies.",
          code: "DAILY_LIMIT_REACHED",
        },
        { status: 403 }
      );
    }
  } else {
    const usedRaw = req.cookies.get("sayit_anon_used")?.value;
    const used = usedRaw ? parseInt(usedRaw, 10) || 0 : 0;

    if (used >= ANON_FREE_LIMIT) {
      return NextResponse.json(
        {
          error: "You've used your 3 free replies. Sign in with Ashes to get 3 free replies every day.",
          code: "SIGNUP_REQUIRED",
        },
        { status: 403 }
      );
    }
  }

  let result;
  try {
    result = await generateReply({
      message: data.message,
      action: data.action,
      tone: data.tone,
      language: data.language,
      context: data.context,
      imageBase64: data.imageBase64,
      imageMediaType: data.imageMediaType,
    });
  } catch (err) {
    console.error("Gemini generation failed", err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        error:
          "SayIt couldn't generate a reply right now. Please try again in a moment.",
      },
      { status: 502 }
    );
  }

  const response = NextResponse.json({
    text: result.text,
    demo: result.demo,
  });

  if (userId) {
    await incrementUserDailyUsage(userId);
    if (isDatabaseConfigured()) {
      try {
        await connectToDatabase();
        await Reply.create({
          userId,
          inputExcerpt: data.message.slice(0, 200),
          output: result.text,
          action: data.action,
          tone: data.tone,
          language: data.language,
          context: data.context,
        });
      } catch (err) {
        console.error("Failed to save reply history", err instanceof Error ? err.message : err);
      }
    }
  } else {
    const anonId = req.cookies.get(ANON_COOKIE_NAME)?.value ?? randomUUID();
    const usedRaw = req.cookies.get("sayit_anon_used")?.value;
    const used = (usedRaw ? parseInt(usedRaw, 10) || 0 : 0) + 1;

    response.cookies.set(ANON_COOKIE_NAME, anonId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    response.cookies.set("sayit_anon_used", String(used), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    void recordAnonUsage(anonId);
  }

  return response;
}
