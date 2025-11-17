"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconFolder, IconMessageCircle, IconUsers } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useWorkspaceSwitch } from "@/components/providers/WorkspaceSwitchProvider";
import { useQueryClient } from "@tanstack/react-query";

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    companyId: string;
    _count: {
      documents: number;
      members: number;
    };
  };
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isSwitching, setIsSwitching } = useWorkspaceSwitch();

  const handleOpenChat = async () => {
    setIsSwitching(true);
    try {
      const response = await fetch("/api/workspace/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId: workspace.id }),
      });

      if (!response.ok) throw new Error("Failed to switch workspace");

      // Clear all queries immediately
      queryClient.clear();
      
      // Invalidate all queries to refresh data for new workspace
      await queryClient.invalidateQueries();

      // Navigate to chat
      router.push("/dashboard/docchat");
      router.refresh();
      
      // Keep loading state for a moment to ensure refresh completes
      setTimeout(() => {
        setIsSwitching(false);
      }, 500);
    } catch (error) {
      toast.error("Failed to switch workspace");
      setIsSwitching(false);
    }
  };

  return (
    <Card className="hover:border-primary/50 hover:shadow-md transition-all group">
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
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={handleOpenChat}
            disabled={isSwitching}
          >
            <IconMessageCircle className="w-4 h-4 mr-2" />
            {isSwitching ? "Switching..." : "Open Chat"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
