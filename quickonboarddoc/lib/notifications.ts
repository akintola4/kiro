import { prisma } from "./prisma";

export async function createNotification({
  userId,
  workspaceId,
  title,
  message,
}: {
  userId: string;
  workspaceId?: string;
  title: string;
  message: string;
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        workspaceId,
        title,
        message,
        read: false,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

export async function notifyDocumentProcessed({
  userId,
  workspaceId,
  documentName,
  success,
}: {
  userId: string;
  workspaceId: string;
  documentName: string;
  success: boolean;
}) {
  if (success) {
    await createNotification({
      userId,
      workspaceId,
      title: "Document Ready! 📄",
      message: `"${documentName}" has been uploaded, processed, and is ready to use in AI Chat.`,
    });
  } else {
    await createNotification({
      userId,
      workspaceId,
      title: "Document Processing Failed ❌",
      message: `Failed to process "${documentName}". Please try uploading again.`,
    });
  }
}
