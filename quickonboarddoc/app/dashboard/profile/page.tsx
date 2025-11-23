"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingPage, LoadingButton } from "@/components/ui/loading";
import { IconUser, IconMail, IconCalendar, IconBriefcase, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: string;
  workspaceCount: number;
  role: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditedName(data.name || "");
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
        // Update session
        await update({ name: editedName });
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(profile?.name || "");
    setIsEditing(false);
  };

  if (status === "loading" || loading) {
    return <LoadingPage />;
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and settings</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <IconEdit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Profile Avatar */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary/20 to-gray-500/20 flex items-center justify-center ring-4 ring-primary/10 flex-shrink-0">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {profile.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold truncate">{profile.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize">{profile.role}</p>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-xs sm:text-sm">
                <IconUser className="w-3 h-3 sm:w-4 sm:h-4" />
                Full Name
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-sm"
                />
              ) : (
                <p className="text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg bg-muted/50">
                  {profile.name || "Not set"}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm">
                <IconMail className="w-3 h-3 sm:w-4 sm:h-4" />
                Email Address
              </Label>
              <p className="text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg bg-muted/50 break-all">
                {profile.email}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm">
                <IconCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                Member Since
              </Label>
              <p className="text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg bg-muted/50">
                {formatDate(profile.createdAt)}
              </p>
            </div>

            {/* Workspace Count */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs sm:text-sm">
                <IconBriefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                Workspaces
              </Label>
              <p className="text-xs sm:text-sm p-2.5 sm:p-3 rounded-lg bg-muted/50">
                Member of {profile.workspaceCount} workspace{profile.workspaceCount !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving || !editedName.trim()}
                  className="flex-1"
                  size="sm"
                >
                  {saving ? <LoadingButton>Saving...</LoadingButton> : (
                    <>
                      <IconCheck className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  size="sm"
                  className="sm:w-auto"
                >
                  <IconX className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
      >
        <Card>
          <CardContent className="pt-4 sm:pt-6 pb-4">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{profile.workspaceCount}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Workspaces</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 pb-4">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Days Active</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 sm:pt-6 pb-4">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary capitalize">{profile.role}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Account Type</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
