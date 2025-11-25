import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { processDocument } from "@/lib/document-processor";
import { notifyDocumentProcessed } from "@/lib/notifications";
import { put } from "@vercel/blob";
import { getCurrentWorkspace } from "@/lib/workspace-context";

// Async processing function that runs in background
async function processDocumentAsync(
  documentId: string,
  buffer: Buffer,
  mimeType: string,
  userId: string,
  workspaceId: string,
  documentName: string
) {
  try {
    console.log(`🔄 Starting background processing for: ${documentName}`);
    await processDocument(documentId, buffer, mimeType);
    console.log(`✅ Document ${documentName} processed successfully`);
    
    // Send success notification
    await notifyDocumentProcessed({
      userId,
      workspaceId,
      documentName,
      success: true,
    });
  } catch (processError) {
    console.error(`❌ Failed to process document ${documentName}:`, processError);
    
    // Send failure notification
    await notifyDocumentProcessed({
      userId,
      workspaceId,
      documentName,
      success: false,
    });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Get current workspace
    const workspace = await getCurrentWorkspace(session.user.id);

    if (!workspace) {
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${workspace.id}/${timestamp}-${sanitizedName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
    });

    console.log(`📁 File uploaded to Vercel Blob: ${blob.url}`);

    const fileUrl = blob.url;

    // Create document record
    const document = await prisma.document.create({
      data: {
        name: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: session.user.id,
        workspaceId: workspace.id,
        processed: false,
      },
    });

    console.log(`📄 Document record created: ${document.id}`);

    // Start processing asynchronously (don't await)
    // This prevents timeout on large files
    processDocumentAsync(document.id, buffer, file.type, session.user.id, workspace.id, document.name);

    // Return immediately
    return NextResponse.json(
      {
        document,
        message: "Document uploaded successfully. Processing in background...",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// App Router handles FormData automatically, no config needed
