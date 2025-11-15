import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconFolder, IconMessageCircle, IconUsers, IconSparkles, IconTrendingUp, IconClock } from "@tabler/icons-react";
import Link from "next/link";

export default async function DashboardHomePage() {
  const session = await auth();

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session?.user?.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          documents: true,
          members: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
          Here's what's happening with your workspaces today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <IconSparkles className="w-4 h-4" />
              AI Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">247</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 dark:text-green-400">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <IconFolder className="w-4 h-4" />
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workspaces.reduce((acc, w) => acc + w._count.documents, 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all workspaces</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <IconTrendingUp className="w-4 h-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground mt-1">Lightning fast ⚡</p>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Your Workspaces</h2>
          <Link href="/onboarding">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              + New Workspace
            </Button>
          </Link>
        </div>

        {workspaces.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <IconFolder className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="mb-2">No workspaces yet</CardTitle>
              <CardDescription className="mb-4 text-center max-w-sm">
                Create your first workspace to start onboarding new hires with AI
              </CardDescription>
              <Link href="/onboarding">
                <Button>Create Workspace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <Card key={workspace.id} className="hover:border-primary/50 hover:shadow-md transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">{workspace.name}</CardTitle>
                      <CardDescription className="mt-1">{workspace.companyId}</CardDescription>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{workspace.name.charAt(0)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IconFolder className="w-4 h-4" />
                        <span>Documents</span>
                      </div>
                      <span className="font-semibold">{workspace._count.documents}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IconUsers className="w-4 h-4" />
                        <span>Members</span>
                      </div>
                      <span className="font-semibold">{workspace._count.members}</span>
                    </div>
                    <Link href="/dashboard/docchat">
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <IconMessageCircle className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
          <Link href="/dashboard/docchat">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  <IconMessageCircle className="w-5 h-5" />
                  Start AI Chat
                </CardTitle>
                <CardDescription>
                  Ask questions about your company documentation
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/storage">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                  <IconFolder className="w-5 h-5" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Add new files to your knowledge base
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
