"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  IconCheckbox,
  IconSquare,
  IconDots,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Member = {
  id: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

export default function TeamPage() {
  const [filter, setFilter] = useState<"all" | "admins" | "members">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const response = await fetch("/api/team");
      if (!response.ok) throw new Error("Failed to fetch team");
      return response.json();
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
      const response = await fetch(`/api/team/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error("Failed to update role");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Role updated successfully");
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update role");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetch(`/api/team/${memberId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove member");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Member removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });

  const members: Member[] = data?.members || [];
  const workspace = data?.workspace;

  const filteredMembers = members.filter((m) => {
    if (filter === "admins") return m.role === "admin" || m.role === "owner";
    if (filter === "members") return m.role === "member";
    return true;
  });

  const adminCount = members.filter((m) => m.role === "admin" || m.role === "owner").length;
  const memberCount = members.filter((m) => m.role === "member").length;

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map((m) => m.id)));
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "admin":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      default:
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Team Members</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your workspace team and permissions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Members
          </Button>
          <Button
            variant={filter === "admins" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("admins")}
          >
            Admins
            {adminCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground text-primary">
                {adminCount}
              </span>
            )}
          </Button>
          <Button
            variant={filter === "members" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("members")}
          >
            Members
            {memberCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground text-primary">
                {memberCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Members Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 w-12">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={toggleSelectAll}
                  >
                    {selectedIds.size === filteredMembers.length &&
                    filteredMembers.length > 0 ? (
                      <IconCheckbox className="h-4 w-4" />
                    ) : (
                      <IconSquare className="h-4 w-4" />
                    )}
                  </Button>
                </th>
                <th className="text-left p-4 font-semibold text-sm">User Name</th>
                <th className="text-left p-4 font-semibold text-sm hidden md:table-cell">
                  Email
                </th>
                <th className="text-left p-4 font-semibold text-sm">Role</th>
                <th className="text-left p-4 font-semibold text-sm hidden lg:table-cell">
                  Workspace
                </th>
                <th className="text-left p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedMember(member);
                      setEditRole(member.role);
                      setDialogOpen(true);
                    }}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleSelect(member.id)}
                      >
                        {selectedIds.has(member.id) ? (
                          <IconCheckbox className="h-4 w-4" />
                        ) : (
                          <IconSquare className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {member.user.name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{member.user.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">
                            {member.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {member.user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium uppercase",
                          getRoleBadgeColor(member.role)
                        )}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {workspace?.name}
                      </div>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member);
                              setEditRole(member.role);
                              setDialogOpen(true);
                            }}
                          >
                            <IconEdit className="h-4 w-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          {member.role !== "owner" && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => removeMemberMutation.mutate(member.id)}
                            >
                              <IconTrash className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredMembers.length > 0 && (
          <div className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {selectedIds.size > 0
                ? `${selectedIds.size} of ${filteredMembers.length} row(s) selected.`
                : `${filteredMembers.length} member(s) total.`}
            </div>
            <div className="text-xs">Page 1 of 1</div>
          </div>
        )}
      </Card>

      {/* View/Edit Member Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">View Member</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Member details and workspace information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs sm:text-sm">Name</Label>
              <Input
                id="name"
                value={selectedMember?.user.name || ""}
                readOnly
                className="mt-1.5 text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
              <Input
                id="email"
                value={selectedMember?.user.email || ""}
                readOnly
                className="mt-1.5 text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-xs sm:text-sm">Role</Label>
              <Select
                value={editRole}
                onValueChange={setEditRole}
                disabled={selectedMember?.role === "owner"}
              >
                <SelectTrigger className="mt-1.5 text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">ADMIN</SelectItem>
                  <SelectItem value="member">MEMBER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="workspace" className="text-xs sm:text-sm">Workspace</Label>
              <Input
                id="workspace"
                value={workspace?.name || ""}
                readOnly
                className="mt-1.5 text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div className="flex gap-2 pt-4">
              {selectedMember && editRole !== selectedMember.role && (
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => {
                    if (selectedMember) {
                      updateRoleMutation.mutate({
                        memberId: selectedMember.id,
                        role: editRole,
                      });
                    }
                  }}
                  disabled={updateRoleMutation.isPending}
                >
                  Save Changes
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="ml-auto text-xs sm:text-sm h-8 sm:h-9"
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
