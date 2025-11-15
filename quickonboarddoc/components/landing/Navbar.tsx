"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Ghost } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setIsVisible(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 md:px-4 xl:px-5 lg:rounded-full z-50 lg:mx-auto lg:my-5 border border-gray-200/20 dark:border-gray-700/20 backdrop-blur-md backdrop-saturate-150 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-0"
      } ${
        scrolled
          ? "py-2 sm:w-full delay-150 duration-300 animate ease-in-out lg:w-8/12"
          : "p-2 sm:w-full delay-150 duration-300 animate ease-in-out lg:w-10/12"
      }`}
    >
      <nav className="flex items-center justify-between px-4 lg:px-6">
        {/* Left - Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-full hover:bg-accent"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Center - Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2"
        >
          <Ghost className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg text-foreground hidden lg:block">
            QuickOnboard
          </span>
        </Link>

        {/* Right - Actions */}
        <div className="flex gap-2 items-center ml-auto">
          <ModeToggle />
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="rounded-full">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="rounded-full">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
