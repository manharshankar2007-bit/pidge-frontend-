import {
  ShoppingBag,
  Users,
  QrCode,
  FileText,
  BarChart3,
  Sliders,
  ArrowRight
} from "lucide-react";

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  const cards = [
    {
      category: "Orders",
      label: "Create an Order",
      prompt: "How do I create an order on the Pidge platform?",
      icon: <ShoppingBag size={20} className="text-indigo-400" />,
      badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    {
      category: "Riders",
      label: "Rider Flexi Shifts",
      prompt: "What are Rider Flexi Shifts and how do riders opt-in?",
      icon: <Users size={20} className="text-purple-400" />,
      badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      category: "Verification",
      label: "Scan to Verify",
      prompt: "How does the scan to verify feature prevent warehouse dispatch errors?",
      icon: <QrCode size={20} className="text-blue-400" />,
      badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      category: "Documentation",
      label: "SOP Documentation",
      prompt: "Show me the standard operating procedures for rider delays.",
      icon: <FileText size={20} className="text-amber-400" />,
      badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      category: "Reports",
      label: "Reports",
      prompt: "What types of delivery reports can I export from the control panel?",
      icon: <BarChart3 size={20} className="text-emerald-400" />,
      badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      category: "Dispatch",
      label: "Surge Configuration",
      prompt: "How can I configure surge pricing during peak weather conditions?",
      icon: <Sliders size={20} className="text-pink-400" />,
      badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-10 sm:py-16 text-center animate-fade-in select-none">
      
      {/* 80x80 Large Glowing Logo */}
      <div className="relative mb-8 group">
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-40 blur-lg transition duration-500 group-hover:opacity-60"></div>
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 p-[2px] shadow-2xl flex items-center justify-center">
          <div className="w-full h-full bg-[#0f1117] rounded-[22px] flex items-center justify-center font-bold text-white text-3xl tracking-tight">
            P
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
        Search Pidge Knowledge
      </h2>
      <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-12 leading-relaxed">
        Ask questions about operations, rider policies, product updates, SOPs, reports, APIs and internal documentation.
      </p>

      {/* 3-Column Responsive Grid with 6 Premium Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left mb-12">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(card.prompt)}
            className="group relative p-[1px] rounded-2xl bg-gradient-to-tr from-white/5 to-white/10 hover:from-indigo-500/40 hover:to-purple-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer outline-none focus:ring-1 focus:ring-indigo-500/30"
            id={`suggested-prompt-card-${idx}`}
          >
            {/* Soft inner glow on card hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300"></div>
            
            {/* Inner Content Container */}
            <div className="relative h-full bg-slate-900/60 backdrop-blur-md rounded-[15px] p-5 flex flex-col justify-between">
              <div>
                {/* Header Badge + Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md border ${card.badgeBg}`}>
                    {card.category}
                  </span>
                  <div className="p-1.5 rounded-lg bg-[#0f1117]/60 border border-white/5">
                    {card.icon}
                  </div>
                </div>

                {/* Card Label */}
                <h4 className="font-semibold text-slate-100 text-sm sm:text-base tracking-tight group-hover:text-indigo-300 transition duration-200">
                  {card.label}
                </h4>

                {/* Sub-prompt */}
                <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
                  "{card.prompt}"
                </p>
              </div>

              {/* Interaction Call to Action */}
              <div className="flex items-center text-xs text-indigo-400 font-medium mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0">
                <span>Ask Pidge AI</span>
                <ArrowRight size={12} className="ml-1.5" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Elegant Separator Line */}
      <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

      {/* Premium Footer */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 font-medium">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-400">Knowledge Base Online</span>
        </div>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <div className="text-slate-400">
          57 Company Documents Indexed
        </div>
        <span className="text-slate-700 hidden sm:inline">|</span>
        <div className="text-slate-400">
          Powered by Pidge Knowledge Base
        </div>
      </div>

    </div>
  );
}
