import { cookies } from "next/headers";
import { prisma } from "./prisma";

const WORKSPACE_COOKIE = "selected-workspace-id";

export async function getSelectedWorkspaceId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(WORKSPACE_COOKIE)?.value || null;
}

export async function setSelectedWorkspaceId(workspaceId: string) {
  const cookieStore = await cookies();
  cookieStore.set(WORKSPACE_COOKIE, workspaceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

/**
 * Get the current workspace for the authenticated user
 * If a workspace is selected in cookies, use that
 * Otherwise, use the first workspace the user is a member of
 */
export async function getCurrentWorkspace(userId: string) {
  const selectedId = await getSelectedWorkspaceId();

  // If there's a selected workspace, verify user has access and return it
  if (selectedId) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: selectedId,
        members: {
          some: {
            userId,
          },
        },
      },
    });

    if (workspace) {
      return workspace;
    }
  }

  // Otherwise, get the first workspace and set it as selected
  const workspace = await prisma.workspace.findFirst({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });

  if (workspace) {
    await setSelectedWorkspaceId(workspace.id);
  }

  return workspace;
}
