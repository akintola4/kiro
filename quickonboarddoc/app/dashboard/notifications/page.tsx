"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  IconCheck,
  IconTrash,
  IconCheckbox,
  IconSquare,
  IconDots,
  IconX,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  workspace?: {
    name: string;
  };
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Marked as read");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to mark all as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  const notifications: Notification[] = data?.notifications || [];
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

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
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)));
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Stay updated with your workspace activities
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Notifications
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground text-primary">
                {unreadCount}
              </span>
            )}
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("read")}
          >
            Read
            {readCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-foreground text-primary">
                {readCount}
              </span>
            )}
          </Button>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            <IconCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications Table */}
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
                    {selectedIds.size === filteredNotifications.length &&
                    filteredNotifications.length > 0 ? (
                      <IconCheckbox className="h-4 w-4" />
                    ) : (
                      <IconSquare className="h-4 w-4" />
                    )}
                  </Button>
                </th>
                <th className="text-left p-4 font-semibold text-sm">Title</th>
                <th className="text-left p-4 font-semibold text-sm hidden md:table-cell">
                  Message
                </th>
                <th className="text-left p-4 font-semibold text-sm hidden lg:table-cell">
                  Time
                </th>
                <th className="text-left p-4 font-semibold text-sm">Status</th>
                <th className="text-left p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No notifications found
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => (
                  <tr
                    key={notification.id}
                    className={cn(
                      "hover:bg-muted/50 transition-colors cursor-pointer",
                      !notification.read && "bg-primary/5"
                    )}
                    onClick={() => {
                      setSelectedNotification(notification);
                      setDialogOpen(true);
                      if (!notification.read) {
                        markAsReadMutation.mutate(notification.id);
                      }
                    }}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleSelect(notification.id)}
                      >
                        {selectedIds.has(notification.id) ? (
                          <IconCheckbox className="h-4 w-4" />
                        ) : (
                          <IconSquare className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="text-xs text-muted-foreground md:hidden mt-1">
                        {notification.message.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="text-sm text-muted-foreground max-w-md truncate">
                        {notification.message}
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      {notification.read ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                          <IconCheck className="h-3 w-3 mr-1" />
                          Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400">
                          Unread
                        </span>
                      )}
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!notification.read && (
                            <DropdownMenuItem
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                            >
                              <IconCheck className="h-4 w-4 mr-2" />
                              Mark as read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteMutation.mutate(notification.id)}
                          >
                            <IconTrash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
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
        {filteredNotifications.length > 0 && (
          <div className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {selectedIds.size > 0
                ? `${selectedIds.size} of ${filteredNotifications.length} row(s) selected.`
                : `${filteredNotifications.length} notification(s) total.`}
            </div>
          </div>
        )}
      </Card>

      {/* Notification Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-base sm:text-lg pr-8 sm:pr-0">{selectedNotification?.title}</span>
              {selectedNotification?.read ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400 flex-shrink-0">
                  <IconCheck className="h-3 w-3 mr-1" />
                  Read
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 flex-shrink-0">
                  Unread
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {selectedNotification?.createdAt &&
                new Date(selectedNotification.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h4 className="text-xs sm:text-sm font-medium mb-2">Message</h4>
              <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedNotification?.message}
              </p>
            </div>
            {selectedNotification?.workspace && (
              <div>
                <h4 className="text-xs sm:text-sm font-medium mb-2">Workspace</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {selectedNotification.workspace.name}
                </p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4">
              {selectedNotification && !selectedNotification.read && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                  onClick={() => {
                    markAsReadMutation.mutate(selectedNotification.id);
                    setDialogOpen(false);
                  }}
                >
                  <IconCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Mark as read
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 text-destructive hover:text-destructive"
                onClick={() => {
                  if (selectedNotification) {
                    deleteMutation.mutate(selectedNotification.id);
                    setDialogOpen(false);
                  }
                }}
              >
                <IconTrash className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="default"
                size="sm"
                className="w-full sm:w-auto sm:ml-auto text-xs sm:text-sm h-8 sm:h-9"
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
