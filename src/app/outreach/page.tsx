"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Linkedin, 
  Mail, 
  UserPlus, 
  Zap, 
  Globe, 
  Settings, 
  ChevronRight,
  ExternalLink,
  Loader2,
  Sparkles,
  Building2
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";
import leadsData from "@/data/leads.json";

const MOCK_RESULTS = leadsData.slice(0, 20); // Using real data from the sheet

export default function OutreachEngine() {
  const [isScraping, setIsScraping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("leads");

  const handleStartScrape = () => {
    if (!searchQuery) return;
    setIsScraping(true);
    setTimeout(() => setIsScraping(false), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col pt-12 px-8 overflow-y-auto pb-24">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 border-b border-brand-indigo/20 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
              <Mail className="text-brand-indigo" size={32} />
              Outreach Intelligence Engine
            </h1>
            <p className="text-slate-500 mt-2 text-sm tracking-wide">
              Data enrichment, LinkedIn scraping, and AI-powered outreach synthesis.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-2.5 rounded-xl border border-white/40 bg-white/30 text-slate-600 hover:bg-white/50 transition-all">
              <Settings size={20} />
            </button>
            <button className="bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20">
              <Sparkles size={18} /> Export Data
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Search Control Side */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <LiquidGlassCard className="p-8" shadowIntensity="md">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Globe size={18} className="text-brand-indigo" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Search Command Center</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                    Target Domain or LinkedIn URL
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="e.g. cloudstrike.com or linkedin.com/company/..."
                      className="w-full bg-white/50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-800 outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-xl border border-slate-200/60 bg-white/20 flex flex-col items-center gap-2 hover:bg-white/40 transition-all group">
                    <Linkedin size={24} className="text-slate-400 group-hover:text-[#0a66c2] transition-colors" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">LinkedIn Scrape</span>
                  </button>
                  <button className="p-4 rounded-xl border border-slate-200/60 bg-white/20 flex flex-col items-center gap-2 hover:bg-white/40 transition-all group">
                    <Globe size={24} className="text-slate-400 group-hover:text-brand-indigo transition-colors" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Domain Search</span>
                  </button>
                </div>

                <button 
                  onClick={handleStartScrape}
                  disabled={isScraping || !searchQuery}
                  className={cn(
                    "w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all transform active:scale-95",
                    isScraping 
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700"
                  )}
                >
                  {isScraping ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> INITIALIZING SCAPE...
                    </>
                  ) : (
                    <>
                      <Zap size={20} fill="currentColor" /> START INTELLIGENCE SCAN
                    </>
                  )}
                </button>
              </div>
            </LiquidGlassCard>

            <LiquidGlassCard className="p-6 bg-indigo-900/5" shadowIntensity="sm">
              <h3 className="text-xs font-bold text-indigo-900/40 uppercase tracking-widest mb-4">Live Activity Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-800 font-semibold">Active Scrapes</span>
                  <span className="bg-indigo-100 text-brand-indigo px-2 py-0.5 rounded-full font-bold">12</span>
                </div>
                <div className="w-full bg-indigo-100/50 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-brand-indigo" 
                    animate={{ width: isScraping ? "60%" : "30%" }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </LiquidGlassCard>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-7">
            <LiquidGlassCard className="h-full flex flex-col" shadowIntensity="md">
              <div className="p-6 border-b border-white/20 flex items-center justify-between">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab("leads")}
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest pb-1 transition-all border-b-2",
                      activeTab === "leads" ? "text-brand-indigo border-brand-indigo" : "text-slate-400 border-transparent hover:text-slate-600"
                    )}
                  >
                    Identified Leads
                  </button>
                  <button 
                    onClick={() => setActiveTab("scripts")}
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest pb-1 transition-all border-b-2",
                      activeTab === "scripts" ? "text-brand-indigo border-brand-indigo" : "text-slate-400 border-transparent hover:text-slate-600"
                    )}
                  >
                    AI Sequences
                  </button>
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  Updated: 1 min ago
                </div>
              </div>

              <div className="flex-1 p-0">
                {activeTab === "leads" ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Name</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Funding Stage</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Headcount</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">AI Fit</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MOCK_RESULTS.map((lead: any) => (
                          <tr key={lead.id} className="hover:bg-indigo-50/30 transition-colors group">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-brand-indigo">
                                  <Building2 size={16} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-800">{lead.name}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-xs font-semibold text-slate-600 px-2 py-1 bg-white border border-slate-100 rounded-md shadow-sm">{lead.stage}</span>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-xs font-medium text-slate-500">{lead.headcount}</span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-[10px] font-black tracking-tighter">
                                {lead.fit}%
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                <a 
                                  href={`https://${lead.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-white border border-slate-200 text-slate-400 hover:text-brand-indigo hover:border-brand-indigo transition-all"
                                >
                                  <Linkedin size={14} />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 border border-indigo-100">
                      <Sparkles className="text-brand-indigo" size={32} />
                    </div>
                    <h3 className="text-slate-800 font-bold mb-2">Generate Your First Sequence</h3>
                    <p className="text-sm text-slate-500 max-w-sm">
                      Select a lead from the table to generate a metric-backed personalized outreach draft.
                    </p>
                  </div>
                )}
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
