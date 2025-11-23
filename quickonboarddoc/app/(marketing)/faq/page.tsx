"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconChevronDown, IconMessageCircle, IconRocket, IconShield, IconSparkles } from "@tabler/icons-react";
import { Ghost } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    category: "Getting Started",
    icon: IconRocket,
    questions: [
      {
        question: "What is QuickOnboardDoc?",
        answer: "QuickOnboardDoc is an AI-powered onboarding assistant that helps new hires get instant answers from your company documentation. Using advanced RAG (Retrieval-Augmented Generation) technology, it provides accurate, context-aware responses 24/7."
      },
      {
        question: "How do I get started?",
        answer: "Simply sign up for a free account, create your workspace, and upload your company documentation. Once your documents are processed, you can start asking questions immediately. The AI will learn from your documentation to provide accurate answers."
      },
      {
        question: "Is QuickOnboardDoc really free?",
        answer: "Yes! QuickOnboardDoc is free forever with no credit card required. We believe every company should have access to powerful onboarding tools, regardless of size or budget."
      },
      {
        question: "What types of documents can I upload?",
        answer: "You can upload PDFs, Word documents, text files, and more. Our system processes various document formats and extracts the information to power the AI assistant."
      }
    ]
  },
  {
    category: "AI & Technology",
    icon: IconSparkles,
    questions: [
      {
        question: "How does the AI work?",
        answer: "QuickOnboardDoc uses RAG (Retrieval-Augmented Generation) technology. When you ask a question, the AI searches your uploaded documents for relevant information, then generates a natural, accurate response based on that content. Every answer is grounded in your actual documentation."
      },
      {
        question: "How accurate are the AI responses?",
        answer: "Our AI maintains 99% response accuracy and 97% answer relevance. Every response includes a confidence score and source citation, so you can verify the information. The AI only answers based on your uploaded documents, ensuring trustworthy responses."
      },
      {
        question: "What happens if the AI doesn't know the answer?",
        answer: "If the AI can't find relevant information in your documents, it will let you know rather than making up an answer. This ensures new hires always get accurate information or know when to ask a human team member."
      },
      {
        question: "Can the AI learn from feedback?",
        answer: "Yes! The system continuously improves as you use it. You can provide feedback on responses, and the AI adapts to better understand your company's specific terminology and context."
      }
    ]
  },
  {
    category: "Workspaces & Teams",
    icon: IconMessageCircle,
    questions: [
      {
        question: "What is a workspace?",
        answer: "A workspace is your company's dedicated environment in QuickOnboardDoc. Each workspace has its own documents, team members, and settings. You can create multiple workspaces for different departments or companies."
      },
      {
        question: "How do I invite team members?",
        answer: "Go to the Team page in your dashboard and click 'Invite Member'. Enter their email address and assign a role (Admin or Member). They'll receive an invitation link to join your workspace."
      },
      {
        question: "What's the difference between Admin and Member roles?",
        answer: "Admins can upload/delete documents, invite/remove team members, and manage workspace settings. Members can use the AI chat and view documents but cannot make administrative changes. Workspace Owners have full control over everything."
      },
      {
        question: "Can I have multiple workspaces?",
        answer: "Yes! You can create and manage multiple workspaces. This is perfect if you work with multiple companies or want to separate documentation by department."
      }
    ]
  },
  // {
  //   category: "Security & Privacy",
  //   icon: IconShield,
  //   questions: [
  //     {
  //       question: "Is my company data secure?",
  //       answer: "Absolutely. We use enterprise-grade security with encrypted data storage and transmission. Your documents and conversations are private to your workspace and never shared with other users or used to train public AI models."
  //     },
  //     {
  //       question: "Where is my data stored?",
  //       answer: "All data is securely stored in encrypted databases with regular backups. We follow industry best practices for data protection and comply with relevant data privacy regulations."
  //     },
  //     {
  //       question: "Who can see my documents?",
  //       answer: "Only members of your workspace can access your documents and AI conversations. Each workspace is completely isolated, ensuring your company information remains confidential."
  //     },
  //     {
  //       question: "Can I delete my data?",
  //       answer: "Yes, you have full control over your data. You can delete individual documents, entire workspaces, or your account at any time. Deleted data is permanently removed from our systems."
  //     }
  //   ]
  // },
  {
    category: "Features & Usage",
    icon: IconSparkles,
    questions: [
      {
        question: "How many documents can I upload?",
        answer: "There's no limit on the number of documents you can upload. Upload as much documentation as you need to create a comprehensive knowledge base for your new hires."
      },
      {
        question: "How long does document processing take?",
        answer: "Most documents are processed within seconds to a few minutes, depending on size and complexity. You'll receive a notification when processing is complete and the document is ready for AI queries."
      },
      {
        question: "Can I update documents after uploading?",
        answer: "Yes! You can delete old versions and upload updated documents anytime. The AI will immediately use the latest information when answering questions."
      },
      {
        question: "What's the average response time?",
        answer: "The AI typically responds in 1-2 seconds. This includes searching your documents, analyzing context, and generating a natural language response with source citations."
      },
      {
        question: "Can I use QuickOnboardDoc on mobile?",
        answer: "Yes! QuickOnboardDoc is fully responsive and works great on mobile devices. New hires can get answers on the go, whether they're on a phone, tablet, or desktop."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-sm sm:text-base pr-4">{question}</span>
        <IconChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border"
        >
          <div className="p-4 sm:p-5 text-sm sm:text-base text-muted-foreground bg-muted/20">
            {answer}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Ghost className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about QuickOnboardDoc. Can't find what you're looking for?{" "}
            <Link href="/#contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold">{category.category}</h2>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {category.questions.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-3xl mx-auto mt-20"
        >
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 text-center">
            <Ghost className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our team is here to help. Get in touch and we'll answer any questions you have about QuickOnboardDoc.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/#contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
