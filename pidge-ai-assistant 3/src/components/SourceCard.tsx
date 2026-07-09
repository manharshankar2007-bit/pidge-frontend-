import { FileText, Mail, ExternalLink } from "lucide-react";

interface SourceCardProps {
  file: string;
}

export default function SourceCard({ file }: SourceCardProps) {
  const isPdf = file.toLowerCase().endsWith(".pdf");

  return (
    <button
      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-white/5 ${
        isPdf
          ? "border-rose-500/20 bg-rose-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}
    >
      <div className="rounded-xl bg-slate-900 p-2">
        {isPdf ? (
          <FileText size={18} className="text-rose-400" />
        ) : (
          <Mail size={18} className="text-amber-400" />
        )}
      </div>

      <div className="flex-1 text-left overflow-hidden">
        <div className="truncate text-sm font-medium text-slate-200">
          {file}
        </div>

        <div className="text-xs text-slate-500">
          {isPdf ? "PDF Document" : "Email Document"}
        </div>
      </div>

      <ExternalLink
        size={15}
        className="text-slate-500 transition group-hover:text-indigo-400"
      />
    </button>
  );
}