import { connectToDatabase } from "@/lib/mongodb";
import UsageLog from "@/models/UsageLog";
import User from "@/models/User";

export const ANON_FREE_LIMIT = 3; // total generations before requiring signup
export const FREE_USER_DAILY_LIMIT = 5; // per day for signed-in free users
export const ANON_COOKIE_NAME = "sayit_anon_id";

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

/**
 * Anonymous usage is tracked primarily via an httpOnly cookie counter (fast,
 * no DB round-trip). When a database is configured we additionally log by
 * anonId as a soft backstop against trivially clearing cookies — we never
 * store message content, only a count.
 */
export async function recordAnonUsage(anonId: string): Promise<void> {
  const db = await connectToDatabase();
  if (!db) return;

  const date = todayKey();
  await UsageLog.findOneAndUpdate(
    { anonId, date },
    { $inc: { count: 1 } },
    { upsert: true }
  );
}

export async function getUserDailyRemaining(userId: string): Promise<{
  remaining: number;
  limit: number;
  plan: "free" | "pro";
}> {
  const db = await connectToDatabase();
  if (!db) {
    return { remaining: FREE_USER_DAILY_LIMIT, limit: FREE_USER_DAILY_LIMIT, plan: "free" };
  }

  const user = await User.findById(userId);
  if (!user) {
    return { remaining: FREE_USER_DAILY_LIMIT, limit: FREE_USER_DAILY_LIMIT, plan: "free" };
  }

  if (user.plan === "pro") {
    return { remaining: Infinity, limit: Infinity, plan: "pro" };
  }

  const today = todayKey();
  const usedToday = user.dailyUsageDate === today ? user.dailyUsageCount : 0;
  return {
    remaining: Math.max(0, FREE_USER_DAILY_LIMIT - usedToday),
    limit: FREE_USER_DAILY_LIMIT,
    plan: "free",
  };
}

export async function incrementUserDailyUsage(userId: string): Promise<void> {
  const db = await connectToDatabase();
  if (!db) return;

  const today = todayKey();
  const user = await User.findById(userId);
  if (!user) return;

  if (user.dailyUsageDate === today) {
    user.dailyUsageCount += 1;
  } else {
    user.dailyUsageDate = today;
    user.dailyUsageCount = 1;
  }
  await user.save();
}
