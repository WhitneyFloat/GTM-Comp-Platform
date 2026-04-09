"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Activity } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  section: string;
  text: string;
  options: { label: string; score: number }[];
};

const SECTIONS = [
  { id: "intro", title: "Diagnostic Intro", subtitle: "" },
  { id: "A", title: "SECTION A", subtitle: "Your Team & Stage" },
  { id: "B", title: "SECTION B", subtitle: "Plan Design & Clarity" },
  { id: "C", title: "SECTION C", subtitle: "Operations & Systems" },
  { id: "D", title: "SECTION D", subtitle: "Impact & Outcomes" },
];

const QUESTIONS: Question[] = [
  {
    id: "q1", section: "A", 
    text: "How large is your quota-carrying sales team?",
    options: [
      { label: "1–5 reps", score: 2 },
      { label: "6–15 reps", score: 5 },
      { label: "16–40 reps", score: 5 },
      { label: "41–100 reps", score: 3 },
      { label: "100+ reps", score: 4 },
    ]
  },
  {
    id: "q2", section: "A", 
    text: "What stage best describes your company right now?",
    options: [
      { label: "Pre-revenue / early stage", score: 1 },
      { label: "Seed or Series A (building the sales motion)", score: 5 },
      { label: "Series B or C (scaling aggressively)", score: 5 },
      { label: "Growth stage / post-Series C", score: 3 },
      { label: "Established / public or near-public", score: 2 },
    ]
  },
  {
    id: "q3", section: "A", 
    text: "How long has your current comp plan been in place?",
    options: [
      { label: "We don't have a formal plan — it's ad hoc", score: 5 },
      { label: "Less than 6 months", score: 1 },
      { label: "6 months to 2 years", score: 2 },
      { label: "2–4 years", score: 3 },
      { label: "More than 4 years (largely unchanged)", score: 5 },
    ]
  },
  {
    id: "q4", section: "B", 
    text: "Do your sales reps clearly understand how they're being paid — including how their quota was set?",
    options: [
      { label: "Yes — reps can explain their plan and quota methodology confidently", score: 1 },
      { label: "Mostly — they understand the basics but quota-setting isn't fully transparent", score: 2 },
      { label: "Partially — there's confusion but it hasn't become a major issue yet", score: 3 },
      { label: "No — reps frequently ask how their commission is calculated", score: 4 },
      { label: "No — and quota-setting feels arbitrary to the team", score: 5 },
    ]
  },
  {
    id: "q5", section: "B", 
    text: "How would you describe your current OTE (On-Target Earnings) structure?",
    options: [
      { label: "We have clearly defined OTE by role with documented base/variable splits", score: 1 },
      { label: "We have OTE targets but they vary informally across reps in the same role", score: 3 },
      { label: "We haven't benchmarked our OTE against market rates in over a year", score: 4 },
      { label: "We don't have a formal OTE framework — compensation is negotiated individually", score: 5 },
      { label: "I'm not sure", score: 4 },
    ]
  },
  {
    id: "q6", section: "B", 
    text: "Does your comp plan include performance accelerators — and do they actually motivate above-quota performance?",
    options: [
      { label: "Yes — we have accelerators and reps actively push for them", score: 1 },
      { label: "We have accelerators but reps rarely hit the thresholds to unlock them", score: 5 },
      { label: "We have accelerators but they're not well understood by the team", score: 4 },
      { label: "We don't have accelerators — it's a flat commission rate", score: 4 },
      { label: "I don't know if our plan has accelerators", score: 5 },
    ]
  },
  {
    id: "q7", section: "B", 
    text: "When your company's GTM strategy shifted most recently — did your comp plan update to reflect it?",
    options: [
      { label: "Yes — we updated comp proactively before or during the GTM shift", score: 1 },
      { label: "We updated it eventually but there was a lag of several months", score: 5 },
      { label: "We partially updated it but some misalignments still exist", score: 4 },
      { label: "No — the GTM has changed but the plan hasn't kept up", score: 5 },
      { label: "We haven't had a formal GTM shift yet", score: 2 },
    ]
  },
  {
    id: "q8", section: "C", 
    text: "How are commissions currently calculated and paid?",
    options: [
      { label: "We use a dedicated ICM platform (Xactly, CaptivateIQ, Spiff, etc.) with automated calculations", score: 1 },
      { label: "We use a mix of software and manual spreadsheet reconciliation", score: 3 },
      { label: "Primarily manual — spreadsheets built and managed internally", score: 4 },
      { label: "It varies — there's no consistent process", score: 5 },
      { label: "I'm not fully sure how the back-end works", score: 5 },
    ]
  },
  {
    id: "q9", section: "C", 
    text: "How often do reps dispute or question their commission payments?",
    options: [
      { label: "Rarely or never — disputes are almost nonexistent", score: 1 },
      { label: "Occasionally — a few per quarter that get resolved quickly", score: 2 },
      { label: "Regularly — we have ongoing open disputes that take weeks to resolve", score: 4 },
      { label: "Frequently — commission disputes are a consistent source of team friction", score: 5 },
      { label: "I don't track this formally", score: 4 },
    ]
  },
  {
    id: "q10", section: "C", 
    text: "Do you have documented comp plan materials — plan documents, quota letters, change logs — that reps sign and reference?",
    options: [
      { label: "Yes — fully documented, reps sign annually, changes are logged", score: 1 },
      { label: "Partially — we have documents but they're not consistently updated or distributed", score: 3 },
      { label: "We have informal documentation but nothing formal reps have signed", score: 4 },
      { label: "No formal documentation exists", score: 5 },
      { label: "This is something we know we need to address", score: 4 },
    ]
  },
  {
    id: "q11", section: "D",
    text: "What does your attainment distribution look like across the sales team?",
    options: [
      { label: "Healthy bell curve — roughly 60–70% of reps attaining quota", score: 1 },
      { label: "Top-heavy — a small number of reps are carrying the number", score: 4 },
      { label: "Low across the board — less than 40% of reps are hitting quota", score: 5 },
      { label: "We don't formally track attainment distribution", score: 4 },
      { label: "Our team is too new to have meaningful attainment data yet", score: 2 },
    ]
  },
  {
    id: "q12", section: "D",
    text: "In the last 12 months, have you lost a strong sales rep you wanted to keep — and do you believe compensation was a factor?",
    options: [
      { label: "No — our comp is competitive and retention has been strong", score: 1 },
      { label: "Possibly — we've had departures but compensation wasn't explicitly cited", score: 3 },
      { label: "Yes — at least one strong rep left and comp was mentioned as a factor", score: 4 },
      { label: "Yes — multiple strong reps have left and comp is a known issue", score: 5 },
      { label: "We're too early-stage to have experienced this yet", score: 2 },
    ]
  }
];

