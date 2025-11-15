import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PUT - Update member role
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { memberId } = await params;
    const { role } = await req.json();

    if (!role || !["owner", "admin", "member"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if the current user is an admin or owner
    const currentMember = await prisma.workspaceMember.findFirst({
      where: {
        userId: session.user.id,
        workspace: {
          members: {
            some: {
              id: memberId,
            },
          },
        },
      },
    });

    if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
      return NextResponse.json(
        { error: "You don't have permission to update roles" },
        { status: 403 }
      );
    }

    // Update the member's role
    const updatedMember = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ member: updatedMember });
  } catch (error) {
    console.error("Failed to update member role:", error);
    return NextResponse.json(
      { error: "Failed to update member role" },
      { status: 500 }
    );
  }
}

// DELETE - Remove member from workspace
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { memberId } = await params;

    // Check if the current user is an admin or owner
    const currentMember = await prisma.workspaceMember.findFirst({
      where: {
        userId: session.user.id,
        workspace: {
          members: {
            some: {
              id: memberId,
            },
          },
        },
      },
    });

    if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
      return NextResponse.json(
        { error: "You don't have permission to remove members" },
        { status: 403 }
      );
    }

    // Don't allow removing the owner
    const memberToRemove = await prisma.workspaceMember.findUnique({
      where: { id: memberId },
    });

    if (memberToRemove?.role === "owner") {
      return NextResponse.json(
        { error: "Cannot remove workspace owner" },
        { status: 400 }
      );
    }

    await prisma.workspaceMember.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
