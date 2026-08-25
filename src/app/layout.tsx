import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const siteUrl = process.env.NEXTAUTH_URL || "https://sayit.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SayIt — AI reply generator for WhatsApp, email & more",
    template: "%s · SayIt",
  },
  description:
    "Paste a message or upload a screenshot and SayIt writes the perfect reply in seconds. A WhatsApp reply generator, email response generator, and Roman Urdu to English translator in one AI message-writing assistant.",
  keywords: [
    "AI reply generator",
    "WhatsApp reply generator",
    "email response generator",
    "Roman Urdu to English",
    "professional message writer",
  ],
  authors: [{ name: "SayIt" }],
  openGraph: {
    title: "SayIt — Never wonder what to say again",
    description:
      "Paste a message or upload a screenshot. SayIt writes the perfect reply in seconds.",
    url: siteUrl,
    siteName: "SayIt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SayIt — Never wonder what to say again",
    description:
      "Paste a message or upload a screenshot. SayIt writes the perfect reply in seconds.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout, not pages/_document; this rule targets the Pages Router only. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SayIt",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              description:
                "AI reply generator for WhatsApp, email, customer support and more.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster theme="dark" position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
