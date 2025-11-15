import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Check if user has a workspace
  const workspace = await prisma.workspace.findFirst({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  // Redirect to onboarding if no workspace
  if (!workspace) {
    redirect("/onboarding");
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="h-screen flex overflow-hidden bg-muted/30">
          {/* Desktop Sidebar - hidden on mobile, fixed height */}
          <div className="hidden lg:block flex-shrink-0">
            <AppSidebar />
          </div>
          
          {/* Mobile Sidebar - Sheet drawer, only renders on mobile */}
          <MobileSidebar />
          
          {/* Main content area - scrollable */}
          <main className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Dashboard Navbar - sticky at top */}
            <DashboardNavbar />
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