export default function DiagnosticEngine() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, { score: number; idx: number }>>({});

  const handleNext = () => {
    if (step < QUESTIONS.length) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > -1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSelectOption = (questionId: string, score: number, idx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { score, idx } }));
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const currentQuestion = QUESTIONS[step];
  const sectionInfo = currentQuestion ? SECTIONS.find(s => s.id === currentQuestion.section) : null;
  const isIntro = step === -1;
  const isResult = step === QUESTIONS.length;

  const totalScore = Object.values(answers).reduce((a, b) => a + b.score, 0);
  const maxScore = QUESTIONS.length * 5;
  const healthPercentage = Math.max(0, 100 - Math.round((totalScore / maxScore) * 100));

  return (
    <div className="w-full h-full flex flex-col pt-12 px-8 overflow-y-auto pb-24">
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
          {!isIntro && !isResult && (
            <div className="text-right">
              <span className="text-brand-indigo font-mono text-xl font-bold">{step + 1}</span>
              <span className="text-slate-400 font-mono text-sm"> / {QUESTIONS.length}</span>
            </div>
          )}
        </header>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {isIntro && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl"
              >
                <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="md">
                  <div className="w-12 h-12 bg-white/50 rounded-xl mb-6 flex items-center justify-center border border-white/60 shadow-sm">
                    <Activity className="text-brand-indigo" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800">Assess Your Compensation Health</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg font-medium">
                    Answer 12 quick questions about how your sales team is currently compensated. 
                    There are no right or wrong answers — just honest ones. You'll receive a 
                    personalized score report identifying your biggest risks and where to focus first. 
                    Takes about 5 minutes.
                  </p>
                  <button 
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/30"
                  >
                    Start Assessment <ArrowRight size={20} />
                  </button>
                </LiquidGlassCard>
              </motion.div>
            )}

            {!isIntro && !isResult && currentQuestion && sectionInfo && (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl"
              >
                <div className="mb-6">
                  <span className="text-brand-indigo text-xs font-bold tracking-widest uppercase mb-1 block">
                    {sectionInfo.title}
                  </span>
                  <h3 className="text-xl text-slate-700 font-semibold">{sectionInfo.subtitle}</h3>
                </div>

                <LiquidGlassCard className="p-8 mb-8" blurIntensity="xl" shadowIntensity="md">
                  <h2 className="text-2xl font-bold mb-8 text-slate-800 leading-tight">
                    {currentQuestion.text}
                  </h2>
                  
                  <div className="flex flex-col gap-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = answers[currentQuestion.id]?.idx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(currentQuestion.id, option.score, idx)}
                          className={cn(
                            "text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                            isSelected 
                              ? "border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-md ring-2 ring-indigo-500/20" 
                              : "border-slate-200 bg-white/40 hover:border-indigo-300 hover:bg-white/60 text-slate-600"
                          )}
                        >
                          <span className={cn("text-sm md:text-base pr-4 font-semibold transition-colors", isSelected ? "text-indigo-800" : "text-slate-600 group-hover:text-indigo-700")}>
                            {option.label}
                          </span>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all shadow-inner",
                            isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white group-hover:border-indigo-400"
                          )}>
                            {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </LiquidGlassCard>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={handlePrev}
                    className="text-slate-500 hover:text-brand-indigo flex items-center gap-2 text-sm font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-white/20"
                  >
                    <ArrowLeft size={16} /> Previous Question
                  </button>
                  
                  <button 
                    onClick={handleNext}
                    className="text-slate-500 hover:text-brand-indigo flex items-center gap-2 text-sm font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-white/20"
                  >
                    Next Question <ArrowRight size={16} /> 
                  </button>
                </div>
              </motion.div>
            )}

            {isResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl"
              >
                <LiquidGlassCard className="p-10 relative overflow-hidden" shadowIntensity="lg" blurIntensity="xl">
                  {/* Subtle decorative accent in card */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/20 blur-[80px] -z-10 rounded-full mix-blend-multiply" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10 relative">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Comp Plan Health Score</h2>
                      <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                        Based on your responses, we've analyzed your compensation structure across five dimensions: 
                        Alignment, Simplicity, Motivation, Economics, and Administration.
                      </p>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="text-brand-indigo mt-1 flex-shrink-0" size={20} />
                          <p className="text-sm font-semibold text-slate-700">High retention risk identified in OTE framework</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="text-brand-indigo mt-1 flex-shrink-0" size={20} />
                          <p className="text-sm font-semibold text-slate-700">GTM alignment gap detected (+6 month lag)</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="text-brand-indigo mt-1 flex-shrink-0" size={20} />
                          <p className="text-sm font-semibold text-slate-700">Operational fragility in commission calculation</p>
                        </div>
                      </div>

                      <button className="bg-indigo-900 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-indigo-800 transition-colors shadow-md">
                        Download Full Report PDF
                      </button>
                      <button 
                        onClick={() => setStep(-1)}
                        className="mt-4 text-brand-indigo text-sm font-semibold hover:underline"
                      >
                        Retake Assessment
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-64 h-64 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="8" />
                          <motion.circle 
                            cx="50" cy="50" r="45" fill="none" 
                            stroke="currentColor" 
                            className={healthPercentage > 60 ? "text-brand-indigo" : healthPercentage > 40 ? "text-yellow-600" : "text-red-500"} 
                            strokeWidth="8"
                            strokeDasharray="283"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * healthPercentage) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-6xl font-black text-indigo-950">{healthPercentage}</span>
                          <span className="text-xs font-bold tracking-widest text-indigo-800 uppercase mt-1">Health Score</span>
                        </div>
                      </div>
                      <p className="text-center mt-6 text-slate-700 text-sm font-medium max-w-xs">
                        A score below 70 indicates substantial retention and operational risks. 
                      </p>
                    </div>
                  </div>
                </LiquidGlassCard>
                <div className="mt-8 text-center">
                   <p className="text-sm text-slate-500 font-semibold">
                     Built by <span className="text-brand-indigo">Gill GTM Compensation Consultancy</span>
                   </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
