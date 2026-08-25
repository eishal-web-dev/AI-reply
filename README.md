# SayIt

**Never wonder what to say again.** SayIt is an AI message-writing assistant — paste a message or upload a screenshot and it writes the perfect reply, in the tone, language, and context you choose. Built for WhatsApp, email, customer support, freelance clients, social media, and everyday conversations.

Live demo: _add your Vercel URL here after deploying_

## Features

- Paste text or upload a screenshot (Claude vision reads the text for you)
- Actions: write a reply, improve writing, translate, make it shorter
- Tones: professional, friendly, short, confident, polite, flirty, firm
- Languages: English, Urdu, Roman Urdu, Arabic, or auto-detect
- Context-aware: WhatsApp, email, customer support, freelance client, social media, personal
- Editable, copyable result card with regenerate / shorten / friendlier / more-professional actions
- 3 free replies with no signup, 5/day for free accounts, unlimited on Pro (Pro billing not yet wired up)
- Google sign-in (NextAuth v5), MongoDB-backed reply history and usage tracking
- Runs in **demo mode** automatically if `ANTHROPIC_API_KEY` isn't set — no crash, just sample replies

## Tech stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · shadcn/ui-style components on Radix primitives · Anthropic Claude API · MongoDB + Mongoose · NextAuth v5 (Auth.js) with Google · Zod validation · deployable on Vercel

## Getting started locally

```bash
git clone <your-repo-url>
cd sayit
npm install
cp .env.example .env.local
# fill in .env.local — see "Environment variables" below
npm run dev
```

Open http://localhost:3000. Without any keys configured, the reply tool still works end-to-end in **demo mode** (fake replies, so you can see the whole UI flow), and pages that don't need auth/DB work normally.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Real AI replies | From console.anthropic.com. Without it, the app runs in demo mode. |
| `MONGODB_URI` | Persisted reply history, daily quota resets | Without it, the app still works, but history isn't saved and usage tracking is best-effort/in-memory. |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Auth sessions | Generate with `npx auth secret` or `openssl rand -base64 32`. Required in production. |
| `NEXTAUTH_URL` | Auth callbacks, canonical URLs in metadata/sitemap | e.g. `https://your-app.vercel.app`, no trailing slash. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login | From Google Cloud Console → APIs & Services → Credentials. Authorized redirect URI: `<NEXTAUTH_URL>/api/auth/callback/google`. |

## Deploying to Vercel

1. Push this repo to GitHub (see commands below).
2. In Vercel: **New Project** → import the repo.
3. Add every variable from the table above under **Project Settings → Environment Variables** (this is what actually powers the live app — a GitHub Actions secret alone does *not* reach your deployed app).
4. Deploy. Vercel auto-detects Next.js; no build config changes needed.
5. Update `NEXTAUTH_URL` to your real deployment URL and add the matching Google OAuth redirect URI, then redeploy.

## Project structure

```
src/
  app/
    page.tsx                 landing page (hero + tool + all marketing sections)
    login/page.tsx            Google sign-in
    dashboard/page.tsx         protected dashboard (history, usage, account)
    privacy/, terms/           placeholder legal pages — replace before launch
    sitemap.ts, robots.ts      SEO
    api/
      generate/route.ts        core reply-generation endpoint
      usage/route.ts            free-usage remaining
      history/route.ts          list / clear-all reply history
      history/[id]/route.ts     delete / save a single reply
      auth/[...nextauth]/       NextAuth handler
  components/
    message-tool.tsx           the core AI tool (input, selectors, result)
    dashboard-client.tsx        dashboard history UI
    ui/                         shadcn-style primitives (button, card, select, dialog, ...)
    navbar.tsx, footer.tsx, hero.tsx, pricing.tsx, faq.tsx, ...
  lib/
    anthropic.ts                Claude system prompt + call + demo-mode fallback
    mongodb.ts                  cached DB connection (returns null gracefully if unconfigured)
    auth.ts                     NextAuth config
    usage.ts                    free-tier quota logic
    rate-limit.ts                in-memory IP rate limiter
    validations.ts               Zod schemas
  models/                       Mongoose schemas: User, Reply, UsageLog
  proxy.ts                      route protection (Next.js 16's middleware convention)
```

## Security notes

- All Claude calls run server-side only (`/api/generate`) — the API key never reaches the browser.
- Request bodies are validated with Zod (message length capped at 6,000 chars, images capped at 5MB, only JPEG/PNG/WEBP accepted).
- IP-based rate limiting (20 requests/minute) on the generate endpoint.
- Message content is never logged to the console; only a short excerpt is stored in a signed-in user's own history, visible only to them.
- Anonymous usage is tracked via an httpOnly cookie, not by storing message content.

**Scaling note:** the in-memory rate limiter (`src/lib/rate-limit.ts`) works for a single instance. For real production traffic across multiple serverless instances, swap it for Upstash Redis or Vercel KV — the function signature is designed to be a drop-in replacement.

## What's stubbed / not yet implemented

- **Stripe billing** — the Pro plan UI and pricing exist, but checkout isn't wired up (per the original spec: "do not implement payment yet, build the pricing UI and data structure so Stripe can be added later"). `User.plan` is already a `"free" | "pro"` field ready for a webhook to flip.
- **Fonts** — loaded via `<link>` tag to Google Fonts rather than `next/font/google`, because the sandbox this was built in has no network access to `fonts.googleapis.com`. This works fine as-is; swapping to `next/font/google` for self-hosted font optimization is a nice-to-have, not a blocker.
- **Privacy/Terms pages** — placeholder legal copy. Replace with real policy text (and probably a lawyer) before taking real signups.

## Scripts

```bash
npm run dev     # start dev server (Turbopack)
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # eslint
```
