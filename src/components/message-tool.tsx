"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignupModal } from "@/components/signup-modal";
import { ACTIONS, TONES, LANGUAGES, CONTEXTS } from "@/lib/options";
import type { ActionType } from "@/lib/ai";
import {
  ImagePlus,
  X,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Scissors,
  Smile,
  Briefcase,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActionValue = (typeof ACTIONS)[number]["value"];
type ToneValue = (typeof TONES)[number]["value"];
type LanguageValue = (typeof LANGUAGES)[number]["value"];
type ContextValue = (typeof CONTEXTS)[number]["value"];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function MessageTool() {
  const { status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMediaType, setImageMediaType] = useState<string | null>(null);

  const [action, setAction] = useState<ActionValue>("reply");
  const [tone, setTone] = useState<ToneValue>("professional");
  const [language, setLanguage] = useState<LanguageValue>("auto");
  const [context, setContext] = useState<ContextValue>("whatsapp");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleFile = useCallback((file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Screenshot is too large. Please use an image under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [prefix, base64] = result.split(",");
      const mediaType = prefix.match(/data:(.*);base64/)?.[1] ?? file.type;
      setImagePreview(result);
      setImageBase64(base64);
      setImageMediaType(mediaType);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function callGenerate(overrides?: {
    message?: string;
    action?: ActionType;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: overrides?.message ?? message,
          action: overrides?.action ?? action,
          tone,
          language,
          context,
          imageBase64: overrides?.message ? undefined : imageBase64 ?? undefined,
          imageMediaType: overrides?.message ? undefined : imageMediaType ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "SIGNUP_REQUIRED") {
          setShowSignup(true);
          return;
        }
        setError(data.error ?? "Something went wrong. Please try again.");
        toast.error(data.error ?? "Something went wrong.");
        return;
      }

      setResult(data.text);
      setDemo(Boolean(data.demo));
    } catch {
      setError("Network error. Please check your connection and try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleGenerate = () => {
    if (!message.trim() && !imageBase64) {
      toast.error("Paste a message or upload a screenshot first.");
      return;
    }
    callGenerate();
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  const refineResult = (refineAction: ActionType) => {
    if (!result) return;
    callGenerate({ message: result, action: refineAction });
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="mb-4">
          <Label htmlFor="message-input">Your message</Label>
        </div>

        <Textarea
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste the message you need to reply to…"
          rows={5}
          maxLength={6000}
          className="text-[15px]"
        />

        {imagePreview ? (
          <div className="relative mt-3 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Uploaded screenshot preview"
              className="max-h-40 rounded-xl border border-border-subtle object-cover"
            />
            <button
              onClick={removeImage}
              aria-label="Remove screenshot"
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background-elevated text-foreground shadow-lg ring-1 ring-border-strong hover:bg-danger/20 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 flex items-center gap-2 rounded-full border border-dashed border-border-strong px-4 py-2 text-sm text-foreground-muted transition-colors hover:border-accent/50 hover:text-foreground"
          >
            <ImagePlus className="h-4 w-4" />
            Upload a screenshot instead
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <p className="mt-2 text-xs text-foreground-muted">
          Screenshots are read only to generate your reply and are never
          stored.
        </p>

        {/* What do you want to do? */}
        <div className="mt-6">
          <Label>What do you want to do?</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.value}
                onClick={() => setAction(a.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  action === a.value
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border-subtle text-foreground-muted hover:border-border-strong hover:text-foreground"
                )}
                aria-pressed={action === a.value}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selectors */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="tone-select">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as ToneValue)}>
              <SelectTrigger id="tone-select" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language-select">Language</Label>
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v as LanguageValue)}
            >
              <SelectTrigger id="language-select" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="context-select">Context</Label>
            <Select
              value={context}
              onValueChange={(v) => setContext(v as ContextValue)}
            >
              <SelectTrigger id="context-select" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTEXTS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          size="lg"
          className="mt-6 w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate reply"
          )}
        </Button>

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        {status !== "authenticated" && (
          <p className="mt-3 text-xs text-foreground-muted">
            No signup required for your first reply.
          </p>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className="glass mt-4 rounded-3xl p-5 sm:p-7">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>Your reply</Label>
              {demo && <Badge variant="outline">Demo mode</Badge>}
            </div>
            <Pencil className="h-3.5 w-3.5 text-foreground-muted" aria-hidden />
          </div>

          <Textarea
            value={result}
            onChange={(e) => setResult(e.target.value)}
            rows={5}
            aria-label="Generated reply, editable"
            className="font-display text-[17px] leading-relaxed"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={handleCopy} variant="default" size="sm">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </Button>
            <Button
              onClick={() => callGenerate({ action: "regenerate" })}
              variant="subtle"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
            <Button
              onClick={() => refineResult("shorten")}
              variant="subtle"
              size="sm"
              disabled={loading}
            >
              <Scissors className="h-4 w-4" /> Make shorter
            </Button>
            <Button
              onClick={() => refineResult("friendlier")}
              variant="subtle"
              size="sm"
              disabled={loading}
            >
              <Smile className="h-4 w-4" /> Make friendlier
            </Button>
            <Button
              onClick={() => refineResult("professional")}
              variant="subtle"
              size="sm"
              disabled={loading}
            >
              <Briefcase className="h-4 w-4" /> Make more professional
            </Button>
          </div>
        </div>
      )}

      <SignupModal open={showSignup} onOpenChange={setShowSignup} />
    </div>
  );
}
