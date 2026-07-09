import { Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
        <Sparkles size={18} />
      </div>

      {/* Bubble */}
      <div className="max-w-md">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-300">
            Pidge AI
          </span>
          <span>•</span>
          <span>Thinking...</span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-4">
          <div className="flex gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}