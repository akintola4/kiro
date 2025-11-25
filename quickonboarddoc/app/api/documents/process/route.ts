import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { processDocument, fetchDocumentFromBlob } from "@/lib/document-processor";
import { notifyDocumentProcessed } from "@/lib/notifications";

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

    // Get the document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        workspace: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify user has access
    if (document.workspace.members.length === 0) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Skip if already processed
    if (document.processed) {
      return NextResponse.json({
        success: true,
        message: "Document already processed",
      });
    }

    try {
      console.log(`🔄 Starting processing for: ${document.name}`);
      
      // Fetch file from Vercel Blob
      const buffer = await fetchDocumentFromBlob(document.fileUrl);
      
      // Process the document
      await processDocument(document.id, buffer, document.mimeType);
      
      console.log(`✅ Document ${document.name} processed successfully`);
      
      // Send success notification
      await notifyDocumentProcessed({
        userId: session.user.id,
        workspaceId: document.workspaceId,
        documentName: document.name,
        success: true,
      });
      
      return NextResponse.json({
        success: true,
        message: "Document processed successfully",
      });
    } catch (processError) {
      console.error(`❌ Failed to process document ${document.name}:`, processError);
      
      // Send failure notification
      await notifyDocumentProcessed({
        userId: session.user.id,
        workspaceId: document.workspaceId,
        documentName: document.name,
        success: false,
      });
      
      return NextResponse.json(
        {
          error: "Processing failed",
          details: processError instanceof Error ? processError.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const maxDuration = 300; // 5 minutes max (requires Pro plan)
export const dynamic = "force-dynamic";
