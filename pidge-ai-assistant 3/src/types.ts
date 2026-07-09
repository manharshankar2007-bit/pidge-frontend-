export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  sources?: string[];
  images?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export interface SuggestedPrompt {
  label: string;
  prompt: string;
  category: string;
}