"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconChevronDown, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWorkspaceSwitch } from "@/components/providers/WorkspaceSwitchProvider";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { setIsSwitching } = useWorkspaceSwitch();

  const { data: workspaces } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await fetch("/api/workspaces");
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      return response.json();
    },
  });

  const { data: currentWorkspace, refetch: refetchWorkspace } = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => {
      const response = await fetch("/api/workspace/info");
      if (!response.ok) throw new Error("Failed to fetch workspace");
      return response.json();
    },
  });

  const switchMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      setIsSwitching(true);
      const response = await fetch("/api/workspace/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId }),
      });
      if (!response.ok) throw new Error("Failed to switch workspace");
      return response.json();
    },
    onSuccess: async () => {
      // Clear all queries immediately
      queryClient.clear();
      
      // Refetch workspace info immediately
      await refetchWorkspace();
      
      // Invalidate all queries to refresh data for new workspace
      await queryClient.invalidateQueries();
      
      toast.success("Workspace switched successfully");
      
      // Refresh the page to get new data
      router.refresh();
      
      setOpen(false);
      
      // Keep loading state for a moment to ensure refresh completes
      setTimeout(() => {
        setIsSwitching(false);
      }, 500);
    },
    onError: () => {
      toast.error("Failed to switch workspace");
      setIsSwitching(false);
    },
  });

  const handleSwitch = (workspaceId: string) => {
    if (workspaceId === currentWorkspace?.workspace?.id) {
      setOpen(false);
      return;
    }
    switchMutation.mutate(workspaceId);
  };

  if (!workspaces?.workspaces || workspaces.workspaces.length <= 1) {
    return null; // Don't show switcher if user only has one workspace
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-auto p-3 mb-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">
                {currentWorkspace?.workspace?.name?.charAt(0) || "W"}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {currentWorkspace?.workspace?.name || "Workspace"}
              </span>
              <span className="text-xs text-muted-foreground">
                {workspaces.workspaces.length} workspaces
              </span>
            </div>
          </div>
          <IconChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.workspaces.map((workspace: any) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => handleSwitch(workspace.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">
                    {workspace.name.charAt(0)}
                  </span>
                </div>
                <span>{workspace.name}</span>
              </div>
              {workspace.id === currentWorkspace?.workspace?.id && (
                <IconCheck className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
