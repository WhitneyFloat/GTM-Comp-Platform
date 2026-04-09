"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Linkedin, 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  ChevronRight,
  Clock,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { LiquidGlassCard } from "./ui/LiquidGlassCard";
import { cn } from "@/lib/utils";

interface SequencePanelProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

export const SequencePanel = ({ lead, isOpen, onClose }: SequencePanelProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "linkedin">("email");
  const [step, setStep] = useState(1);

  if (!lead) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Simple template generator
  const generateEmail = (step: number) => {
    const company = lead.name || "your company";
    const firstName = lead.contactName || "Team";
    const headCount = lead.headcount || "scaling";
    
    const templates = {
      1: {
        subject: `Quick observation about ${company}'s comp structure`,
        body: `${firstName},\n\nI was looking at ${company}’s recent growth — ${Math.floor(Math.random() * 5) + 3} new AE postings in the last 90 days is a meaningful scale.\n\nOne thing I’ve seen consistently at companies moving at that pace: the comp plan that got you to this point almost never scales cleanly to the next stage. Not because it was built wrong — because the business changed faster than the plan did.\n\nI’m Kelly Gill-Braxton. I’m a fractional Head of Sales Compensation — I’ve built and rebuilt comp infrastructure for teams at Fivetran, Motive, Pure Storage, and Block. I work specifically with growth-stage companies who are scaling faster than their comp plan can handle.\n\nI’m not pitching you anything today. I’m just curious — is comp infrastructure something you’re actively thinking about right now, or is it something that’s been on the back burner?\n\nKelly Gill-Braxton`
      },
      2: {
        subject: `${firstName}, forgot to include this`,
        body: `${firstName},\n\nI reached out last week and wanted to follow up with something useful whether or not we ever talk.\n\nI put together a quick self-assessment I use with new clients to identify where comp infrastructure is creating the most drag on revenue:\n\n→ “Is Your Comp Plan Working? — The 12-Point Health Check”\n\nTakes five minutes. If their score comes back in the red zone, most leaders tell me they already knew something was off — they just hadn’t named it yet.\n\nKelly Gill-Braxton`
      }
    };
    
    return templates[step as keyof typeof templates] || templates[1];
  };

  const generateLinkedin = (step: number) => {
    const company = lead.name || "your company";
    const firstName = lead.contactName || "Team";
    const stage = lead.stage || "current";

    const templates = {
      1: `Hi ${firstName} — noticed ${company} is scaling the sales team. I work with growth-stage companies on comp infrastructure — the part that usually gets outpaced by headcount growth. Would love to connect.`,
      2: `Thanks for connecting ${firstName}.\n\nI’ll skip the pitch — I’m genuinely curious about something. You’re scaling the sales team at ${company}. At your stage, comp infrastructure is one of those things that either keeps pace with growth or quietly starts creating problems.\n\nWhat does the comp side look like at ${company} right now?`
    };

    return templates[step as keyof typeof templates] || templates[1];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-indigo-900/10 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl z-[70] p-4"
          >
            <LiquidGlassCard className="h-full flex flex-col shadow-2xl border-l border-white/30" blurIntensity="xl">
              {/* Header */}
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">AI Sequence Draft</h2>
                    <p className="text-xs text-slate-500 font-medium">Targeting {lead.name}</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6 py-4 flex gap-2 border-b border-white/10 bg-white/10">
                <button 
                  onClick={() => setActiveTab("email")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                    activeTab === "email" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-white/40"
                  )}
                >
                  <Mail size={14} /> Email Drafts
                </button>
                <button 
                  onClick={() => setActiveTab("linkedin")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all",
                    activeTab === "linkedin" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-white/40"
                  )}
                >
                  <Linkedin size={14} /> LinkedIn
                </button>
              </div>

              {/* Step Navigation */}
              <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button 
                      key={s}
                      onClick={() => setStep(s)}
                      className={cn(
                        "w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all border",
                        step === s ? "bg-brand-indigo border-brand-indigo text-white" : "bg-white border-slate-200 text-slate-400 hover:border-brand-indigo/50"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   Step {step} // {activeTab === "email" ? "Delay: 13 days" : "Delay: 4 days"}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === "email" ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</label>
                      <div className="p-3 bg-white/60 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 flex justify-between items-center group">
                        <span>{generateEmail(step).subject}</span>
                        <button onClick={() => handleCopy(generateEmail(step).subject, 'subj')} className="text-slate-300 hover:text-brand-indigo">
                          {copied === 'subj' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Body</label>
                      <div className="p-4 bg-white/80 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-600 min-h-[300px] whitespace-pre-wrap relative group">
                        {generateEmail(step).body}
                        <button 
                          onClick={() => handleCopy(generateEmail(step).body, 'body')}
                          className="absolute bottom-4 right-4 p-2 bg-indigo-50 text-brand-indigo rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copied === 'body' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LinkedIn Message</label>
                    <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm leading-relaxed text-slate-700 whitespace-pre-wrap relative group italic">
                      {generateLinkedin(step)}
                      <button 
                        onClick={() => handleCopy(generateLinkedin(step), 'li')}
                        className="absolute bottom-4 right-4 p-2 bg-white text-indigo-600 rounded-lg border border-indigo-100 shadow-sm"
                      >
                        {copied === 'li' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <div className="p-1.5 bg-amber-100 rounded text-amber-600 h-fit">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide">Sequence Timing</h4>
                    <p className="text-[11px] text-amber-900/60 mt-0.5 leading-normal">
                      This sequence is set for a 6-week duration with 5 touchpoints total. 
                      Optimal send time: Tuesday @ 8:45 AM.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-white/20 bg-white/20 flex gap-3">
                <button className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
                   Save to n8n Queue <Send size={16} />
                </button>
              </div>
            </LiquidGlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
