"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost, Home, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NotFound() {
  const [ghostClicks, setGhostClicks] = useState(0);
  const [isPartyMode, setIsPartyMode] = useState(false);

  const handleGhostClick = () => {
    const newCount = ghostClicks + 1;
    setGhostClicks(newCount);

    if (newCount === 1) {
      toast("👻 Boo!");
    } else if (newCount === 3) {
      toast("🎃 You found me!");
    } else if (newCount === 5) {
      toast("🎉 Keep clicking...");
    } else if (newCount === 10) {
      setIsPartyMode(true);
      toast.success("🎊 PARTY MODE ACTIVATED! 🎊");
      // Reset after 5 seconds
      setTimeout(() => {
        setIsPartyMode(false);
        setGhostClicks(0);
      }, 5000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden transition-all duration-500 ${
      isPartyMode ? "animate-pulse" : ""
    }`}>
      {/* Floating Ghosts Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Ghost className="absolute top-20 left-10 w-12 h-12 text-primary/20 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }} />
        <Ghost className="absolute top-40 right-20 w-16 h-16 text-primary/10 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }} />
        <Ghost className="absolute bottom-32 left-1/4 w-10 h-10 text-primary/15 animate-bounce" style={{ animationDelay: "2s", animationDuration: "3.5s" }} />
        <Ghost className="absolute bottom-20 right-1/3 w-14 h-14 text-primary/10 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "4.5s" }} />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Large 404 with Ghost */}
        <div className="relative mb-8">
          <h1 className={`text-[150px] sm:text-[200px] md:text-[250px] font-bold leading-none select-none transition-all duration-300 ${
            isPartyMode ? "text-primary animate-pulse" : "text-primary/10"
          }`}>
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handleGhostClick}
              className="relative group cursor-pointer focus:outline-none"
              aria-label="Click the ghost for a surprise"
            >
              <Ghost className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 text-primary transition-all duration-300 ${
                isPartyMode ? "animate-spin" : "animate-pulse group-hover:scale-110"
              }`} />
              {isPartyMode && (
                <>
                  <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 animate-bounce" />
                  <Sparkles className="absolute -bottom-4 -left-4 w-8 h-8 text-pink-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-blue-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  <Sparkles className="absolute -bottom-4 -right-4 w-8 h-8 text-green-400 animate-bounce" style={{ animationDelay: "0.6s" }} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Boo! Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
            This page has vanished into the void. Even our ghosts couldn't find it!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button size="lg" className="rounded-full px-8">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Fun Message */}
        <p className="mt-12 text-sm text-muted-foreground">
          Lost? Try checking the URL or head back to safety.
        </p>
      </div>
    </div>
  );
}
