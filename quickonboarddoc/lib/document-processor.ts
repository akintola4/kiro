import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { prisma } from "./prisma";
import mammoth from "mammoth";

// @ts-ignore - pdf-parse-fork doesn't have types
import pdfParse from "pdf-parse-fork";

// Initialize embeddings model
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  modelName: "embedding-001",
});

// Text splitter configuration - optimized for quality and performance
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, // Good balance for context and performance
  chunkOverlap: 200,
  separators: ["\n\n", "\n", ". ", " ", ""],
});

/**
 * Extract text from PDF buffer using pdf-parse (works on Vercel)
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    const text = data.text;
    
    console.log(`📄 Extracted ${data.numpages} pages, ${text.length} characters`);
    
    if (!text || text.trim().length === 0) {
      throw new Error("No text content found in PDF");
    }
    
    return text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract text from DOCX buffer using mammoth
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;
    
    console.log(`📄 Extracted ${text.length} characters from DOCX`);
    
    if (!text || text.trim().length === 0) {
      throw new Error("No text content found in DOCX");
    }
    
    return text;
  } catch (error) {
    console.error("DOCX extraction error:", error);
    throw new Error(`Failed to extract text from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process a document: extract text, chunk it, create embeddings, and store
 */
export async function processDocument(
  documentId: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<void> {
  try {
    console.log(`📄 [EXTRACT] Starting text extraction for ${mimeType}`);
    const extractStart = Date.now();
    
    // Extract text based on file type
    let text: string;
    
    if (mimeType === "application/pdf") {
      console.log(`📕 [PDF] Extracting text from PDF...`);
      text = await extractTextFromPDF(fileBuffer);
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      console.log(`📘 [DOCX] Extracting text from Word document...`);
      text = await extractTextFromDOCX(fileBuffer);
    } else if (mimeType.startsWith("text/")) {
      console.log(`📝 [TEXT] Reading plain text file...`);
      text = fileBuffer.toString("utf-8");
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
    
    console.log(`✅ [EXTRACT] Extracted ${text.length} characters in ${Date.now() - extractStart}ms`);

    // Split text into chunks
    console.log(`✂️ [SPLIT] Splitting text into chunks...`);
    const splitStart = Date.now();
    const chunks = await textSplitter.splitText(text);
    console.log(`✅ [SPLIT] Created ${chunks.length} chunks in ${Date.now() - splitStart}ms`);

    // Process chunks in batches to optimize performance
    const BATCH_SIZE = 10; // Process 10 chunks at a time
    const totalBatches = Math.ceil(chunks.length / BATCH_SIZE);
    
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const batchChunks = chunks.slice(i, i + BATCH_SIZE);
      
      console.log(`🔄 [BATCH ${batchNum}/${totalBatches}] Processing ${batchChunks.length} chunks...`);
      const batchStart = Date.now();
      
      // Generate embeddings for this batch
      console.log(`🧠 [EMBED ${batchNum}] Generating embeddings...`);
      const embedStart = Date.now();
      const batchEmbeddings = await embeddings.embedDocuments(batchChunks);
      console.log(`✅ [EMBED ${batchNum}] Generated in ${Date.now() - embedStart}ms`);
      
      // Store this batch in database
      console.log(`💾 [DB ${batchNum}] Storing chunks in database...`);
      const dbStart = Date.now();
      await prisma.$transaction(
        batchChunks.map((chunk, batchIndex) =>
          prisma.documentChunk.create({
            data: {
              documentId,
              content: chunk,
              embedding: JSON.stringify(batchEmbeddings[batchIndex]),
              chunkIndex: i + batchIndex,
            },
          })
        )
      );
      console.log(`✅ [DB ${batchNum}] Stored in ${Date.now() - dbStart}ms`);
      console.log(`✅ [BATCH ${batchNum}] Completed in ${Date.now() - batchStart}ms`);
    }

    // Mark document as processed
    console.log(`🏁 [FINALIZE] Marking document as processed...`);
    await prisma.document.update({
      where: { id: documentId },
      data: { processed: true },
    });

    console.log(`✅ [SUCCESS] Processed document ${documentId}: ${chunks.length} chunks total`);
  } catch (error) {
    console.error("❌ [PROCESS ERROR] Document processing failed:", error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Search for relevant document chunks using semantic similarity
 */
export async function searchDocumentChunks(
  query: string,
  workspaceId: string,
  topK: number = 5
): Promise<Array<{ content: string; documentName: string; similarity: number }>> {
  try {
    console.log(`🔍 Searching for: "${query}" in workspace: ${workspaceId}`);
    
    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);
    console.log(`📊 Query embedding generated: ${queryEmbedding.length} dimensions`);

    // Get all chunks for the workspace
    const documents = await prisma.document.findMany({
      where: {
        workspaceId,
        processed: true,
      },
      include: {
        chunks: true,
      },
    });

    console.log(`📚 Found ${documents.length} processed documents`);
    const totalChunks = documents.reduce((sum, doc) => sum + doc.chunks.length, 0);
    console.log(`📄 Total chunks available: ${totalChunks}`);

    // Calculate similarity for each chunk
    const results: Array<{
      content: string;
      documentName: string;
      similarity: number;
    }> = [];

    for (const doc of documents) {
      for (const chunk of doc.chunks) {
        const chunkEmbedding = JSON.parse(chunk.embedding);
        const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
        
        results.push({
          content: chunk.content,
          documentName: doc.name,
          similarity,
        });
      }
    }

    // Sort by similarity and return top K
    const topResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
    
    console.log(`🎯 Top ${topK} results:`);
    topResults.forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.documentName} (similarity: ${result.similarity.toFixed(4)})`);
      console.log(`     Preview: ${result.content.substring(0, 100)}...`);
    });
    
    return topResults;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

/**
 * Fetch document from Vercel Blob and return buffer
 */
export async function fetchDocumentFromBlob(fileUrl: string): Promise<Buffer> {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch document from blob: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Reprocess all documents in a workspace
 */
export async function reprocessWorkspaceDocuments(
  workspaceId: string
): Promise<void> {
  const documents = await prisma.document.findMany({
    where: { workspaceId },
  });

  for (const doc of documents) {
    try {
      // Delete existing chunks
      await prisma.documentChunk.deleteMany({
        where: { documentId: doc.id },
      });

      // Fetch file from Vercel Blob
      const buffer = await fetchDocumentFromBlob(doc.fileUrl);

      // Reprocess the document
      await processDocument(doc.id, buffer, doc.mimeType);
      
      console.log(`✅ Reprocessed document: ${doc.name}`);
    } catch (error) {
      console.error(`❌ Failed to reprocess ${doc.name}:`, error);
    }
  }
}
