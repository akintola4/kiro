"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  IconHome,
  IconSettings,
  IconMail,
  IconBell,
  IconFolder,
  IconMessageCircle,
  IconSkull,
  IconLogout,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard/home", label: "Home", icon: IconHome },
  { href: "/dashboard/docchat", label: "Doc Chat", icon: IconMessageCircle },
  { href: "/dashboard/storage", label: "Storage", icon: IconFolder },
  { href: "/dashboard/notifications", label: "Notifications", icon: IconBell },
  { href: "/dashboard/contact", label: "Contact", icon: IconMail },
  { href: "/dashboard/settings", label: "Settings", icon: IconSettings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/dashboard/home" className="flex items-center gap-2">
          <IconSkull className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg">QuickOnboard</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <div className="flex justify-center">
          <ModeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <IconLogout className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
