"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconSkull } from "@tabler/icons-react";
import { toast } from "sonner";
import { LoadingPage, LoadingButton } from "@/components/ui/loading";

function OnboardingContent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const session = useSession();
  const status = session?.status;
  const sessionData = session?.data;
  const [workspaceName, setWorkspaceName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Fetch all workspaces user is a member of
      fetch("/api/workspaces", {
        credentials: "include",
      })
        .then((res) => {
          if (res.status === 404 || res.status === 401) {
            setIsReady(true);
            setShowCreateForm(true);
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data?.workspaces && data.workspaces.length > 0) {
            setWorkspaces(data.workspaces);
            setIsReady(true);
          } else {
            // No workspaces, show create form
            setShowCreateForm(true);
            setIsReady(true);
          }
        })
        .catch(() => {
          setShowCreateForm(true);
          setIsReady(true);
        });
    }
  }, [status, router]);

  const handleWorkspaceSelect = () => {
    if (!selectedWorkspace) {
      toast.error("Please select a workspace");
      return;
    }
    
    // Store selected workspace in localStorage
    localStorage.setItem("selectedWorkspaceId", selectedWorkspace);
    router.push("/dashboard/home");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/workspace/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName, companyId, description }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Failed to create workspace");
        return;
      }

      const result = await response.json();
      
      // Store the new workspace ID
      if (result.workspace?.id) {
        localStorage.setItem("selectedWorkspaceId", result.workspace.id);
      }

      toast.success("Workspace created successfully!");
      router.push("/dashboard/home");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Always show loading during SSR and initial mount
  if (!mounted) {
    return <LoadingPage />;
  }
  
  if (status === "loading" || !isReady) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="flex justify-center mb-8">
          <IconSkull className="w-16 h-16 text-primary" />
        </div>

        {!showCreateForm && workspaces.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Workspace</CardTitle>
              <CardDescription>
                Select a workspace to continue or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace</Label>
                <select
                  id="workspace"
                  value={selectedWorkspace}
                  onChange={(e) => setSelectedWorkspace(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Select a workspace</option>
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name} ({ws._count.members} members)
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleWorkspaceSelect} className="flex-1">
                  Continue
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(true)}
                  className="flex-1"
                >
                  Create New
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Workspace</CardTitle>
              <CardDescription>
                Set up your company workspace to start onboarding new hires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="workspaceName">Workspace Name</Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Acme Corporation"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyId">Company ID</Label>
                <Input
                  id="companyId"
                  type="text"
                  placeholder="acme-corp"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be used as your unique workspace identifier
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your company..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <LoadingButton>Creating workspace...</LoadingButton> : "Create Workspace"}
                </Button>
                {workspaces.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="w-full"
                  >
                    Back to Selection
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

export default function OnboardingPage() {
  return <OnboardingContent />;
}

// Prevent static generation
export const dynamic = "force-dynamic";
export const dynamicParams = true;
