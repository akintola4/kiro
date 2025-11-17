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
  return await prisma.notification.create({
    data: {
      userId,
      workspaceId,
      title,
      message,
    },
  });
}

export async function notifyWorkspaceMembers({
  workspaceId,
  title,
  message,
  excludeUserId,
}: {
  workspaceId: string;
  title: string;
  message: string;
  excludeUserId?: string;
}) {
  const members = await prisma.workspaceMember.findMany({
    where: {
      workspaceId,
      ...(excludeUserId && { userId: { not: excludeUserId } }),
    },
    select: {
      userId: true,
    },
  });

  const notifications = members.map((member) => ({
    userId: member.userId,
    workspaceId,
    title,
    message,
  }));

  if (notifications.length > 0) {
    await prisma.notification.createMany({
      data: notifications,
    });
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
  return await createNotification({
    userId,
    workspaceId,
    title: success ? "Document Processed" : "Document Processing Failed",
    message: success
      ? `"${documentName}" has been processed and is ready for AI chat`
      : `Failed to process "${documentName}". Please try uploading again.`,
  });
}
