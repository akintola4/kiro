import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentWorkspace } from "@/lib/workspace-context";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current workspace
    const workspace = await getCurrentWorkspace(session.user.id);

    if (!workspace) {
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 404 }
      );
    }

    const workspaceIds = [workspace.id];

    // Get current month queries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [currentMonthCount, lastMonthCount] = await Promise.all([
      prisma.chatQuery.count({
        where: {
          workspaceId: { in: workspaceIds },
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.chatQuery.count({
        where: {
          workspaceId: { in: workspaceIds },
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),
    ]);

    // Calculate percentage change
    const percentageChange =
      lastMonthCount > 0
        ? Math.round(((currentMonthCount - lastMonthCount) / lastMonthCount) * 100)
        : currentMonthCount > 0
        ? 100
        : 0;

    return NextResponse.json({
      currentMonth: currentMonthCount,
      lastMonth: lastMonthCount,
      percentageChange,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
