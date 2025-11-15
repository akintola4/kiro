import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={inter.className}>
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
