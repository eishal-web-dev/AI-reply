"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trash2, Plus, Bookmark, BookmarkCheck } from "lucide-react";

interface HistoryItem {
  id: string;
  inputExcerpt: string;
  output: string;
  action: string;
  tone: string;
  language: string;
  context: string;
  saved: boolean;
  createdAt: string;
}

interface UsageStatus {
  authenticated: boolean;
  plan: string;
  remaining: number | null;
  limit: number | null;
}

export function DashboardClient() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [historyRes, usageRes] = await Promise.all([
          fetch("/api/history"),
          fetch("/api/usage"),
        ]);
        const historyData = await historyRes.json();
        const usageData = await usageRes.json();
        setHistory(historyData.items ?? []);
        setDemoMode(Boolean(historyData.demo));
        setUsage(usageData);
      } catch {
        toast.error("Couldn't load your dashboard data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function deleteItem(id: string) {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
    if (!res.ok) toast.error("Couldn't delete that item.");
  }

  async function clearAll() {
    setHistory([]);
    const res = await fetch("/api/history?all=true", { method: "DELETE" });
    if (!res.ok) toast.error("Couldn't clear history.");
    else toast.success("History cleared");
  }

  async function toggleSave(item: HistoryItem) {
    setHistory((prev) =>
      prev.map((h) => (h.id === item.id ? { ...h, saved: !h.saved } : h))
    );
    await fetch(`/api/history/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saved: !item.saved }),
    });
  }

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage today</CardTitle>
          </CardHeader>
          <CardContent>
            {usage ? (
              usage.plan === "pro" ? (
                <p className="font-display text-2xl">Unlimited</p>
              ) : (
                <>
                  <p className="font-display text-2xl">
                    {usage.remaining} / {usage.limit}
                  </p>
                  <p className="text-xs text-foreground-muted">replies remaining</p>
                </>
              )
            ) : (
              <p className="text-sm text-foreground-muted">Loading…</p>
            )}
          </CardContent>
        </Card>

        <Button asChild className="w-full">
          <Link href="/">
            <Plus className="h-4 w-4" /> New reply
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Plan: {usage?.plan ?? "free"}</CardDescription>
          </CardHeader>
        </Card>
      </aside>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium">Recent replies</h2>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4" /> Clear all
            </Button>
          )}
        </div>

        {demoMode && (
          <p className="mb-4 text-sm text-foreground-muted">
            Demo mode: connect a MongoDB database to persist reply history.
          </p>
        )}

        {loading ? (
          <p className="text-sm text-foreground-muted">Loading history…</p>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-foreground-muted">
              No replies yet. Generate one and it&apos;ll show up here.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <Card key={item.id}>
                <CardContent className="py-5">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{item.context}</Badge>
                    <Badge variant="outline">{item.tone}</Badge>
                    <Badge variant="outline">{item.language}</Badge>
                    <span className="ml-auto text-xs text-foreground-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground-muted">
                    {item.inputExcerpt}
                  </p>
                  <p className="font-display mt-2 leading-relaxed">
                    {item.output}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSave(item)}
                    >
                      {item.saved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 text-accent" /> Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" /> Save
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
