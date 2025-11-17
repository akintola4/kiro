import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNotification, notifyWorkspaceMembers } from "@/lib/notifications";

// GET - Get invite details by token
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const invite = await prisma.workspaceInvite.findUnique({
      where: { token },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.accepted) {
      return NextResponse.json(
        { error: "Invite has already been accepted" },
        { status: 400 }
      );
    }

    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
    }

    return NextResponse.json({ invite });
  } catch (error) {
    console.error("Failed to fetch invite:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to fetch invite" },
      { status: 500 }
    );
  }
}

// POST - Accept invite
export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;

    const invite = await prisma.workspaceInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (invite.accepted) {
      return NextResponse.json(
        { error: "Invite has already been accepted" },
        { status: 400 }
      );
    }

    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
    }

    if (invite.email !== session.user.email) {
      return NextResponse.json(
        { error: "This invite was sent to a different email address" },
        { status: 403 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: invite.workspaceId,
        userId: session.user.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this workspace" },
        { status: 400 }
      );
    }

    // Add user to workspace and mark invite as accepted
    const workspace = await prisma.workspace.findUnique({
      where: { id: invite.workspaceId },
      select: { name: true },
    });

    await prisma.$transaction([
      prisma.workspaceMember.create({
        data: {
          workspaceId: invite.workspaceId,
          userId: session.user.id,
          role: invite.role,
        },
      }),
      prisma.workspaceInvite.update({
        where: { id: invite.id },
        data: { accepted: true },
      }),
    ]);

    // Notify the new member
    await createNotification({
      userId: session.user.id,
      workspaceId: invite.workspaceId,
      title: "Joined Workspace",
      message: `Welcome to ${workspace?.name}! You've successfully joined as ${invite.role}`,
    });

    // Notify other workspace members
    await notifyWorkspaceMembers({
      workspaceId: invite.workspaceId,
      title: "New Team Member",
      message: `${session.user.name} joined ${workspace?.name}`,
      excludeUserId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      workspaceId: invite.workspaceId,
    });
  } catch (error) {
    console.error("Failed to accept invite:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Failed to accept invite" },
      { status: 500 }
    );
  }
}
