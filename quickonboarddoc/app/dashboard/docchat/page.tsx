"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { IconSend, IconUpload, IconRobot, IconUser, IconFolder, IconMicrophone } from "@tabler/icons-react";
import { LoadingPage, LoadingDots } from "@/components/ui/loading";
import { Ghost } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function DocChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: workspaceInfo } = useQuery({
    queryKey: ["workspace-info"],
    queryFn: async () => {
      const response = await fetch("/api/workspace/info");
      if (!response.ok) throw new Error("Failed to fetch workspace info");
      return response.json();
    },
  });

  const { data: documents } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Failed to fetch documents");
      return response.json();
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Chat failed");
      return response.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  useEffect(() => {
    const loadWelcomeMessage = async () => {
      if (messages.length === 0) {
        try {
          const response = await fetch("/api/workspace/welcome");
          if (response.ok) {
            const data = await response.json();
            const welcomeMessage: Message = {
              id: "welcome",
              role: "assistant",
              content: data.message,
              timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
          } else {
            // Fallback welcome message
            const fallbackMessage: Message = {
              id: "welcome",
              role: "assistant",
              content: "Welcome! 👋\n\nI'm your AI documentation assistant. I can help you find information from your company documents.\n\nAsk me anything about your documentation!",
              timestamp: new Date(),
            };
            setMessages([fallbackMessage]);
          }
        } catch (error) {
          console.error("Failed to load welcome message:", error);
          // Fallback welcome message on error
          const fallbackMessage: Message = {
            id: "welcome",
            role: "assistant",
            content: "Welcome! 👋\n\nI'm your AI documentation assistant. I can help you find information from your company documents.\n\nAsk me anything about your documentation!",
            timestamp: new Date(),
          };
          setMessages([fallbackMessage]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadWelcomeMessage();
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(input);
    setInput("");
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen">
      {/* <div className="border-b border-border p-4 sm:p-6 bg-background flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold">Document Chat</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Ask questions about your company documentation
        </p>
      </div> */}

      <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 pb-32">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-2 sm:gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconRobot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                )}
                <Card
                  className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-[10px] sm:text-xs opacity-60 mt-1 sm:mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
                {message.role === "user" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <IconUser className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {chatMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Ghost className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <Card className="p-4 bg-card">
                <LoadingDots />
              </Card>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 right-3 sm:left-4 sm:right-4 md:left-20 md:right-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-1 sm:gap-2 items-center px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-full bg-muted/50 border border-border/50 hover:border-border transition-colors shadow-lg backdrop-blur-sm">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted hidden sm:flex"
              onClick={() => {
                toast.info("Attachments coming soon!");
              }}
            >
              <IconUpload className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </Button>
            
            <input
              type="file"
              id="chat-file-upload"
              className="hidden"
              onChange={(e) => {
                toast.info("File upload from chat coming soon!");
              }}
            />
            <label htmlFor="chat-file-upload" className="hidden sm:block">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted"
                asChild
              >
                <span>
                  <IconFolder className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </span>
              </Button>
            </label>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm placeholder:text-muted-foreground px-1 sm:px-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-muted hidden sm:flex"
              onClick={() => {
                toast.info("Voice input coming soon!");
              }}
            >
              <IconMicrophone className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || chatMutation.isPending}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary hover:bg-primary/90"
            >
              <IconSend className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
