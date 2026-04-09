"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Activity, 
  Users, 
  Zap, 
  TrendingUp, 
  PieChart, 
  Clock, 
  ArrowUpRight,
  Target,
  FileText,
  UserPlus
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import leadsData from "@/data/leads.json";

export default function OverviewPage() {
  const totalLeads = leadsData.length;
  const highFitLeads = leadsData.filter(l => l.fit > 90).length;
  
  const stats = [
    { label: "Active Pipeline", value: totalLeads, icon: Users, trend: "+12%", color: "text-indigo-600" },
    { label: "High-Fit Targets", value: highFitLeads, icon: Target, trend: "92% Acc", color: "text-emerald-600" },
    { label: "Diagnostics Run", value: "128", icon: FileText, trend: "+24", color: "text-amber-600" },
    { label: "Avg. Health Score", value: "64", icon: Activity, trend: "-5pts", color: "text-rose-600" },
  ];

  const recentLeads = leadsData.slice(0, 5);

  return (
    <div className="w-full h-full flex flex-col pt-12 px-8 overflow-y-auto pb-24">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <header className="mb-12 border-b border-brand-indigo/10 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 flex items-center gap-3">
            <BarChart3 className="text-brand-indigo" size={32} />
            Command Overview
          </h1>
          <p className="text-slate-500 mt-2 text-sm tracking-wide">
            Intelligence summary for Gill GTM Compensation Consultancy.
          </p>
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <LiquidGlassCard className="p-6 h-full" shadowIntensity="md">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/50 border border-white/60 ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black py-1 px-2 rounded-full bg-slate-50 text-slate-400 border border-slate-100">
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</h3>
                  <div className="text-3xl font-black text-slate-800">{stat.value}</div>
                </div>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart/Analytics Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <LiquidGlassCard className="p-8 h-[400px] flex flex-col" shadowIntensity="lg">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Pipeline Distribution</h2>
                  <p className="text-xs text-slate-500">Breakdown by Funding Stage</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Series B</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-sm bg-indigo-300" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase">Series C</span>
                   </div>
                </div>
              </div>
              
              <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
                 {[45, 65, 35, 85, 40, 55, 75, 45, 90, 60, 50, 70].map((h, i) => (
                   <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    className="flex-1 bg-gradient-to-t from-indigo-600/80 to-brand-indigo-light/40 rounded-t-lg relative group"
                   >
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {h}
                     </div>
                   </motion.div>
                 ))}
              </div>
              <div className="flex justify-between px-4 mt-2 text-[10px] font-bold text-slate-300 tracking-tighter uppercase">
                 <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </LiquidGlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <LiquidGlassCard className="p-6" blurIntensity="md">
                <div className="flex items-center gap-3 mb-4">
                   <PieChart size={18} className="text-indigo-400" />
                   <h3 className="text-sm font-bold text-slate-700">Audit Status</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">Completed</span>
                    <span className="text-xs font-bold text-slate-800">42</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[70%]" />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-500">In Progress</span>
                    <span className="font-bold text-slate-800">18</span>
                  </div>
                </div>
              </LiquidGlassCard>

              <LiquidGlassCard className="p-6" blurIntensity="md">
                <div className="flex items-center gap-3 mb-4">
                   <Zap size={18} className="text-amber-400" />
                   <h3 className="text-sm font-bold text-slate-700">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   <button className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-slate-100 hover:border-indigo-300 hover:bg-white text-xs font-bold text-slate-600 transition-all">
                      Run New Diagnostic <ArrowUpRight size={14} />
                   </button>
                   <button className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-slate-100 hover:border-indigo-300 hover:bg-white text-xs font-bold text-slate-600 transition-all">
                      Start Scrape Batch <ArrowUpRight size={14} />
                   </button>
                </div>
              </LiquidGlassCard>
            </div>
          </div>

          {/* Activity Sidebar */}
          <div className="lg:col-span-4">
            <LiquidGlassCard className="h-full flex flex-col overflow-hidden" shadowIntensity="md">
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center gap-3">
                   <Clock size={18} className="text-brand-indigo" />
                   <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Activity</h3>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                {recentLeads.map((lead: any, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="relative flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-brand-indigo z-10">
                        <UserPlus size={14} />
                      </div>
                      {i < recentLeads.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-100 mt-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-xs font-bold text-slate-800">New Target Identified</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Added <span className="text-brand-indigo font-bold">{lead.name}</span> to the {lead.stage} pipeline from source.
                      </p>
                      <span className="text-[9px] font-black text-slate-300 uppercase mt-2 block tracking-tighter italic">2 HOURS AGO</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                 <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-indigo hover:border-brand-indigo transition-all">
                    View Full Audit Log
                 </button>
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
