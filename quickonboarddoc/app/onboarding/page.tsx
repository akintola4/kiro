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

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [workspaceName, setWorkspaceName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Wait a bit to ensure session is fully loaded
      setTimeout(() => setIsReady(true), 500);
    }
  }, [status, router]);

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

      toast.success("Workspace created successfully!");
      router.push("/dashboard/home");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
