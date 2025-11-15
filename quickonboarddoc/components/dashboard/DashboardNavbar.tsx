"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationBell } from "./NotificationBell";
import { IconBrandGithub, IconMenu2 } from "@tabler/icons-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

export function DashboardNavbar() {
  const { open, setOpen } = useSidebar();
  const { data: session } = useSession();

  return (
    <header className="flex-shrink-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Menu toggle for mobile */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <IconMenu2 className="h-5 w-5" />
          </Button>
          
          {/* User greeting */}
          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold">
              Welcome back, {session?.user?.name?.split(" ")[0]}!
            </h2>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <a
              href="https://github.com/akintola4"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <IconBrandGithub className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
