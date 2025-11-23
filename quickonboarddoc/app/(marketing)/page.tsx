"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FloatingGhost } from "@/components/landing/FloatingGhost";
import { IconSkull, IconBrain, IconShield, IconRocket, IconFolder, IconMessageCircle } from "@tabler/icons-react";
import { Ghost } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading";

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to send message");
        return;
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 scroll-mt-20" aria-labelledby="contact-heading">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 id="contact-heading" className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Your full name"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Your email address"
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                placeholder="Tell us how we can help..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                aria-label="Your message"
                aria-required="true"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? <LoadingButton>Sending...</LoadingButton> : "Send Message"}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />
      <FloatingGhost />

      <main className="container mx-auto px-4 pt-32 pb-20" role="main">
        {/* Home Section */}
        <section id="home" aria-labelledby="hero-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <span className="text-sm font-medium text-primary">Powered by RAG Technology</span>
            <span className="text-primary">→</span>
          </motion.div>

          {/* Hero Title */}
          <h1 id="hero-heading" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Onboard with{" "}
            <span className="text-primary">
              precision
            </span>
            <br />
            using RAG + AI
          </h1>

          {/* Subtitle */}
          <p className="text-md md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            <span className="font-semibold text-foreground">QuickOnboardDoc</span> uses Retrieval-Augmented Generation to deliver accurate, source-backed answers from your company docs—instantly.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/signup" aria-label="Sign up for free account" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-lg px-8 h-14 rounded-full">
                Sign up, It's FREE!
              </Button>
            </Link>
            <a
              href="https://youtu.be/s3sGVz1iZ-4?si=6fXQJAMOJdLM8XRf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch demo video on YouTube"
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg px-8 h-14 rounded-full"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Video
              </Button>
            </a>
          </div>

          {/* Free Forever Badge */}
          <p className="text-sm text-muted-foreground mb-8">
            Free forever. No credit card.
          </p>

          {/* Product Hunt Badge */}
          {/* <motion.a
            href="https://www.producthunt.com"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="inline-block"
          >
            <div className="px-6 py-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center text-white font-bold">
                  P
                </div>
                <div className="text-left">
                  <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    #2 PRODUCT OF THE DAY
                  </div>
                  <div className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    Product Hunt
                  </div>
                </div>
                <div className="text-orange-600 dark:text-orange-400">→</div>
              </div>
            </div>
          </motion.a> */}
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative max-w-6xl mx-auto mb-32"
        >
          <div className="rounded-3xl overflow-hidden border border-border/50 bg-card p-4 md:p-8">
            <div className="aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img
                src="/app-preview.webp"
                alt="QuickOnboardDoc AI Chat Interface - showing AI assistant responding to employee questions with confidence scores and source citations"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </motion.div>

        {/* Quick Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.8 }}
              className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
{/* About Section */}
        <section id="about" className="py-20 scroll-mt-20" aria-labelledby="about-heading">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="mb-4">
              <span className="text-sm font-semibold text-primary">RAG-Powered Onboarding</span>
            </div>
            <h2 id="about-heading" className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
              Instant answers from your company docs
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              QuickOnboardDoc uses advanced RAG technology to provide instant, accurate responses to new hire questions. 
              Our AI works 24/7, constantly learning from your documentation to deliver precise answers when your team needs them most.
            </p>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12">
                Learn more →
              </Button>
            </Link>

            {/* Feature Preview Card */}
            <div className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Left side - Chat preview */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold">NH</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted rounded-2xl rounded-tl-none p-4">
                        <p className="text-sm">
                          What's our policy on remote work and flexible hours?
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">New Hire • 10:33 AM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Ghost className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-primary/10 rounded-2xl rounded-tr-none p-4 border border-primary/20">
                        <p className="text-sm">
                          Our remote work policy allows full flexibility! Team members can work from anywhere, 
                          with core hours from 10 AM - 3 PM for collaboration. Check the Employee Handbook section 4.2 for details.
                        </p>
                        <div className="mt-3 pt-3 border-t border-primary/20">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-primary">Confidence: 98%</span>
                            <span>•</span>
                            <span>Source: Employee Handbook</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 text-right">AI Assistant • Now</p>
                    </div>
                  </div>
                </div>

                {/* Right side - Stats */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Response Accuracy</span>
                      <span className="text-sm font-bold text-primary">99%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "99%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Answer Relevance</span>
                      <span className="text-sm font-bold text-primary">97%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "97%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Source Grounding</span>
                      <span className="text-sm font-bold text-primary">100%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Every response is backed by your actual documentation, ensuring new hires get accurate, 
                      trustworthy information every time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        {/* Detailed Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto mb-20"
        >
          <div className="mb-12">
            <span className="text-sm font-semibold text-primary">More features!</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">And more...</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore the little extras that help you onboard faster, stay organized, and keep everything running smoothly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Secure Authentication */}
            <div className="p-8 rounded-2xl border border-border bg-card">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconShield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Secure Authentication</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security with NextAuth. Support for email/password and Google OAuth for seamless access.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">JD</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">SM</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Miller</p>
                    <p className="text-xs text-muted-foreground">New Hire</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Management */}
            <div className="p-8 rounded-2xl border border-border bg-card">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconFolder className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Document Storage</h3>
                <p className="text-muted-foreground">
                  Upload and manage company documentation. Track document usage and keep your knowledge base up to date.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">📄</span>
                    </div>
                    <span className="text-sm font-medium">Employee Handbook</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2.4 MB</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                      <span className="text-xs">📋</span>
                    </div>
                    <span className="text-sm font-medium">Benefits Guide</span>
                  </div>
                  <span className="text-xs text-muted-foreground">1.8 MB</span>
                </div>
              </div>
            </div>

            {/* Multi-Workspace */}
            <div className="p-8 rounded-2xl border border-border bg-card">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconBrain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Multi-Workspace</h3>
                <p className="text-muted-foreground">
                  Manage multiple companies or departments. Each workspace has its own documents, members, and settings.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">Active Workspaces</span>
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Acme Corp</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Tech Startup Inc</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Design Agency</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Chat */}
            <div className="p-8 rounded-2xl border border-border bg-card">
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconMessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Chat Interface</h3>
                <p className="text-muted-foreground">
                  Intuitive chat experience with instant responses. See typing indicators and confidence scores in real-time.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                  </div>
                  <span>AI is typing...</span>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm mb-2">Average response time</p>
                  <p className="text-2xl font-bold text-primary">1.2s</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        </section>

        

        {/* Pricing/CTA Section */}
        <section id="pricing" className="py-20 scroll-mt-20" aria-labelledby="pricing-heading">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="rounded-3xl border border-border bg-card p-12 md:p-16 text-center">
              <h2 id="pricing-heading" className="text-4xl md:text-5xl font-bold mb-4">
                Get started today!
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Professional-grade tools. The easiest to use. Fully automated.
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Free forever. No credit card.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full px-8 h-12 rounded-full text-base">
                    Try it right now
                  </Button>
                </Link>
                <a
                  href="https://www.linkedin.com/in/tope-akintola-b47b381b9/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full px-8 h-12 rounded-full text-base"
                  >
                    Book a demo
                    <span className="ml-2">↗</span>
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}

const features = [
  {
    icon: IconBrain,
    title: "AI-Powered RAG",
    description: "Retrieval-augmented generation ensures accurate, grounded answers from your docs.",
  },
  {
    icon: IconShield,
    title: "Secure & Private",
    description: "Your company data stays protected with enterprise-grade security.",
  },
  {
    icon: IconRocket,
    title: "Fast Onboarding",
    description: "Get new hires up to speed in minutes, not days.",
  },
  {
    icon: IconSkull,
    title: "Crypt Keeper Theme",
    description: "Dark mode first with a hauntingly beautiful interface.",
  },
];
