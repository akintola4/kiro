import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickOnboardDoc - AI-Powered Company Documentation Assistant",
  description:
    "Secure RAG chatbot for new hire onboarding. Get instant, accurate answers from your company documentation with AI-powered search and retrieval.",
  keywords: [
    "onboarding",
    "documentation",
    "AI chatbot",
    "RAG",
    "company knowledge",
    "employee training",
  ],
  openGraph: {
    title: "QuickOnboardDoc - AI-Powered Company Documentation Assistant",
    description:
      "Secure RAG chatbot for new hire onboarding. Get instant, accurate answers from your company documentation.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="QuickOnboard" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
