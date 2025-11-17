-- CreateTable
CREATE TABLE "ChatQuery" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "sources" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatQuery_workspaceId_idx" ON "ChatQuery"("workspaceId");

-- CreateIndex
CREATE INDEX "ChatQuery_userId_idx" ON "ChatQuery"("userId");

-- CreateIndex
CREATE INDEX "ChatQuery_createdAt_idx" ON "ChatQuery"("createdAt");
