import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get current workspace
    const workspace = await getCurrentWorkspace(session.user.id);

    if (!workspace) {
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 }
      );
    }

    // Dynamically import RAG to avoid build issues
    const { generateRAGResponse } = await import("@/lib/rag");

    // Generate RAG response using LangChain + Gemini
    const { answer, confidence, sources } = await generateRAGResponse(
      message,
      workspace.id
    );

    // Track the query
    await prisma.chatQuery.create({
      data: {
        workspaceId: workspace.id,
        userId: session.user.id,
        query: message,
        response: answer,
        confidence,
        sources: sources ? JSON.stringify(sources) : null,
      },
    });

    return NextResponse.json({
      response: answer,
      confidence,
      sources,
      workspaceName: workspace.name,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
