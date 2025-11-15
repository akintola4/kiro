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
  const welcomePrompt = `Generate a friendly, professional welcome message for a new hire using an AI documentation assistant.

Company: ${workspaceName}
Available Documents: ${documentCount}
Document List: ${documentNames.join(", ") || "None yet"}

Create a warm welcome message that:
1. Greets them enthusiastically
2. Explains you're their AI documentation assistant
3. Lists the available documents
4. Encourages them to ask questions
5. Keep it concise (3-4 sentences)

Welcome Message:`;

  try {
    const response = await model.invoke(welcomePrompt);
    return response.content as string;
  } catch (error) {
    // Fallback message
    return `Welcome to ${workspaceName}! 🎉\n\nI'm your AI documentation assistant. I can help you find information from your company documents.\n\n**Currently available documents:**\n${
      documentNames.length > 0
        ? documentNames.map((name) => `• ${name}`).join("\n")
        : "No documents uploaded yet. Upload some documents to get started!"
    }\n\nAsk me anything about your documentation!`;
  }
}
