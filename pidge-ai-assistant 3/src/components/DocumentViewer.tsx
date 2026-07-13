import { useEffect, useState } from "react";
import { FileText, Mail, X } from "lucide-react";

interface Props {
  filename: string | null;
  onClose: () => void;
}

interface DocumentResponse {
  success: boolean;
  filename: string;
  fileType: string;
  text: string;
}

export default function DocumentViewer({
  filename,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [document, setDocument] =
    useState<DocumentResponse | null>(null);

  useEffect(() => {
    if (!filename) return;

    async function loadDocument() {
      try {
        setLoading(true);

        const response = await fetch(
          `https://inc-jackie-immediate-dosage.trycloudflare.com/document/${encodeURIComponent(
            filename
          )}`
        );

        const data = await response.json();

        setDocument(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [filename]);

  if (!filename) return null;

  return (
    <div className="w-[420px] border-l border-white/10 bg-[#0F1117] flex flex-col">

      <div className="flex items-center justify-between border-b border-white/10 p-5">

        <div>
          <h2 className="font-semibold text-white truncate">
            {filename}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {document?.fileType?.toUpperCase()}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/5"
        >
          <X size={18} />
        </button>

      </div>

      {loading ? (
        <div className="p-6 text-slate-400">
          Loading document...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">

          <div className="mb-5 flex items-center gap-2">

            {document?.fileType === "pdf" ? (
              <FileText className="text-rose-400" />
            ) : (
              <Mail className="text-amber-400" />
            )}

            <span className="text-sm text-slate-400">
              {document?.filename}
            </span>

          </div>

          <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {document?.text}
          </pre>

        </div>
      )}

    </div>
  );
}