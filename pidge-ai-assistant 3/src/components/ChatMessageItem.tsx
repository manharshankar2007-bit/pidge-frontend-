import React from "react";
import {
  Copy,
  Check,
 FileText,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "../types";

interface ChatMessageItemProps {
  message: Message;
  onOpenDocument?: (filename: string) => void;
}

export default function ChatMessageItem({
  message,
  onOpenDocument,
}: ChatMessageItemProps) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error(err);
    }
  }

  function formattedTime(date: string) {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getSourceDetails(file: string) {
    const pdf = file.toLowerCase().endsWith(".pdf");

    return {
      icon: pdf ? (
        <FileText size={15} className="text-rose-400" />
      ) : (
        <Mail size={15} className="text-amber-400" />
      ),
      label: pdf ? "PDF Document" : "Email",
      color: pdf
        ? "bg-rose-500/5 border-rose-500/20"
        : "bg-amber-500/5 border-amber-500/20",
    };
  }

  return (<div
  className="group mb-8 flex w-full animate-fade-in flex-col"
  id={`message-${message.id}`}
>
  <div
    className={`flex items-start gap-3 ${
      message.sender === "user"
        ? "justify-end"
        : "justify-start"
    }`}
  >
    {/* Avatar */}
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
        message.sender === "assistant"
          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
          : "bg-slate-800 text-slate-200 border border-white/10"
      }`}
    >
      {message.sender === "assistant" ? (
        <Sparkles size={18} />
      ) : (
        <span className="text-xs font-semibold">You</span>
      )}
    </div>

    {/* Content */}
    {/* Content */}
<div className="w-full max-w-5xl">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
        <span className="font-medium text-slate-300">
          {message.sender === "assistant"
            ? "Pidge AI"
            : "You"}
        </span>

        <span>•</span>

        <span>{formattedTime(message.timestamp)}</span>
      </div>

      <div
        className={`relative max-w-full rounded-3xl border p-5 transition-all duration-300 ${
          message.sender === "assistant"
            ? "border-white/10 bg-white/5 backdrop-blur-lg hover:border-indigo-500/30"
            : "border-indigo-500/30 bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
        }`}
      >

        {message.sender === "assistant" && (
          <button
            onClick={handleCopy}
            className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-white/5 hover:text-indigo-400"
          >
            {copied ? (
              <Check
                size={15}
                className="text-emerald-400"
              />
            ) : (
              <Copy size={15} />
            )}
          </button>
          
        )}

       {message.sender === "assistant" ? (
  <>
    <div className="prose prose-invert max-w-none text-sm leading-7">
      <ReactMarkdown>{message.text}</ReactMarkdown>
    </div>
    <h3 className="mt-6 mb-3 text-sm font-semibold text-slate-300">
  Screenshots
</h3>

    {message.images && message.images.length > 0 && (
      <div className="mt-5 space-y-4">
        {message.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Screenshot ${index + 1}`}
            className="w-full rounded-xl border border-white/10 shadow-lg"
          />
        ))}
      </div>
    )}
  </>
) : (
  <p className="whitespace-pre-wrap text-sm leading-7">
    {message.text}
  </p>
)}
      </div>      {/* Source Documents */}
      {message.sender === "assistant" &&
        message.sources &&
        message.sources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {message.sources.map((src, index) => {
              const details = getSourceDetails(src);

              return (
                <button
                  key={index}
                  onClick={() => onOpenDocument?.(src)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-500/40 hover:bg-white/5 ${details.color}`}
                >
                  <div className="rounded-lg bg-slate-900 p-1.5">
                    {details.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-slate-200">
                      {src}
                    </div>

                    <div className="text-[10px] text-slate-500">
                      {details.label}
                    </div>
                  </div>

                  <ExternalLink
                    size={13}
                    className="ml-1 text-slate-500"
                  />
                </button>
              );
            })}
          </div>
        )}

    </div>
  </div>
</div>
  );
}