"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Activity, CheckCircle2, AlertTriangle,
  ShieldCheck, Download, Sparkles, ArrowRight, Lock
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";
import { QUESTIONS, SECTIONS, DIMENSIONS } from "@/lib/diagnosticData";
import type { Answer } from "@/lib/generateReport";

export default function PublicDiagnostic() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [leadInfo, setLeadInfo] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const totalSteps = QUESTIONS.length;
  const isIntro = currentStep === -1;
  const isLeadCapture = currentStep === QUESTIONS.length;
  const isResults = currentStep === QUESTIONS.length + 1;

  const handleSelectOption = (questionId: string, score: number, idx: number) => {
    setAnswers({ ...answers, [questionId]: { score, idx } });
    setTimeout(() => setCurrentStep((p) => p + 1), 400);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: leadInfo.name, email: leadInfo.email, stage: "1" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || `Server error (${res.status}). Please try again.`);
        setIsSubmitting(false);
        return;
      }
      setCurrentStep((p) => p + 1);
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const { generateReport } = await import("@/lib/generateReport");
      await generateReport({ name: leadInfo.name, answers, questions: QUESTIONS });
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed — please try again or contact support.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const calculateHealthPercentage = () => {
    const total = Object.values(answers).reduce((a, b) => a + b.score, 0);
    return Math.max(0, 100 - Math.round((total / (QUESTIONS.length * 5)) * 100));
  };

  const calcDim = (ids: string[]) => {
    const valid = ids.filter((id) => answers[id]);
    if (!valid.length) return 50;
    return Math.max(0, 100 - Math.round((valid.reduce((s, id) => s + answers[id].score, 0) / (valid.length * 5)) * 100));
  };

  const currentQuestion = QUESTIONS[currentStep];
  const sectionInfo = currentQuestion ? SECTIONS.find((s) => s.id === currentQuestion.section) : null;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">

          {isIntro && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
              <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="2xl">
                <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl mb-6 flex items-center justify-center mx-auto border border-brand-indigo/20">
                  <Activity className="text-brand-indigo" size={32} />
                </div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">Comp Plan Diagnostic</h1>
                <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
                  Identify risks in your sales compensation structure. Receive a personalized health score and a 6-page strategy report.
                </p>
                <button onClick={() => setCurrentStep(0)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-12 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/25 uppercase tracking-widest text-sm mx-auto">
                  Start The Audit <ArrowRight size={20} />
                </button>
              </LiquidGlassCard>
            </motion.div>
          )}

          {currentStep >= 0 && currentStep < QUESTIONS.length && currentQuestion && sectionInfo && (
            <motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[10px] font-black text-slate-500 mb-6 uppercase tracking-widest">
                  <Activity size={12} className="text-brand-indigo" /> Section {sectionInfo.id}: {sectionInfo.subtitle}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-48 h-1 bg-slate-200/50 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-brand-indigo" animate={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{currentStep + 1} / {totalSteps}</span>
                </div>
              </div>
              <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="2xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">{currentQuestion.text}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button key={idx} onClick={() => handleSelectOption(currentQuestion.id, option.score, idx)}
                      className={cn(
                        "w-full text-left p-5 rounded-xl border-2 transition-all duration-300 group flex items-center justify-between",
                        answers[currentQuestion.id]?.idx === idx
                          ? "bg-brand-indigo border-brand-indigo text-white shadow-lg"
                          : "bg-white/40 border-white/10 text-slate-600 hover:border-brand-indigo/40 hover:bg-white shadow-sm"
                      )}>
                      <span className="font-semibold text-sm md:text-base pr-4">{option.label}</span>
                      {answers[currentQuestion.id]?.idx === idx && <CheckCircle2 size={20} />}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex justify-between items-center px-2">
                  <button onClick={() => setCurrentStep((p) => p - 1)}
                    className="text-xs font-bold text-slate-400 hover:text-brand-indigo uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button onClick={() => setCurrentStep((p) => p + 1)}
                    className="text-xs font-bold text-slate-400 hover:text-brand-indigo uppercase tracking-widest flex items-center gap-1 transition-colors">
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </LiquidGlassCard>
            </motion.div>
          )}

          {isLeadCapture && (
            <motion.div key="capture" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                <ShieldCheck className="text-emerald-500" size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">Your analysis is complete!</h2>
              <p className="text-slate-500 max-w-lg mx-auto leading-relaxed text-lg">
                Enter your details to <span className="text-brand-indigo font-black">unlock your Health Score</span> and receive the full 6-page PDF breakdown.
              </p>
              <LiquidGlassCard className="p-10 mt-8 max-w-md mx-auto" shadowIntensity="2xl">
                <form onSubmit={handleLeadSubmit} className="space-y-5 text-left">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input required type="text" placeholder="e.g. David Chen"
                      className="w-full bg-white/50 border border-white/60 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all font-bold text-slate-800"
                      value={leadInfo.name} onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Work Email</label>
                    <input required type="email" placeholder="david@company.io"
                      className="w-full bg-white/50 border border-white/60 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all font-bold text-slate-800"
                      value={leadInfo.email} onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })} />
                  </div>
                  {submitError && (
                    <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 rounded-lg px-4 py-3">{submitError}</p>
                  )}
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-5 mt-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40 active:scale-[0.98] transition-all text-sm disabled:opacity-70">
                    {isSubmitting ? "Saving..." : <><span>Receive Results</span><Sparkles size={20} /></>}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                    <Lock size={12} /> Confidential Strategy Portal
                  </p>
                </form>
              </LiquidGlassCard>
            </motion.div>
          )}

          {isResults && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <LiquidGlassCard className="p-10 text-center relative overflow-hidden" shadowIntensity="2xl">
                <div className="absolute top-0 right-0 p-8">
                  <span className="px-3 py-1 bg-white/50 backdrop-blur-sm shadow-sm rounded-full text-[10px] font-black text-slate-400 uppercase border border-white/50">
                    Analysis ID: #GT-{Math.floor(Math.random() * 9000) + 1000}
                  </span>
                </div>
                <h3 className="text-5xl font-black text-slate-800 mb-2">{calculateHealthPercentage()}%</h3>
                <h4 className="text-xs font-black text-brand-indigo uppercase tracking-widest mb-10">Compensation Health Score</h4>

                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl mb-10 text-left">
                  <div className="flex items-center gap-3 text-amber-600 font-black mb-3 text-sm uppercase tracking-wider">
                    <AlertTriangle size={20} /> Key Findings
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                    Hey <span className="text-slate-800">{leadInfo.name}</span>, your input has been analyzed across four dimensions. Download the full report for prioritized recommendations specific to your answers.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {DIMENSIONS.map(({ label, ids }) => {
                    const ds = calcDim(ids);
                    return (
                      <div key={label} className="p-4 bg-white/30 rounded-xl border border-white/40">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
                        <span className={`text-lg font-black ${ds >= 70 ? "text-emerald-600" : ds >= 40 ? "text-amber-500" : "text-red-500"}`}>{ds}%</span>
                      </div>
                    );
                  })}
                </div>

                <button onClick={handleDownloadPDF} disabled={isGeneratingPDF}
                  className="w-full bg-slate-800 text-white py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-slate-300 text-sm disabled:opacity-60 disabled:cursor-wait">
                  <Download size={20} /> {isGeneratingPDF ? "Generating PDF…" : "Download Full Strategy Report"}
                </button>
                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                  <p className="text-xs font-bold text-slate-500">Want to fix these gaps in 6 weeks?</p>
                  <button className="text-brand-indigo font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2">
                    Book Your Free Audit Call <ChevronRight size={16} />
                  </button>
                </div>
              </LiquidGlassCard>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <footer className="mt-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        Built by Gill GTM Compensation Consultancy
      </footer>
    </div>
  );
}
