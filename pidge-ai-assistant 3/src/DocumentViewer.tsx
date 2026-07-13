import { useEffect, useState } from "react";
import { FileText, Mail, X } from "lucide-react";

interface Props {
  filename: string | null;
  onClose: () => void;
}

interface DocumentResponse {
  success: boolean;
  filename: string;
  title: string;
  fileType: string;
  text: string;
}

export default function DocumentViewer({
  filename,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [documentData, setDocumentData] =
    useState<DocumentResponse | null>(null);

  useEffect(() => {
    if (!filename) return;

    async function loadDocument() {
      try {
        setLoading(true);

        const response = await fetch(
          `https://inc-jackie-immediate-dosage.trycloudflare.com/document/${encodeURIComponent(filename)}`
        );

        const data: DocumentResponse = await response.json();

        if (data.success) {
          setDocumentData(data);
        } else {
          setDocumentData(null);
        }
      } catch (err) {
        console.error(err);
        setDocumentData(null);
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [filename]);

  if (!filename) return null;

  return (
    <div className="w-[700px] border-l border-white/10 bg-[#0B0F19] flex flex-col shadow-2xl">

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0B0F19]/95 backdrop-blur p-6">

        <div className="flex items-start justify-between">

          <div>

            <span className="text-xs uppercase tracking-[0.25em] text-indigo-400">
              Knowledge Article
            </span>

            <h1 className="mt-2 text-2xl font-bold text-white">
              {documentData?.title || filename}
            </h1>

            <div className="mt-3 flex items-center gap-3">

              {documentData?.fileType === "pdf" ? (
                <FileText className="text-rose-400" size={18} />
              ) : (
                <Mail className="text-amber-400" size={18} />
              )}

              <span className="text-sm text-slate-400 uppercase">
                {documentData?.fileType}
              </span>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>

        </div>

      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          Loading document...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-8 py-8">

          {/* File Information */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">

            <div className="text-xs uppercase tracking-widest text-slate-500">
              Original File
            </div>

            <div className="mt-2 break-all text-sm text-slate-300">
              {documentData?.filename}
            </div>

          </div>

          {/* Divider */}
          <div className="mb-8 h-px bg-gradient-to-r from-indigo-500/50 via-white/10 to-transparent" />

          {/* Document Body */}
          <div className="space-y-2">
            {documentData?.text.split("\n").map((line, index) => {
              const text = line.trim();

              if (!text) {
                return <div key={index} className="h-3" />;
              }

              if (
                text.toLowerCase().includes("what's new") ||
                text.toLowerCase().includes("overview") ||
                text.toLowerCase().includes("benefits") ||
                text.toLowerCase().includes("features") ||
                text.toLowerCase().includes("how to") ||
                text.toLowerCase().includes("steps") ||
                text.toLowerCase().includes("workflow") ||
                text.toLowerCase().includes("configuration")
              ) {
                return (
                  <div key={index} className="mt-8">
                    <h2 className="text-2xl font-bold text-white">
                      {text}
                    </h2>

                    <div className="mt-2 h-px bg-gradient-to-r from-indigo-500 via-white/20 to-transparent" />
                  </div>
                );
              }

              if (text.endsWith(":")) {
                return (
                  <h3
                    key={index}
                    className="mt-6 text-lg font-semibold text-indigo-300"
                  >
                    {text}
                  </h3>
                );
              }

              if (
                text.startsWith("-") ||
                text.startsWith("•") ||
                /^\d+\./.test(text)
              ) {
                return (
                  <div
                    key={index}
                    className="ml-4 text-slate-300 leading-8"
                  >
                    {text}
                  </div>
                );
              }

              return (
                <p
                  key={index}
                  className="leading-8 text-slate-300"
                >
                  {text}
                </p>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}