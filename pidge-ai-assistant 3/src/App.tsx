
import React, { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatMessageItem from "./components/ChatMessageItem";
import ChatInput from "./components/ChatInput";
import { Message } from "./types";
import DocumentViewer from "./DocumentViewer";
const WELCOME_MESSAGE: Message = {
  id: "welcome-init",
  sender: "assistant",
  text: `### Welcome to the Pidge AI Operations Portal! 🚚

I am your unified logistics dispatcher and control-tower assistant. You can query me for real-time fleet analytics, routing optimization, SLA protocols, or API webhooks.

Here are a few quick operations you can trigger:
- **Route Optimization**: Ask to optimize stops for NCR dispatch dispatches.
- **Shipment Status**: Get real-time cargo tracking updates.
- **SOP Exception Rules**: Ask what procedures are followed during rider delays.
- **Technical APIs**: Learn how to connect shipment webhooks.

*Select a suggested dispatch card below or write your inquiry to get started.*`,
  timestamp: new Date().toISOString(),
  sources: ["dispatcher_dashboard_guide.pdf", "pidge_onboarding_faq.pdf"]
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message on change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    // 1. Append user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Query our real backend /chat endpoint
    try {
      const response = await fetch(
  "fetch(https://pidge-backend.onrender.com/chat",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: text })
  }
);
      if (!response.ok) {
        throw new Error(`HTTP network exception error: status ${response.status}`);
      }

      const data = await response.json();
      console.log(data.images);

      if (data.success) {
        const assistantMsg: Message = {
  id: `bot-${Date.now()}`,
  sender: "assistant",
  text: data.answer,
  timestamp: new Date().toISOString(),
  sources: [],
  images: data.images || []
};
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "Internal server route exception.");
      }
    } catch (error: any) {
      console.error("Failed to fetch chat:", error);
      
      // Append a highly professional error fallback message
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: `### ⚠️ Connection Exception Raised
        
I am currently experiencing latency with the Pidge Central Hub. Please check your network credentials or try resubmitting your dispatcher query in a moment.

*Technical Log:* \`${error.message || error}\``,
        timestamp: new Date().toISOString(),
        sources: []
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-[#0f1117] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-slate-100">
      {/* Fixed Header Navbar */}
      <Navbar onClearChat={handleClearChat} hasMessages={hasMessages} />

      {/* Main Container */}
      <main className="flex-1 flex flex-col pt-[72px] pb-[144px] w-full max-w-2xl mx-auto px-4">
        {!hasMessages ? (
          /* Empty Chat Welcome Landing */
          <WelcomeScreen onSelectPrompt={handleSendMessage} />
        ) : (
          /* Standard Scrollable Chat Messages */
          <div className="flex-1 flex flex-col py-4">
            {messages.map((msg) => (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                onOpenDocument={setSelectedDocument}
              />
            ))}

            {/* Premium Bouncing Typing Indicator */}
            {isLoading && (
              <div className="flex items-start max-w-[85%] space-x-3 mt-2 animate-pulse" id="typing-indicator">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-xs shrink-0 select-none bg-gradient-to-tr from-indigo-500 to-purple-500 text-slate-50 shadow-md shadow-indigo-500/10">
                  P
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 px-1">
                    <span className="font-medium text-slate-400">Pidge Bot is formulating...</span>
                  </div>
                  <div className="glass rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-1.5 py-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Anchored Scroll Marker */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {selectedDocument && (
        <div className="fixed right-0 top-[72px] h-[calc(100vh-72px)] z-50">
          <DocumentViewer filename={selectedDocument} onClose={() => setSelectedDocument(null)} />
        </div>
      )}

      {/* Fixed Bottom Input Console */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );

}
