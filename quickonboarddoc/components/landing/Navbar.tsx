"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Ghost, Menu, X } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

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
        {/* Logo - Left on mobile, center on desktop */}
        <Link
          href="/"
          className="flex items-center gap-2 group md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          <Ghost className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-lg text-foreground hidden lg:block">
            QuickOnboard
          </span>
        </Link>

        {/* Left - Navigation Links (hidden on mobile) */}
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

        {/* Right - Actions */}
        <div className="flex gap-2 items-center ml-auto">
          <ModeToggle />
          {status === "authenticated" ? (
            <Link href="/dashboard/home">
              <Button size="sm" className="rounded-full">
                Launch App
              </Button>
            </Link>
          ) : (
            <Link href="/signup" className="hidden md:block">
              <Button size="sm" className="rounded-full">
                Get Started
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="rounded-full">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 mb-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Ghost className="w-6 h-6 text-primary" />
                  <span className="font-bold text-lg">QuickOnboard</span>
                </Link>

                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-base font-medium text-foreground/70 hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  {status === "authenticated" ? (
                    <Link href="/dashboard/home" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-full">
                        Launch App
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full rounded-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full rounded-full">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
