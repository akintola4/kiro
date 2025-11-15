"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconEdit, IconTrash, IconCalendar, IconUserPlus, IconFile, IconCopy, IconCheck } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function SettingsPage() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteUrl, setInviteUrl] = useState("");
  const [showInviteUrl, setShowInviteUrl] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["workspace"],
    queryFn: async () => {
      const response = await fetch("/api/workspace");
      if (!response.ok) throw new Error("Failed to fetch workspace");
      return response.json();
    },
  });

  const updateWorkspaceMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const response = await fetch("/api/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) throw new Error("Failed to update workspace");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      toast.success("Workspace updated successfully");
      setEditDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/workspace", {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete workspace");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
      window.location.href = "/onboarding";
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await fetch("/api/workspace/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create invite");
      }
      return response.json();
    },
    onSuccess: (data) => {
      setInviteUrl(data.invite.inviteUrl);
      setShowInviteUrl(true);
      toast.success("Invite created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Invite link copied to clipboard");
  };

  const workspace = data?.workspace;

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Workspace Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage workspace details, members, and documents.
        </p>
      </div>

      {/* Workspace Details Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl mb-2">{workspace?.name}</CardTitle>
              <CardDescription className="text-sm">
                {workspace?.description || "No description"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setWorkspaceName(workspace?.name || "");
                  setWorkspaceDescription(workspace?.description || "");
                  setEditDialogOpen(true);
                }}
              >
                <IconEdit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <IconTrash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4" />
              <span>Created: {new Date(workspace?.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4" />
              <span>Updated: {new Date(workspace?.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {workspace?._count.members} member(s) in this workspace
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setInviteEmail("");
                setInviteRole("member");
                setShowInviteUrl(false);
                setInviteUrl("");
                setInviteDialogOpen(true);
              }}
            >
              <IconUserPlus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workspace?.members.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {member.user.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.user.name}</p>
                    <p className="text-xs text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                    member.role === "owner"
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                      : member.role === "admin"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documents Card */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Documents inside this workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workspace?.documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <IconFile className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No documents yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-muted-foreground pb-2 border-b">
                <div>Name</div>
                <div>Date Added</div>
              </div>
              {workspace?.documents.slice(0, 5).map((doc: any) => (
                <div key={doc.id} className="grid grid-cols-2 gap-4 text-sm py-2">
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-muted-foreground">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Workspace Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update your workspace name and description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
                className="mt-1.5"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateWorkspaceMutation.mutate({
                  name: workspaceName,
                  description: workspaceDescription,
                });
              }}
              disabled={updateWorkspaceMutation.isPending}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace
            </DialogDescription>
          </DialogHeader>
          {!showInviteUrl ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    createInviteMutation.mutate({
                      email: inviteEmail,
                      role: inviteRole,
                    });
                  }}
                  disabled={!inviteEmail || createInviteMutation.isPending}
                >
                  {createInviteMutation.isPending ? "Creating..." : "Create Invite"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                    <IconCheck className="h-5 w-5" />
                    <span className="font-semibold">Invite Created!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share this link with {inviteEmail} to join the workspace.
                  </p>
                </div>
                <div>
                  <Label>Invite Link</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input value={inviteUrl} readOnly className="font-mono text-xs" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyInviteUrl}
                    >
                      <IconCopy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setInviteDialogOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Workspace Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workspace? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteWorkspaceMutation.mutate()}
              disabled={deleteWorkspaceMutation.isPending}
            >
              Delete Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
