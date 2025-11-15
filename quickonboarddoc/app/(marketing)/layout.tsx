import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuickOnboardDoc - AI-Powered Employee Onboarding Platform",
  description:
    "Streamline your employee onboarding with AI-powered document chat. Get instant answers from company docs using advanced RAG technology. Free forever, no credit card required.",
  keywords: [
    "employee onboarding",
    "AI onboarding",
    "document chat",
    "RAG technology",
    "company documentation",
    "new hire onboarding",
    "HR automation",
    "onboarding software",
  ],
  authors: [{ name: "Dev Akintola", url: "https://x.com/photofola" }],
  creator: "Dev Akintola",
  publisher: "QuickOnboardDoc, Inc.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://quickonboarddoc.vercel.app",
    title: "QuickOnboardDoc - AI-Powered Employee Onboarding",
    description:
      "Streamline employee onboarding with AI. Get instant answers from company docs using advanced RAG technology.",
    siteName: "QuickOnboardDoc",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuickOnboardDoc - AI-Powered Employee Onboarding",
    description:
      "Streamline employee onboarding with AI. Get instant answers from company docs.",
    creator: "@photofola",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
