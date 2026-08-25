import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DashboardClient } from "@/components/dashboard-client";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-3xl font-medium">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-foreground-muted">
          {session?.user?.email}
        </p>

        <DashboardClient />
      </main>
      <Footer />
    </>
  );
}
