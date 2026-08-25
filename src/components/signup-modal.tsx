"use client";

import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function SignupModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle>You&apos;ve used your 3 free replies</DialogTitle>
          <DialogDescription>
            Sign up free to keep going — you&apos;ll get 5 replies every day,
            with no credit card required.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button onClick={() => signIn("google")}>Continue with Google</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
