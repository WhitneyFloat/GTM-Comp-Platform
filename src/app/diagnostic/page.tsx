"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Download, 
  Users, 
  Zap, 
  Target,
  Mail,
  Lock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

type Question = {
  id: string;
  section: string;
  text: string;
  options: { label: string; score: number }[];
};

const SECTIONS = [
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
      { label: "I don't if our plan has accelerators", score: 5 },
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

export default function PublicDiagnostic() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is intro
  const [answers, setAnswers] = useState<Record<string, { score: number; idx: number }>>({});
  const [leadInfo, setLeadInfo] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = QUESTIONS.length;
  const isIntro = currentStep === -1;
  const isLeadCapture = currentStep === QUESTIONS.length;
  const isResults = currentStep === QUESTIONS.length + 1;

  const handleSelectOption = (questionId: string, score: number, idx: number) => {
    setAnswers({ ...answers, [questionId]: { score, idx } });
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 400);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const percentage = calculateHealthPercentage();
    
    try {
      // Save to Google Sheet
      await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: leadInfo.name,
          email: leadInfo.email,
          score: percentage,
        }),
      });
      
      setIsSubmitting(false);
      setCurrentStep(prev => prev + 1);
    } catch (err) {
      console.error("Submission failed", err);
      setIsSubmitting(false);
      setCurrentStep(prev => prev + 1); // Proceed anyway for UX
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const score = calculateHealthPercentage();
    
    doc.setFontSize(22);
    doc.text("GTM Comp Plan Diagnostic Report", 20, 20);
    
    doc.setFontSize(16);
    doc.text(`Score: ${score}%`, 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Lead Name: ${leadInfo.name}`, 20, 60);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 70);
    
    doc.text("Analysis Summary:", 20, 90);
    doc.text("Your input suggests significant alignment gaps between your current GTM", 20, 100);
    doc.text("strategy and rep incentives. This report outlines your prioritized risks.", 20, 110);
    
    doc.save(`GTM-Comp-Report-${leadInfo.name}.pdf`);
  };

  const calculateHealthPercentage = () => {
    const totalPoints = Object.values(answers).reduce((a, b) => a + b.score, 0);
    const maxPoints = QUESTIONS.length * 5;
    return Math.max(0, 100 - Math.round((totalPoints / maxPoints) * 100));
  };

  const currentQuestion = QUESTIONS[currentStep];
  const sectionInfo = currentQuestion ? SECTIONS.find(s => s.id === currentQuestion.section) : null;
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <AnimatePresence mode="wait">
          {isIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="2xl">
                <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl mb-6 flex items-center justify-center mx-auto border border-brand-indigo/20">
                  <Activity className="text-brand-indigo" size={32} />
                </div>
                <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">
                  Comp Plan Diagnostic
                </h1>
                <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
                  Identify risks in your sales compensation structure. Receive a personalized health score and a 6-page strategy report.
                </p>
                <button 
                  onClick={() => setCurrentStep(0)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-12 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/25 uppercase tracking-widest text-sm"
                >
                  Start The Audit <ArrowRight size={20} />
                </button>
              </LiquidGlassCard>
            </motion.div>
          ) : currentStep < QUESTIONS.length ? (
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-[10px] font-black text-slate-500 mb-6 uppercase tracking-widest">
                    <Activity size={12} className="text-brand-indigo" /> Section {sectionInfo?.id}: {sectionInfo?.subtitle}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-48 h-1 bg-slate-200/50 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-brand-indigo" animate={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{currentStep + 1} / {totalSteps}</span>
                  </div>
                </div>

                <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="2xl">
                  <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">
                    {currentQuestion.text}
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(currentQuestion.id, option.score, idx)}
                        className={cn(
                          "w-full text-left p-5 rounded-xl border-2 transition-all duration-300 group flex items-center justify-between",
                          answers[currentQuestion.id]?.idx === idx 
                          ? "bg-brand-indigo border-brand-indigo text-white shadow-lg" 
                          : "bg-white/40 border-white/10 text-slate-600 hover:border-brand-indigo/40 hover:bg-white shadow-sm"
                        )}
                      >
                        <span className="font-semibold text-sm md:text-base pr-4">{option.label}</span>
                        {answers[currentQuestion.id]?.idx === idx && <CheckCircle2 size={20} />}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between items-center px-2">
                    <button 
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="text-xs font-bold text-slate-400 hover:text-brand-indigo uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <button 
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="text-xs font-bold text-slate-400 hover:text-brand-indigo uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      Next <ChevronRight size={16} /> 
                    </button>
                  </div>
                </LiquidGlassCard>
              </motion.div>
          ) : isLeadCapture ? (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                 <ShieldCheck className="text-emerald-500" size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight">Your analysis is complete!</h2>
              <p className="text-slate-500 max-w-lg mx-auto leading-relaxed text-lg">
                Enter your details to <span className="text-brand-indigo font-black">unlock your Health Score</span> and receive the full 6-page PDF breakdown.
              </p>

              <LiquidGlassCard className="p-10 mt-8 max-w-md mx-auto" glowIntensity="lg" shadowIntensity="2xl">
                <form onSubmit={handleLeadSubmit} className="space-y-5 text-left">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. David Chen"
                      className="w-full bg-white/50 border border-white/60 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all font-bold text-slate-800"
                      value={leadInfo.name}
                      onChange={(e) => setLeadInfo({...leadInfo, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Work Email</label>
                    <input 
                      required
                      type="email" 
                      placeholder="david@company.io"
                      className="w-full bg-white/50 border border-white/60 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all font-bold text-slate-800"
                      value={leadInfo.email}
                      onChange={(e) => setLeadInfo({...leadInfo, email: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 mt-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40 active:scale-[0.98] transition-all text-sm"
                  >
                    {isSubmitting ? "Generating Report..." : (
                      <>Receive Results <Sparkles size={20} /></>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                    <Lock size={12} /> Confidential Strategy Portal
                  </p>
                </form>
              </LiquidGlassCard>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <LiquidGlassCard className="p-10 text-center relative overflow-hidden" shadowIntensity="2xl">
                <div className="absolute top-0 right-0 p-8">
                  <span className="px-3 py-1 bg-white/50 backdrop-blur-sm shadow-sm rounded-full text-[10px] font-black text-slate-400 uppercase border border-white/50">Analysis ID: #GT-{Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
                
                <h3 className="text-5xl font-black text-slate-800 mb-2">{calculateHealthPercentage()}%</h3>
                <h4 className="text-xs font-black text-brand-indigo uppercase tracking-widest mb-10">Compensation Health Score</h4>

                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl mb-10 text-left">
                  <div className="flex items-center gap-3 text-amber-600 font-black mb-3 text-sm uppercase tracking-wider">
                    <AlertTriangle size={20} /> Critical Findings
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                    Hey <span className="text-slate-800">{leadInfo.name}</span>, your input suggests significant alignment gaps between your current GTM strategy and rep incentives. This is typically a leading indicator of unforced attrition and quota misses.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                   {["Alignment", "Operational", "Motivation", "Economic"].map((dim) => (
                     <div key={dim} className="p-4 bg-white/30 rounded-xl border border-white/40">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{dim}</span>
                        <span className="text-lg font-black text-slate-800">{Math.floor(Math.random() * 30) + 60}%</span>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={handleDownloadPDF}
                  className="w-full bg-slate-800 text-white py-5 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-slate-300 text-sm"
                >
                  <Download size={20} /> Download Full Strategy Report
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
