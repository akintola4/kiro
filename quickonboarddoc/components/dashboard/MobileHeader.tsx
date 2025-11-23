"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import {
  IconMenu2,
  IconHome,
  IconSettings,
  IconMail,
  IconBell,
  IconFolder,
  IconMessageCircle,
  IconLogout,
  IconSparkles,
  IconX,
  IconBrandGithub,
} from "@tabler/icons-react";
import { NotificationBell } from "./NotificationBell";
import { Ghost } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    title: "Main",
    items: [
      { href: "/dashboard/home", label: "Home", icon: IconHome },
      { href: "/dashboard/docchat", label: "AI Chat", icon: IconMessageCircle, badge: "New" },
      { href: "/dashboard/storage", label: "Documents", icon: IconFolder },
    ],
  },
  {
    title: "Communication",
    items: [
      { href: "/dashboard/notifications", label: "Notifications", icon: IconBell },
      { href: "/dashboard/contact", label: "Contact", icon: IconMail },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/dashboard/settings", label: "Settings", icon: IconSettings },
    ],
  },
];

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard/home" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Ghost className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">QuickOnboard</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationBell />
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hidden sm:flex"
          >
            <a
              href="https://github.com/akintola4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub className="h-5 w-5" />
            </a>
          </Button>
          
          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <IconMenu2 className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <Link 
                      href="/dashboard/home" 
                      className="flex items-center gap-2"
                      onClick={() => setOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Ghost className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">QuickOnboard</span>
                        <span className="text-xs text-muted-foreground">AI Assistant</span>
                      </div>
                    </Link>
                  </div>

                  {/* User Info */}
                  {session?.user && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-gray-500/20 flex items-center justify-center ring-2 ring-primary/10">
                        <span className="text-sm font-bold text-primary">
                          {session.user.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-6">
                    {navSections.map((section) => (
                      <div key={section.title}>
                        <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                              <Link 
                                key={item.href} 
                                href={item.href}
                                onClick={() => setOpen(false)}
                              >
                                <Button
                                  variant={isActive ? "secondary" : "ghost"}
                                  className={cn(
                                    "w-full justify-start gap-3 h-10 relative",
                                    isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                  <span className="flex-1 text-left text-sm">{item.label}</span>
                                  {item.badge && (
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
                                      {item.badge}
                                    </span>
                                  )}
                                  {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                  )}
                                </Button>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Usage Card */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-gray-500/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <IconSparkles className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold">AI Usage</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">This month</span>
                        <span className="font-bold">247 queries</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-gray-500 rounded-full" 
                          style={{ width: "65%" }} 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">35% more than last month</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <IconLogout className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
