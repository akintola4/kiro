import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { processDocument, fetchDocumentFromBlob } from "@/lib/document-processor";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
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

    // Get the document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify document belongs to user's workspace
    if (document.workspaceId !== workspace.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete existing chunks
    await prisma.documentChunk.deleteMany({
      where: { documentId: document.id },
    });

    // Fetch file from Vercel Blob
    const buffer = await fetchDocumentFromBlob(document.fileUrl);

    // Reprocess the document
    await processDocument(document.id, buffer, document.mimeType);

    return NextResponse.json({
      success: true,
      message: "Document reprocessed successfully",
    });
  } catch (error) {
    console.error("Reprocess error:", error);
    return NextResponse.json(
      { error: "Failed to reprocess document" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
