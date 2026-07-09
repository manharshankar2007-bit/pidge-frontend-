import React, { useRef, useEffect } from "react";
import { Send, Mic, Paperclip, AlertCircle } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({
  onSendMessage,
  disabled,
}: ChatInputProps) {
  const [inputText, setInputText] = React.useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [inputText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim() || disabled) return;

    onSendMessage(inputText.trim());
    setInputText("");

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceClick = () => {
    alert("Voice mode coming soon.");
  };

  const handleFileUploadClick = () => {
    alert("Document upload will be available soon.");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0f1117] via-[#0f1117]/95 to-transparent px-4 pb-5 pt-8">

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#1a2233]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:shadow-[0_0_40px_rgba(99,102,241,0.18)]"
      >

        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Ask anything about Pidge..."
          className="w-full resize-none bg-transparent px-5 pt-5 pb-4 text-[15px] leading-7 text-slate-100 placeholder:text-slate-500 focus:outline-none min-h-[68px] max-h-[180px]"
        />

        <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleFileUploadClick}
              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              onClick={handleVoiceClick}
              className="rounded-xl p-2.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Mic size={18} />
            </button>

          </div>

          <button
            type="submit"
            disabled={disabled || inputText.trim() === ""}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
              disabled || inputText.trim() === ""
                ? "cursor-not-allowed border border-white/5 bg-slate-900 text-slate-600"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 active:scale-95"
            }`}
          >
            <Send size={18} />
          </button>

        </div>

      </form>

      <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-slate-500">

        <AlertCircle
          size={12}
          className="text-indigo-500/70"
        />

        <span>
          AI responses may be inaccurate. Verify important operational decisions.
        </span>

      </div>

    </div>
  );
}