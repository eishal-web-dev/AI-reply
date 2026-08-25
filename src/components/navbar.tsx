"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <nav className="glass flex w-full items-center justify-between rounded-full px-4 py-2.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold tracking-tight">
              Say<span className="text-accent">It</span>
            </span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#how-it-works"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {status === "authenticated" && session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="rounded-full focus-visible:outline-2 focus-visible:outline-accent"
                    aria-label="Account menu"
                  >
                    <Avatar>
                      <AvatarImage
                        src={session.user.image ?? undefined}
                        alt={session.user.name ?? "Account"}
                      />
                      <AvatarFallback>
                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                  onClick={() => signIn("google")}
                >
                  Log in
                </Button>
                <Button size="sm" onClick={() => signIn("google")}>
                  Try it free
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
