"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  IconHome,
  IconSettings,
  IconMail,
  IconBell,
  IconFolder,
  IconMessageCircle,
  IconLogout,
  IconSparkles,
  IconChevronRight,
  IconUsers,
} from "@tabler/icons-react";
import { Ghost } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

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
      { href: "/dashboard/team", label: "Team", icon: IconUsers },
      { href: "/dashboard/settings", label: "Settings", icon: IconSettings },
    ],
  },
];

export function MobileSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { open, setOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Check on mount
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile && open) {
      setOpen(false);
    }
  }, [isMobile, open, setOpen]);

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <Link href="/dashboard/home" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Ghost className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">QuickOnboard</span>
                <span className="text-xs text-muted-foreground">AI Assistant</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-6">
              {navSections.map((section) => (
                <div key={section.title} className="px-3">
                  <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3 h-10 relative group",
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

            {/* Quick Stats Card */}
            <div className="mx-6 mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10 border border-primary/20 shadow-sm">
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
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500" 
                    style={{ width: "65%" }} 
                  />
                </div>
                <p className="text-xs text-muted-foreground">35% more than last month</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            {/* User Dropdown */}
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto p-3 hover:bg-muted/50"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center ring-2 ring-primary/10">
                      <span className="text-sm font-bold text-primary">
                        {session.user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    </div>
                    <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" onClick={() => setOpen(false)}>
                      <IconUsers className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
                      <IconSettings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <IconLogout className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
