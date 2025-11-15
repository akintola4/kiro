"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconFile, IconTrash, IconUpload } from "@tabler/icons-react";
import { toast } from "sonner";

export default function StoragePage() {
  const [uploading, setUploading] = useState(false);

  const { data: documents, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Failed to fetch documents");
      return response.json();
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      toast.success("File uploaded successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("File deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Document Storage</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your workspace documents
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="block">
            <Button asChild disabled={uploading} className="w-full sm:w-auto">
              <span>
                <IconUpload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Document"}
              </span>
            </Button>
          </label>
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {documents?.documents?.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <IconFile className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </CardContent>
          </Card>
        ) : (
          documents?.documents?.map((doc: any) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconFile className="w-4 h-4" />
                  {doc.name}
                </CardTitle>
                <CardDescription>
                  {new Date(doc.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {(doc.fileSize / 1024).toFixed(2)} KB
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <IconTrash className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
