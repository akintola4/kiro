"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ghost } from "lucide-react";
import { IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";
import { LoadingCard, LoadingButton } from "@/components/ui/loading";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const response = await fetch(`/api/workspace/invite/${params.token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load invite");
        } else {
          setInvite(data.invite);
        }
      } catch (err) {
        setError("Failed to load invite");
      } finally {
        setLoading(false);
      }
    };

    fetchInvite();
  }, [params.token]);

  // Auto-accept invite if user is authenticated and email matches
  useEffect(() => {
    const autoAccept = async () => {
      if (
        status === "authenticated" &&
        session?.user?.email === invite?.email &&
        !accepting &&
        !error &&
        invite
      ) {
        // Add a small delay to ensure session is fully loaded
        await new Promise(resolve => setTimeout(resolve, 500));
        await handleAccept();
      }
    };

    if (invite && status === "authenticated") {
      autoAccept();
    }
  }, [invite, status, session?.user?.email]);

  const handleAccept = async () => {
    if (status !== "authenticated") {
      router.push(`/signup?callbackUrl=/invite/${params.token}`);
      return;
    }

    setAccepting(true);
    try {
      const response = await fetch(`/api/workspace/invite/${params.token}`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to accept invite");
        setAccepting(false);
      } else {
        toast.success("Welcome to the workspace!");
        // Small delay before redirect for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/dashboard/home");
      }
    } catch (err) {
      setError("Failed to accept invite");
      setAccepting(false);
    }
  };

  if (loading || accepting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardContent className="py-4">
            <LoadingCard 
              message={accepting ? "Joining workspace..." : "Loading invite..."}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <IconX className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Invalid Invite</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Ghost className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">You're Invited!</CardTitle>
          <CardDescription>
            Someone invited you to join a workspace in QuickOnboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workspace Info */}
          <div className="p-4 rounded-lg border bg-muted/50">
            <h3 className="font-semibold mb-1">{invite?.workspace?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {invite?.workspace?.description || "No description"}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Role:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                  invite?.role === "admin"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                }`}
              >
                {invite?.role}
              </span>
            </div>
          </div>

          {/* Invite Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invited to:</span>
              <span className="font-medium">{invite?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expires:</span>
              <span className="font-medium">
                {new Date(invite?.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {status === "authenticated" ? (
              <>
                {session?.user?.email === invite?.email ? (
                  <Button
                    className="w-full"
                    onClick={handleAccept}
                    disabled={accepting}
                  >
                    {accepting ? (
                      <LoadingButton>Accepting...</LoadingButton>
                    ) : (
                      <>
                        <IconCheck className="mr-2 h-4 w-4" />
                        Accept Invitation
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    This invite was sent to {invite?.email}. Please log in with that
                    account to accept.
                  </div>
                )}
              </>
            ) : (
              <Button className="w-full" onClick={handleAccept}>
                Sign In to Accept
              </Button>
            )}
            <Link href="/">
              <Button variant="outline" className="w-full">
                Decline
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
