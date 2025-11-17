import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";
import { notifyWorkspaceMembers } from "@/lib/notifications";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
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

    const isMember = document.workspace.members.some(
      (m) => m.userId === session.user.id
    );

    if (!isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete from Vercel Blob
    try {
      await del(document.fileUrl);
      console.log(`🗑️ Deleted file from Vercel Blob: ${document.fileUrl}`);
    } catch (blobError) {
      console.error("Failed to delete from Vercel Blob:", blobError);
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database (cascades to chunks)
    await prisma.document.delete({
      where: { id },
    });

    // Notify the user who deleted it
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        workspaceId: document.workspaceId,
        title: "Document Deleted",
        message: `You deleted "${document.name}"`,
      },
    });

    // Notify other workspace members
    await notifyWorkspaceMembers({
      workspaceId: document.workspaceId,
      title: "Document Deleted",
      message: `${session.user.name} deleted "${document.name}"`,
      excludeUserId: session.user.id,
    });

    return NextResponse.json({ message: "Document deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
