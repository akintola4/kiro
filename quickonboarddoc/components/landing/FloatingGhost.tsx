"use client";

import { useState, useEffect } from "react";
import { Ghost, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const positions = [
  { position: "bottom-8 right-8", name: "bottom-right" },
  { position: "bottom-8 left-8", name: "bottom-left" },
  { position: "top-24 right-8", name: "top-right" },
  { position: "top-24 left-8", name: "top-left" },
];

export function FloatingGhost() {
  const [open, setOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // Change position after fade out
      setTimeout(() => {
        setCurrentPosition((prev) => (prev + 1) % positions.length);
        // Fade in
        setIsVisible(true);
      }, 500);
    }, 5000); // Change position every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Ghost Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed ${positions[currentPosition].position} z-40 transition-all duration-500 hover:scale-125 cursor-pointer group animate-float ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Secret Easter Egg"
      >
        <Ghost className="w-12 h-12 text-primary drop-shadow-lg" />
      </button>

      {/* Easter Egg Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg border-2 border-primary/50 bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
          {/* Animated Ghosts Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <Ghost className="absolute top-4 left-4 w-8 h-8 text-primary animate-ghost-1" />
            <Ghost className="absolute top-8 right-8 w-6 h-6 text-primary animate-ghost-2" />
            <Ghost className="absolute bottom-12 left-12 w-7 h-7 text-primary animate-ghost-3" />
            <Ghost className="absolute bottom-8 right-16 w-5 h-5 text-primary animate-ghost-4" />
          </div>

          {/* Pac-Man Dots Trail */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent">
            <div className="flex justify-around items-center h-full px-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-300" />
            </div>
          </div>

          <DialogHeader className="relative z-10">
            <DialogTitle className="flex items-center justify-center gap-3 text-3xl pt-4">
              <Ghost className="w-8 h-8 text-primary animate-bounce" />
              <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-pulse">
                You found the secret!
              </span>
              <Sparkles className="w-6 h-6 text-primary animate-spin-slow" />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4 relative z-10">
            {/* Spooky Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 animate-pulse">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">EASTER EGG UNLOCKED</span>
                <Zap className="w-4 h-4 text-primary" />
              </div>
            </div>

            <p className="text-center text-base text-foreground font-semibold">
              Congrats on discovering our spooky easter egg! 🎃👻
            </p>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">QuickOnboardDoc</span> was built to revolutionize how companies onboard new hires.
                Using cutting-edge RAG (Retrieval-Augmented Generation) technology, we make company knowledge instantly accessible through AI-powered conversations.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/30">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">🎮 Fun fact:</span> This entire app was built using{" "}
                <a
                  href="https://kiro.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-1"
                >
                  Kiro IDE
                  <Sparkles className="w-3 h-3 inline" />
                </a>
                , an AI-powered development environment that helps developers build faster and smarter!
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href="https://kiro.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full rounded-full relative overflow-hidden group" size="lg">
                  <span className="relative z-10">Try Kiro IDE →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Button>
              </a>
              <Button
                variant="outline"
                className="w-full rounded-full border-primary/30 hover:bg-primary/10"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>

          {/* Bottom Pac-Man Dots */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent">
            <div className="flex justify-around items-center h-full px-4">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes ghost-1 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(10px, -10px);
          }
        }

        @keyframes ghost-2 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-15px, 10px);
          }
        }

        @keyframes ghost-3 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(12px, 8px);
          }
        }

        @keyframes ghost-4 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-8px, -12px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-ghost-1 {
          animation: ghost-1 4s ease-in-out infinite;
        }

        .animate-ghost-2 {
          animation: ghost-2 5s ease-in-out infinite;
        }

        .animate-ghost-3 {
          animation: ghost-3 4.5s ease-in-out infinite;
        }

        .animate-ghost-4 {
          animation: ghost-4 3.5s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
