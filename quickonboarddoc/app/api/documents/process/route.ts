import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { processDocument } from "@/lib/document-processor";
import { readFile } from "fs/promises";
import { join } from "path";

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

    // Get document
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        workspace: {
          include: {
            members: true,
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

    // Check if user has access
    const isMember = document.workspace.members.some(
      (m) => m.userId === session.user.id
    );

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if already processed
    if (document.processed) {
      return NextResponse.json({
        message: "Document already processed",
        processed: true,
      });
    }

    // For now, return a message that processing is in progress
    // In production, you would fetch the file from storage and process it
    return NextResponse.json({
      message: "Document processing is in progress. This is a demo - in production, files would be fetched from cloud storage and processed.",
      processed: false,
      note: "To fully implement: 1) Store files in cloud storage (S3, etc.), 2) Fetch file buffer, 3) Call processDocument()",
    });
  } catch (error) {
    console.error("Process document error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get processing status for all documents
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: {
        workspace: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            chunks: true,
          },
        },
      },
    });

    return NextResponse.json({
      documents: documents.map((doc) => ({
        id: doc.id,
        name: doc.name,
        processed: doc.processed,
        chunkCount: doc._count.chunks,
      })),
    });
  } catch (error) {
    console.error("Get processing status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
