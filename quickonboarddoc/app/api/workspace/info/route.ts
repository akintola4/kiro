import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch workspace details
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            members: true,
            documents: true,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ workspace });
  } catch (error) {
    console.error("Failed to fetch workspace:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 }
    );
  }
}

// PUT - Update workspace details
export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();

    // Get user's workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
            role: {
              in: ["owner", "admin"],
            },
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or insufficient permissions" },
        { status: 404 }
      );
    }

    const updatedWorkspace = await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ workspace: updatedWorkspace });
  } catch (error) {
    console.error("Failed to update workspace:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
}

// DELETE - Delete workspace
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's workspace (only owner can delete)
    const workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found or insufficient permissions" },
        { status: 404 }
      );
    }

    await prisma.workspace.delete({
      where: { id: workspace.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete workspace:", error);
    return NextResponse.json(
      { error: "Failed to delete workspace" },
      { status: 500 }
    );
  }
}
