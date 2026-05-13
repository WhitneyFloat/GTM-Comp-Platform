"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, ShieldCheck, Sparkles, Lock, Download } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";
import { QUESTIONS, SECTIONS, DIMENSIONS } from "@/lib/diagnosticData";
import type { Answer } from "@/lib/generateReport";

export default function DiagnosticEngine() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [leadInfo, setLeadInfo] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleNext = () => {
    if (step < QUESTIONS.length) setStep((p) => p + 1);
  };

  const handlePrev = () => {
    if (step > -1) setStep((p) => p - 1);
  };

  const handleSelectOption = (questionId: string, score: number, idx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { score, idx } }));
    setTimeout(handleNext, 400);
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
      setStep((p) => p + 1);
    } catch {
      setSubmitError("Network error — please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const { generateReport } = await import("@/lib/generateReport");
    await generateReport({ name: leadInfo.name, answers, questions: QUESTIONS });
  };

  const currentQuestion = QUESTIONS[step];
  const sectionInfo = currentQuestion ? SECTIONS.find((s) => s.id === currentQuestion.section) : null;
  const isIntro = step === -1;
  const isLeadCapture = step === QUESTIONS.length;
  const isResult = step === QUESTIONS.length + 1;

  const totalScore = Object.values(answers).reduce((a, b) => a + b.score, 0);
  const healthPercentage = Math.max(0, 100 - Math.round((totalScore / (QUESTIONS.length * 5)) * 100));

  const calcDim = (ids: string[]) => {
    const valid = ids.filter((id) => answers[id]);
    if (!valid.length) return 50;
    return Math.max(0, 100 - Math.round((valid.reduce((s, id) => s + answers[id].score, 0) / (valid.length * 5)) * 100));
  };

  const dimColor = (s: number) => (s >= 70 ? "text-emerald-600" : s >= 40 ? "text-amber-500" : "text-red-500");

  return (
    <div className="w-full flex flex-col pt-8 px-4 md:pt-12 md:px-8 pb-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 border-b border-brand-blue/20 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
              <Activity className="text-brand-indigo" size={32} />
              Comp Plan Diagnostic Engine
            </h1>
            <p className="text-slate-500 mt-2 text-sm tracking-wide">
              Evaluate risk dimensions and generate compensation health scores.
            </p>
          </div>
          {!isIntro && !isLeadCapture && !isResult && (
            <div className="text-right">
              <span className="text-brand-indigo font-mono text-xl font-bold">{step + 1}</span>
              <span className="text-slate-400 font-mono text-sm"> / {QUESTIONS.length}</span>
            </div>
          )}
        </header>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">

            {isIntro && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="max-w-2xl">
                <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="md">
                  <div className="w-12 h-12 bg-white/50 rounded-xl mb-6 flex items-center justify-center border border-white/60 shadow-sm">
                    <Activity className="text-brand-indigo" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">Assess Your Compensation Health</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg font-medium">
                    Answer 12 quick questions about how your sales team is currently compensated.
                    You'll receive a personalized score report identifying your biggest risks and where to focus first.
                    Takes about 5 minutes.
                  </p>
                  <button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/30">
                    Start Assessment <ArrowRight size={20} />
                  </button>
                </LiquidGlassCard>
              </motion.div>
            )}

            {!isIntro && !isLeadCapture && !isResult && currentQuestion && sectionInfo && (
              <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="max-w-2xl">
                <div className="mb-6">
                  <span className="text-brand-indigo text-xs font-bold tracking-widest uppercase mb-1 block">{sectionInfo.title}</span>
                  <h3 className="text-xl text-slate-700 font-semibold">{sectionInfo.subtitle}</h3>
                </div>
                <LiquidGlassCard className="p-8 mb-8" blurIntensity="xl" shadowIntensity="md">
                  <h2 className="text-2xl font-bold mb-8 text-slate-800 leading-tight">{currentQuestion.text}</h2>
                  <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = answers[currentQuestion.id]?.idx === idx;
                      return (
                        <button key={idx} onClick={() => handleSelectOption(currentQuestion.id, option.score, idx)}
                          className={cn(
                            "text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                            isSelected ? "border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-md ring-2 ring-indigo-500/20" : "border-slate-200 bg-white/40 hover:border-indigo-300 hover:bg-white/60 text-slate-600"
                          )}>
                          <span className={cn("text-sm md:text-base pr-4 font-semibold transition-colors", isSelected ? "text-indigo-800" : "text-slate-600 group-hover:text-indigo-700")}>{option.label}</span>
                          <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all shadow-inner", isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white group-hover:border-indigo-400")}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </LiquidGlassCard>
                <div className="flex items-center justify-between">
                  <button onClick={handlePrev} className="text-slate-500 hover:text-brand-indigo flex items-center gap-2 text-sm font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-white/20">
                    <ArrowLeft size={16} /> Previous Question
                  </button>
                  <button onClick={handleNext} className="text-slate-500 hover:text-brand-indigo flex items-center gap-2 text-sm font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-white/20">
                    Next Question <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {isLeadCapture && (
              <motion.div key="capture" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                    <ShieldCheck className="text-emerald-500" size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-3">Assessment complete.</h2>
                  <p className="text-slate-500 leading-relaxed">
                    Enter your details to unlock your <span className="text-brand-indigo font-bold">Comp Health Score</span> and personalized 6-page PDF report.
                  </p>
                </div>
                <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="lg">
                  <form onSubmit={handleLeadSubmit} className="space-y-5">
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
                      className="w-full py-5 mt-2 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40 active:scale-[0.98] transition-all text-sm disabled:opacity-70">
                      {isSubmitting ? "Saving..." : <><span>Unlock My Results</span><Sparkles size={20} /></>}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                      <Lock size={12} /> Confidential — Gill GTM Partners
                    </p>
                  </form>
                </LiquidGlassCard>
              </motion.div>
            )}

            {isResult && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="max-w-4xl">
                <LiquidGlassCard className="p-10 relative overflow-hidden" shadowIntensity="lg" blurIntensity="xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/20 blur-[80px] -z-10 rounded-full mix-blend-multiply" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10 relative">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Comp Plan Health Score</h2>
                      <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                        Based on your responses, we've analyzed your compensation structure across four dimensions: Alignment, Motivation, Operational, and Economic.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {DIMENSIONS.map(({ label, ids }) => {
                          const ds = calcDim(ids);
                          return (
                            <div key={label} className="p-3 bg-white/30 rounded-xl border border-white/40">
                              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
                              <span className={`text-lg font-black ${dimColor(ds)}`}>{ds}%</span>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={handleDownloadPDF}
                        className="bg-indigo-900 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-indigo-800 transition-colors shadow-md">
                        <Download size={18} /> Download Full Report PDF
                      </button>
                      <button onClick={() => setStep(-1)} className="mt-4 text-brand-indigo text-sm font-semibold hover:underline block">
                        Retake Assessment
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-64 h-64 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="8" />
                          <motion.circle cx="50" cy="50" r="45" fill="none"
                            stroke="currentColor"
                            className={healthPercentage > 60 ? "text-brand-indigo" : healthPercentage > 40 ? "text-yellow-600" : "text-red-500"}
                            strokeWidth="8" strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * healthPercentage) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-6xl font-black text-indigo-950">{healthPercentage}</span>
                          <span className="text-xs font-bold tracking-widest text-indigo-800 uppercase mt-1">Health Score</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </LiquidGlassCard>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
