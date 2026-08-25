import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  ANON_COOKIE_NAME,
  ANON_FREE_LIMIT,
  FREE_USER_DAILY_LIMIT,
  getUserDailyRemaining,
} from "@/lib/usage";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (userId) {
    const { remaining, limit, plan } = await getUserDailyRemaining(userId);
    return NextResponse.json({
      authenticated: true,
      plan,
      remaining: remaining === Infinity ? null : remaining,
      limit: limit === Infinity ? null : limit,
    });
  }

  const usedRaw = req.cookies.get("sayit_anon_used")?.value;
  const used = usedRaw ? parseInt(usedRaw, 10) || 0 : 0;

  return NextResponse.json({
    authenticated: false,
    plan: "anonymous",
    remaining: Math.max(0, ANON_FREE_LIMIT - used),
    limit: ANON_FREE_LIMIT,
    anonCookiePresent: Boolean(req.cookies.get(ANON_COOKIE_NAME)),
    signupDailyLimit: FREE_USER_DAILY_LIMIT,
  });
}
