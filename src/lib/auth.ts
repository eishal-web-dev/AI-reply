import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import User from "@/models/User";

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.warn(
    "AUTH_SECRET/NEXTAUTH_SECRET is not set — NextAuth will fail on every /api/auth/* request in production."
  );
}

const ASHES_SSO_CONSUME = "https://www.ashesstack.cloud/api/account-google?sso=consume";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      id: "ashes",
      name: "Ashes",
      credentials: {
        code: { label: "Ashes SSO code", type: "text" },
      },
      async authorize(credentials) {
        const code = String(credentials?.code || "").trim();
        if (!code) return null;

        const response = await fetch(ASHES_SSO_CONSUME, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          cache: "no-store",
        });
        if (!response.ok) return null;

        const ashesUser = await response.json();
        if (!ashesUser?.email) return null;

        if (isDatabaseConfigured()) {
          await connectToDatabase();
          const dbUser = await User.findOneAndUpdate(
            { email: String(ashesUser.email).toLowerCase() },
            {
              $setOnInsert: { email: String(ashesUser.email).toLowerCase(), plan: "free" },
              $set: { name: ashesUser.name || "" },
            },
            { upsert: true, new: true }
          );
          return {
            id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name || ashesUser.name || "",
          };
        }

        return {
          id: String(ashesUser.id || ashesUser.email),
          email: String(ashesUser.email),
          name: String(ashesUser.name || ""),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!isDatabaseConfigured() || !user.email) return true;
      try {
        await connectToDatabase();
        await User.findOneAndUpdate(
          { email: user.email },
          {
            $setOnInsert: { email: user.email, plan: "free" },
            $set: { name: user.name },
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        console.error("Failed to upsert user on sign-in", err);
      }
      return true;
    },
    async jwt({ token }) {
      if (!isDatabaseConfigured() || !token.email) return token;
      try {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.plan = dbUser.plan;
        }
      } catch (err) {
        console.error("Failed to attach user to token", err);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id?: string; plan?: string }).id =
          (token.userId as string | undefined) ?? "";
        (session.user as typeof session.user & { id?: string; plan?: string }).plan =
          (token.plan as string | undefined) ?? "free";
      }
      return session;
    },
  },
});
