import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { setSelectedWorkspaceId } from "@/lib/workspace-context";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.error("Workspace creation failed: No session or user ID");
      return NextResponse.json({ error: "Unauthorized - Please sign in again" }, { status: 401 });
    }

    const { name, companyId, description } = await req.json();

    if (!name || !companyId) {
      console.error("Workspace creation failed: Missing fields", { name, companyId });
      return NextResponse.json(
        { error: "Missing required fields: name and companyId are required" },
        { status: 400 }
      );
    }

    const existingWorkspace = await prisma.workspace.findUnique({
      where: { companyId },
    });

    if (existingWorkspace) {
      return NextResponse.json(
        { error: "Company ID already taken" },
        { status: 400 }
      );
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        companyId,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "owner",
          },
        },
      },
    });

    // Set this as the selected workspace
    await setSelectedWorkspaceId(workspace.id);

    // Create notification for workspace creation
    await createNotification({
      userId: session.user.id,
      workspaceId: workspace.id,
      title: "Workspace Created",
      message: `Successfully created workspace "${name}"`,
    });

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    console.error("Workspace creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
