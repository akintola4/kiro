import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { prisma } from "./prisma";

// Initialize Gemini model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-2.0-flash",
  temperature: 0.3,
  maxOutputTokens: 2048,
});

// RAG prompt template
const RAG_PROMPT = `You are a helpful AI assistant for company onboarding. Answer questions based on the provided documentation.

RULES:
1. Answer questions directly and concisely using ONLY the provided context
2. If the answer is not in the context, say "I don't have that information in the current documentation."
3. Be professional and helpful, but avoid repetitive greetings
4. When citing information, mention the source document in parentheses
5. Keep responses focused and to the point

Context from company documents:
{context}

Question: {question}

Answer:`;

const prompt = PromptTemplate.fromTemplate(RAG_PROMPT);

import { searchDocumentChunks } from "./document-processor";

export async function generateRAGResponse(
  question: string,
  workspaceId: string
): Promise<{ answer: string; confidence: number; sources: string[] }> {
  try {
    // Search for relevant document chunks using vector similarity
    const relevantChunks = await searchDocumentChunks(question, workspaceId, 5);

    // Build context from relevant chunks
    let context: string;
    let sources: string[] = [];

    if (relevantChunks.length === 0) {
      context = "No relevant documents found.";
    } else {
      context = relevantChunks
        .map((chunk, index) => {
          if (!sources.includes(chunk.documentName)) {
            sources.push(chunk.documentName);
          }
          return `[Document: ${chunk.documentName}]\n${chunk.content}\n`;
        })
        .join("\n---\n\n");
    }

    // Create the chain
    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    // Generate response
    const answer = await chain.invoke({
      context,
      question,
    });

    // Calculate confidence based on similarity scores
    const avgSimilarity = relevantChunks.length > 0
      ? relevantChunks.reduce((sum, chunk) => sum + chunk.similarity, 0) / relevantChunks.length
      : 0;
    const confidence = Math.round(avgSimilarity * 100);

    return {
      answer,
      confidence: Math.max(confidence, 50), // Minimum 50% confidence
      sources,
    };
  } catch (error) {
    console.error("RAG Error:", error);
    throw new Error("Failed to generate response");
  }
}

// Welcome message generator
export async function generateWelcomeMessage(
  workspaceName: string,
  documentCount: number,
  documentNames: string[]
): Promise<string> {
  // Use fallback message directly - more reliable and faster
  return `Welcome to ${workspaceName}! 🎉\n\nI'm your AI documentation assistant, here to help you navigate your company resources and answer questions.\n\n**Available documents (${documentCount}):**\n${
    documentNames.length > 0
      ? documentNames.map((name) => `• ${name}`).join("\n")
      : "No documents uploaded yet. Upload some documents in the Storage page to get started!"
  }\n\nFeel free to ask me anything about your documentation!`;
}
