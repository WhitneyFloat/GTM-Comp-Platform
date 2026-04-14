// Force sync 2
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
import { useState, useEffect } from "react";
import { LiquidGlassCard } from "./ui/LiquidGlassCard";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react"; // Added Trash icon

interface SequencePanelProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
}

export const SequencePanel = ({ lead, isOpen, onClose }: SequencePanelProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "linkedin">("email");
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // New states for editing
  const [editableSubject, setEditableSubject] = useState("");
  const [editableBody, setEditableBody] = useState("");

  // Simple template generator
  const generateEmail = (step: number) => {
    const company = lead.name || "your company";
    const firstName = lead.contactName || "Team";
    
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

  // Update editable content when step or lead changes
  useEffect(() => {
    if (lead) {
      const template = generateEmail(step);
      setEditableSubject(template.subject);
      setEditableBody(template.body);
    }
  }, [step, lead]);

  const handleSendEmail = async () => {
    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: lead.email || "recipient@example.com",
          subject: editableSubject, // Use edited subject
          body: editableBody         // Use edited body
        }),
      });

      if (response.ok) {
        setIsSent(true);
        setTimeout(() => setIsSent(false), 3000);
      }
    } catch (error) {
      console.error("Failed to send email", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDiscard = () => {
    const template = generateEmail(step);
    setEditableSubject(template.subject);
    setEditableBody(template.body);
  };

  if (!lead) return null;

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
                  <Mail size={14} /> Send Email
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
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</label>
                        <button 
                          onClick={handleDiscard}
                          className="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={10} /> Discard Edits
                        </button>
                      </div>
                      <div className="p-3 bg-white/60 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 flex justify-between items-center group focus-within:border-indigo-400 transition-colors">
                        <input 
                          type="text"
                          value={editableSubject}
                          onChange={(e) => setEditableSubject(e.target.value)}
                          className="bg-transparent border-none outline-none w-full mr-4"
                        />
                        <button onClick={() => handleCopy(editableSubject, 'subj')} className="text-slate-300 hover:text-brand-indigo shrink-0">
                          {copied === 'subj' ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Body</label>
                      <div className="p-4 bg-white/80 border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-600 min-h-[350px] relative group focus-within:border-indigo-400 transition-colors">
                        <textarea 
                          value={editableBody}
                          onChange={(e) => setEditableBody(e.target.value)}
                          className="bg-transparent border-none outline-none w-full h-full min-h-[300px] resize-none scrollbar-hide"
                        />
                        <button 
                          onClick={() => handleCopy(editableBody, 'body')}
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

              </div>

              {/* Actions */}
              <div className="p-6 border-t border-white/20 bg-white/20 flex gap-3">
                {activeTab === "email" ? (
                  <button 
                    onClick={handleSendEmail}
                    disabled={isSending || isSent}
                    className={cn(
                      "flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all relative overflow-hidden",
                      isSent 
                        ? "bg-emerald-500 text-white" 
                        : "bg-slate-800 text-white hover:bg-slate-900 disabled:bg-slate-700"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isSending ? (
                        <motion.div
                          key="sending"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </motion.div>
                      ) : isSent ? (
                        <motion.div
                          key="sent"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2"
                        >
                          Sent! <Check size={18} className="text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          className="flex items-center gap-2"
                        >
                          Send with Gmail <Send size={16} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                ) : (
                  <button className="flex-1 py-3.5 bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all">
                     Save to n8n Queue <Send size={16} />
                  </button>
                )}
              </div>
            </LiquidGlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
