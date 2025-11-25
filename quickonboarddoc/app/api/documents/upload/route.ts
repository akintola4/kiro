import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { processDocument, fetchDocumentFromBlob } from "@/lib/document-processor";
import { notifyDocumentProcessed } from "@/lib/notifications";
import { put } from "@vercel/blob";
import { getCurrentWorkspace } from "@/lib/workspace-context";

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

    // Return immediately - client will trigger processing via separate endpoint
    return NextResponse.json(
      {
        document,
        message: "Document uploaded successfully. Processing will start shortly...",
        needsProcessing: true,
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
