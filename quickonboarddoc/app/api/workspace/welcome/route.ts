import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateWelcomeMessage } from "@/lib/rag";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentWorkspace = await getCurrentWorkspace(session.user.id);

    if (!currentWorkspace) {
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 }
      );
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: currentWorkspace.id },
      include: {
        documents: {
          select: {
            name: true,
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

    const documentNames = workspace.documents.map((d) => d.name);
    const welcomeMessage = await generateWelcomeMessage(
      workspace.name,
      workspace.documents.length,
      documentNames
    );

    return NextResponse.json({
      message: welcomeMessage,
      workspace: {
        name: workspace.name,
        documentCount: workspace.documents.length,
      },
    });
  } catch (error) {
    console.error("Welcome message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
