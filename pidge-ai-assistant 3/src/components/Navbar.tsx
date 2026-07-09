import React from "react";
import { Trash2, BookOpen, X, FileText, ExternalLink } from "lucide-react";

interface NavbarProps {
  onClearChat: () => void;
  hasMessages: boolean;
}

export default function Navbar({ onClearChat, hasMessages }: NavbarProps) {
  const [showDocsModal, setShowDocsModal] = React.useState(false);

  const docsList = [
    { name: "route_optimization_v4.pdf", size: "1.2 MB", desc: "Proprietary traffic heuristics and multi-stop route dispatch planner." },
    { name: "rider_delay_sop_v2.eml", size: "45 KB", desc: "SOP guidelines for transit emergencies, delayed dispatch and rerouting." },
    { name: "pidge_tracking_api_spec.pdf", size: "840 KB", desc: "Technical schema for real-time tracking webhooks and REST integrations." },
    { name: "consignment_pricing_manifest.pdf", size: "620 KB", desc: "Volumetric weighing, fuel surcharges, and core delivery tariff matrices." },
    { name: "dispatcher_dashboard_guide.pdf", size: "2.1 MB", desc: "Control Tower user manual for automated fleet and rider allocations." },
    { name: "customer_complaints_handling.eml", size: "28 KB", desc: "Escalation procedures, dispute resolution forms, and SMS templates." },
    { name: "pidge_rider_onboarding_faq.pdf", size: "480 KB", desc: "Partner FAQ, fuel incentives, performance payouts, and wallet system." },
    { name: "warehouse_sorting_layout_v1.pdf", size: "1.8 MB", desc: "Cross-dock sorting hub layout planning and inbound parcel bins." }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0f1117] border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Custom Sleek Pidge Glowing Logomark */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/10">
            <div className="w-full h-full bg-[#0f1117] rounded-[6px] flex items-center justify-center font-bold text-white text-sm">
              P
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-white tracking-tight text-base sm:text-lg">
                Pidge
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20">
                AI Assistant
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Operational Indicator */}
          <div className="hidden md:flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational
          </div>

          {/* Docs Library Button */}
          <button
            onClick={() => setShowDocsModal(true)}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-indigo-400 bg-white/5 hover:bg-white/10 border border-white/10 py-1.5 px-3 rounded-lg transition-all duration-200"
            title="Browse logistics reference documents"
            id="docs-library-btn"
          >
            <BookOpen size={14} className="text-indigo-400" />
            <span className="hidden sm:inline">Docs Library</span>
          </button>

          {/* Clear Chat Button */}
          <button
            onClick={onClearChat}
            disabled={!hasMessages}
            className={`flex items-center space-x-1.5 text-xs py-1.5 px-3 rounded-lg border transition-all duration-200 ${
              hasMessages
                ? "text-slate-300 hover:text-rose-400 bg-white/5 hover:bg-rose-950/20 border-white/10 hover:border-rose-900/30"
                : "text-slate-600 bg-slate-950 border-slate-900 cursor-not-allowed opacity-50"
            }`}
            title="Clear current chat log"
            id="clear-chat-btn"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </header>

      {/* Docs Library Modal */}
      {showDocsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-950/10 overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-2">
                <BookOpen size={18} className="text-indigo-400" />
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base">Pidge Logistics Document Center</h3>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
                id="close-docs-modal-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-800/50">
              <p className="text-xs text-slate-400 pb-2">
                Pidge AI Assistant has context access to these local operational manuals and email templates. Use corresponding keywords like <span className="text-slate-300 font-mono">"optimize"</span>, <span className="text-slate-300 font-mono">"delay"</span>, or <span className="text-slate-300 font-mono">"API"</span> to trigger relevant sources in your queries.
              </p>
              {docsList.map((doc, idx) => (
                <div key={idx} className="pt-3 flex items-start space-x-3 text-left">
                  <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 mt-0.5">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-200 font-medium truncate block">
                        {doc.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                        {doc.size}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {doc.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-center">
              <button
                onClick={() => setShowDocsModal(false)}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-xs font-medium text-slate-100 rounded-xl transition duration-200"
                id="close-docs-modal-footer-btn"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
