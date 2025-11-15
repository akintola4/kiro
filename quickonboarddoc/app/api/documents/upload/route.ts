import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { processDocument } from "@/lib/document-processor";
import { notifyDocumentProcessed } from "@/lib/notifications";
import { put } from "@vercel/blob";

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

    // Get user's first workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
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

    // Process document immediately (extract text, chunk, embed)
    try {
      console.log(`🔄 Starting processing for: ${document.name}`);
      await processDocument(document.id, buffer, file.type);
      console.log(`✅ Document ${document.name} processed successfully`);
      
      // Send success notification
      await notifyDocumentProcessed({
        userId: session.user.id,
        workspaceId: workspace.id,
        documentName: document.name,
        success: true,
      });
      
      return NextResponse.json(
        {
          document: {
            ...document,
            processed: true,
          },
          message: "Document uploaded and processed successfully",
        },
        { status: 201 }
      );
    } catch (processError) {
      console.error(`❌ Failed to process document ${document.name}:`, processError);
      
      // Send failure notification
      await notifyDocumentProcessed({
        userId: session.user.id,
        workspaceId: workspace.id,
        documentName: document.name,
        success: false,
      });
      
      return NextResponse.json(
        {
          document,
          message: "Document uploaded but processing failed. Please try re-uploading.",
          error: processError instanceof Error ? processError.message : "Processing failed",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
