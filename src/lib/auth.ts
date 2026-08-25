import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import User from "@/models/User";

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  console.warn(
    "AUTH_SECRET/NEXTAUTH_SECRET is not set — NextAuth will fail on every /api/auth/* request in production. Set one in your deployment's environment variables (generate with `npx auth secret`)."
  );
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  // NextAuth normally auto-detects AUTH_SECRET, but being explicit here
  // means a missing/misnamed secret fails loudly in logs (see the
  // isSecretConfigured warning below) rather than as an opaque 500 on
  // every /api/auth/* route.
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  // Vercel deployments (and any host behind a reverse proxy) need this so
  // NextAuth trusts the forwarded host/protocol headers instead of
  // rejecting the request.
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
            $set: { name: user.name, image: user.image },
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
