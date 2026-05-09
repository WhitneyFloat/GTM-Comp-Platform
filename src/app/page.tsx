"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, ShieldCheck, Sparkles, Lock } from "lucide-react";
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
  const [leadInfo, setLeadInfo] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: leadInfo.name, email: leadInfo.email, stage: "1" }),
      });
    } catch (err) {
      console.error("Lead submission failed", err);
    } finally {
      setIsSubmitting(false);
      setStep(prev => prev + 1);
    }
  };

  const currentQuestion = QUESTIONS[step];
  const sectionInfo = currentQuestion ? SECTIONS.find(s => s.id === currentQuestion.section) : null;
  const isIntro = step === -1;
  const isLeadCapture = step === QUESTIONS.length;
  const isResult = step === QUESTIONS.length + 1;

  const totalScore = Object.values(answers).reduce((a, b) => a + b.score, 0);
  const maxScore = QUESTIONS.length * 5;
  const healthPercentage = Math.max(0, 100 - Math.round((totalScore / maxScore) * 100));

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const score = healthPercentage;
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const PW = 210, M = 20, CW = 170;
    const toRad = (d: number) => d * Math.PI / 180;

    const calcDim = (ids: string[]) => {
      const valid = ids.filter(id => answers[id]);
      if (!valid.length) return 50;
      return Math.max(0, 100 - Math.round(valid.reduce((s, id) => s + answers[id].score, 0) / (valid.length * 5) * 100));
    };
    const dims = [
      { label: "Alignment",   sub: "GTM & comp plan alignment",         score: calcDim(["q4","q7"]) },
      { label: "Motivation",  sub: "OTE, accelerators & attainment",    score: calcDim(["q5","q6","q11"]) },
      { label: "Operational", sub: "Commission ops & documentation",     score: calcDim(["q8","q9","q10"]) },
      { label: "Economic",    sub: "Stage, plan health & retention",     score: calcDim(["q1","q2","q3","q12"]) },
    ];

    const recs = [
      { q:"q4",  area:"Compensation Clarity",  finding:"Reps cannot clearly explain how they are paid or how quotas are set.",               action:"Build a one-page comp summary per role and run a structured walkthrough each plan year. Unclear comp directly drives rep disengagement." },
      { q:"q5",  area:"OTE Framework",         finding:"OTE targets are inconsistent or have not been benchmarked against market rates.",     action:"Conduct a market benchmarking exercise and standardize OTE bands by role. Misaligned OTE is the leading driver of quiet quitting in sales." },
      { q:"q6",  area:"Accelerator Design",    finding:"Accelerators are not driving above-quota performance.",                               action:"Audit accelerator thresholds — they are likely set too high or the incremental payout is not compelling enough to change rep behavior." },
      { q:"q7",  area:"GTM Alignment",         finding:"Your comp plan has not kept pace with recent go-to-market strategy changes.",         action:"Schedule an immediate plan audit. Every month of misalignment means paying reps to execute the wrong priorities." },
      { q:"q8",  area:"Commission Operations", finding:"Commission calculations are manual or inconsistently managed.",                       action:"Evaluate ICM platforms (CaptivateIQ, Spiff, Xactly). Manual calculation creates errors, disputes, and erodes rep trust over time." },
      { q:"q9",  area:"Dispute Resolution",    finding:"Commission disputes are frequent and slow to resolve.",                               action:"Establish a formal dispute window and resolution SLA. Recurring disputes signal deeper structural problems in the plan design." },
      { q:"q10", area:"Documentation",         finding:"Comp plan documentation is incomplete or reps have not signed off.",                 action:"Issue signed comp plan letters annually. Documentation removes rep ambiguity and provides legal protection for the company." },
      { q:"q11", area:"Quota Calibration",     finding:"Attainment distribution indicates a quota design problem.",                          action:"Run a rep-level attainment analysis. Below 50% attainment almost always reflects a quota-setting failure, not a talent problem." },
      { q:"q12", area:"Retention Risk",        finding:"Compensation has been cited as a contributing factor in rep departures.",            action:"Benchmark OTE immediately against top-quartile competitors. Losing multiple strong reps to comp is a structural, not a personnel, problem." },
    ].filter(r => (answers[r.q]?.score || 0) >= 4).slice(0, 5);

    if (recs.length === 0) recs.push({ q:"", area:"Ongoing Optimization", finding:"Your comp infrastructure is performing well relative to growth-stage peers.", action:"Schedule a semi-annual comp review to maintain alignment as your GTM strategy evolves. Strong plans still require proactive maintenance." });

    const riskLabel = score >= 70 ? "LOW RISK" : score >= 40 ? "MODERATE RISK" : "HIGH RISK";
    const rC = score >= 70 ? [16,185,129] : score >= 40 ? [245,158,11] : [239,68,68];
    const dimC = (s: number): [number,number,number] => s >= 70 ? [16,185,129] : s >= 40 ? [245,158,11] : [239,68,68];

    const drawLogo = (yPos: number, large: boolean) => {
      const gSz = large ? 22 : 14, pSz = large ? 13 : 9, gap = large ? 8 : 6, lh = large ? 9 : 6;
      doc.setFont("times","bold"); doc.setFontSize(gSz); doc.setTextColor(30,27,75);
      const gW = doc.getTextWidth("GILL");
      doc.setFont("helvetica","normal"); doc.setFontSize(pSz);
      const pW = doc.getTextWidth("GTM PARTNERS");
      const lx = (PW - gW - gap - pW) / 2;
      doc.setFont("times","bold"); doc.setFontSize(gSz);
      doc.text("GILL", lx, yPos);
      doc.setDrawColor(30,27,75); doc.setLineWidth(0.5);
      doc.line(lx + gW + gap/2, yPos - lh + 2, lx + gW + gap/2, yPos + 1.5);
      doc.setFont("helvetica","normal"); doc.setFontSize(pSz); doc.setTextColor(30,27,75);
      doc.text("GTM PARTNERS", lx + gW + gap, yPos);
    };

    // PAGE 1
    drawLogo(22, true);
    doc.setDrawColor(99,102,241); doc.setLineWidth(0.5); doc.line(M, 29, PW-M, 29);

    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(107,114,128);
    doc.text("SALES COMPENSATION HEALTH REPORT", PW/2, 38, { align:"center" });

    doc.setFont("helvetica","normal"); doc.setFontSize(8.5);
    doc.setTextColor(107,114,128);
    doc.text(`Date: ${date}`, PW-M, 46, { align:"right" });
    doc.text(`Prepared for: ${leadInfo.name || "Assessment Recipient"}`, M, 46);

    doc.setDrawColor(229,231,235); doc.setLineWidth(0.3); doc.line(M, 51, PW-M, 51);

    // Score gauge
    const gx = PW/2, gy = 86, gr = 23;
    const arcStart = 135, arcSweep = 270, arcSteps = 80;

    doc.setDrawColor(220,220,220); doc.setLineWidth(5.5);
    for (let i = 0; i < arcSteps; i++) {
      const a1 = toRad(arcStart + arcSweep * i / arcSteps);
      const a2 = toRad(arcStart + arcSweep * (i+1) / arcSteps);
      doc.line(gx + gr*Math.cos(a1), gy + gr*Math.sin(a1), gx + gr*Math.cos(a2), gy + gr*Math.sin(a2));
    }
    const filledSteps = Math.max(1, Math.round(arcSteps * score / 100));
    const filledSweep = arcSweep * score / 100;
    doc.setDrawColor(rC[0], rC[1], rC[2]); doc.setLineWidth(5.5);
    for (let i = 0; i < filledSteps; i++) {
      const a1 = toRad(arcStart + filledSweep * i / filledSteps);
      const a2 = toRad(arcStart + filledSweep * (i+1) / filledSteps);
      doc.line(gx + gr*Math.cos(a1), gy + gr*Math.sin(a1), gx + gr*Math.cos(a2), gy + gr*Math.sin(a2));
    }
    doc.setFont("helvetica","bold"); doc.setFontSize(30); doc.setTextColor(30,27,75);
    doc.text(`${score}`, gx, gy + 5, { align:"center" });
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(107,114,128);
    doc.text("HEALTH SCORE", gx, gy + 11.5, { align:"center" });

    const bW = 48, bH = 7.5, bx = gx - bW/2, by = gy + 17;
    doc.setFillColor(rC[0], rC[1], rC[2]);
    doc.roundedRect(bx, by, bW, bH, 2, 2, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,255,255);
    doc.text(riskLabel, gx, by + 5, { align:"center" });

    // Dimension bars
    let y = gy + 34;
    doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(30,27,75);
    doc.text("DIMENSION BREAKDOWN", M, y);
    y += 7;

    dims.forEach(({ label, sub, score: ds }) => {
      const dc = dimC(ds);
      doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(30,27,75);
      doc.text(label, M, y);
      doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(107,114,128);
      doc.text(sub, M, y + 4.5);
      const bx2 = M+54, bw2 = 93, bh2 = 3.5;
      doc.setFillColor(229,231,235); doc.roundedRect(bx2, y-2, bw2, bh2, 1, 1, "F");
      doc.setFillColor(dc[0], dc[1], dc[2]); doc.roundedRect(bx2, y-2, Math.max(2, bw2*ds/100), bh2, 1, 1, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(30,27,75);
      doc.text(`${ds}%`, PW-M, y, { align:"right" });
      y += 13;
    });

    y += 2;
    doc.setDrawColor(229,231,235); doc.setLineWidth(0.3); doc.line(M, y, PW-M, y);
    y += 7;
    doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(107,114,128);
    const ctxLines = doc.splitTextToSize("A score below 70 indicates material risk across one or more compensation dimensions. The recommendations on the following page identify the highest-priority action items based on assessment responses.", CW);
    doc.text(ctxLines, M, y);

    // PAGE 2
    doc.addPage();
    drawLogo(22, false);
    doc.setDrawColor(99,102,241); doc.setLineWidth(0.5); doc.line(M, 29, PW-M, 29);

    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(107,114,128);
    doc.text("PRIORITY RECOMMENDATIONS", PW/2, 38, { align:"center" });

    y = 45;
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(107,114,128);
    const intro = `Based on your responses, ${leadInfo.name || "the assessment respondent"}, the following areas represent your highest-priority action items. These findings reflect patterns identified across hundreds of growth-stage sales organizations.`;
    const introLines = doc.splitTextToSize(intro, CW);
    doc.text(introLines, M, y);
    y += introLines.length * 5 + 6;

    recs.forEach(({ area, finding, action }, i) => {
      if (y > 248) { doc.addPage(); y = 25; }

      doc.setFillColor(99,102,241);
      doc.circle(M + 3.5, y + 1.5, 3.5, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,255,255);
      doc.text(`${i + 1}`, M + 3.5, y + 3, { align:"center" });

      doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(30,27,75);
      doc.text(area, M + 10, y + 3);
      y += 9;

      doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(107,114,128);
      const fl = doc.splitTextToSize(`Finding: ${finding}`, CW - 10);
      doc.text(fl, M + 8, y);
      y += fl.length * 4.5 + 2;

      doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(30,27,75);
      const al = doc.splitTextToSize(`Recommended Action: ${action}`, CW - 10);
      doc.text(al, M + 8, y);
      y += al.length * 4.5 + 7;

      if (i < recs.length - 1) {
        doc.setDrawColor(229,231,235); doc.setLineWidth(0.2); doc.line(M, y - 2, PW-M, y - 2);
      }
    });

    const ftY = 264;
    doc.setDrawColor(99,102,241); doc.setLineWidth(0.4); doc.line(M, ftY, PW-M, ftY);
    doc.setFillColor(224,231,255); doc.roundedRect(M, ftY+4, CW, 20, 3, 3, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(30,27,75);
    doc.text("Ready to close these gaps in 6–8 weeks?", PW/2, ftY+11, { align:"center" });
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(99,102,241);
    doc.text("contact@gillgtmpartners.com  ·  gillgtmpartners.com", PW/2, ftY+17.5, { align:"center" });
    doc.setFont("helvetica","normal"); doc.setFontSize(6.5); doc.setTextColor(156,163,175);
    doc.text("© Gill GTM Partners  ·  Confidential — Internal Assessment Report", PW/2, ftY+25, { align:"center" });

    doc.save("GTM-Comp-Health-Report.pdf");
  };

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

            {isLeadCapture && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-lg mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                    <ShieldCheck className="text-emerald-500" size={40} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-3">Assessment complete.</h2>
                  <p className="text-slate-500 leading-relaxed">
                    Enter your details to unlock your <span className="text-brand-indigo font-bold">Comp Health Score</span> and personalized PDF report.
                  </p>
                </div>

                <LiquidGlassCard className="p-10" blurIntensity="xl" shadowIntensity="lg">
                  <form onSubmit={handleLeadSubmit} className="space-y-5">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. David Chen"
                        className="w-full bg-white/50 border border-white/60 rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-brand-indigo/30 transition-all font-bold text-slate-800"
                        value={leadInfo.name}
                        onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
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
                        onChange={(e) => setLeadInfo({ ...leadInfo, email: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 mt-2 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40 active:scale-[0.98] transition-all text-sm disabled:opacity-70"
                    >
                      {isSubmitting ? "Saving..." : <><span>Unlock My Results</span> <Sparkles size={20} /></>}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                      <Lock size={12} /> Confidential — Gill GTM Partners
                    </p>
                  </form>
                </LiquidGlassCard>
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

                      <button
                        onClick={handleDownloadPDF}
                        className="bg-indigo-900 text-white font-semibold py-3 px-8 rounded-xl flex items-center gap-2 hover:bg-indigo-800 transition-colors shadow-md"
                      >
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
