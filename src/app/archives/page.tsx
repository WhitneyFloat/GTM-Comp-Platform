"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Archive, 
  Search, 
  Linkedin, 
  Building2, 
  Filter, 
  TrendingUp,
  MoreVertical,
  RotateCcw
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";
import leadsData from "@/data/leads.json";

export default function ArchivesPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        setLeads(data.length > 0 ? data : leadsData.map((l: any) => ({ ...l, status: l.status || "active" })));
      })
      .catch(() => {
        setLeads(leadsData.map((l: any) => ({ ...l, status: l.status || "active" })));
      });
  }, []);

  // Filter for archived leads
  const archivedLeads = leads.filter((lead: any) => 
    lead.status === "archived" && 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-6xl h-full relative"
      >
        <LiquidGlassCard 
          className="w-full h-full flex flex-col grayscale-[0.2]" 
          blurIntensity="xl" 
          shadowIntensity="2xl"
          glowIntensity="none"
        >
          {/* Header Section */}
          <div className="p-8 border-b border-white/20 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl">
                  <Archive className="text-slate-500" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lead Archives</h1>
                  <p className="text-sm text-slate-500 font-medium font-mono uppercase tracking-[0.2em] text-[9px]">Historical Vault // Inactive Prospects</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search archives..."
                  className="w-full bg-white/40 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 outline-none focus:border-slate-400 transition-all font-medium text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Archives Grid */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedLeads.map((lead: any, idx) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <LiquidGlassCard 
                    className="p-5 flex flex-col gap-4 group transition-all opacity-80 hover:opacity-100 border border-white/40"
                    shadowIntensity="sm"
                    blurIntensity="md"
                    borderRadius="20px"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
                        <Building2 size={20} />
                      </div>
                      <span className="text-[10px] font-black tracking-tighter text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 uppercase">
                        Archived
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-700 leading-tight mb-1">{lead.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lead.stage} • {lead.headcount} Reps</p>
                    </div>

                    <div className="pt-2 flex gap-2">
                       <button className="flex-1 bg-white border border-slate-200 text-slate-500 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                          <RotateCcw size={14} /> Restore
                       </button>
                       <a 
                        href={`https://${lead.url}`} 
                        target="_blank" 
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-brand-indigo hover:border-brand-indigo transition-all"
                       >
                        <Linkedin size={16} />
                       </a>
                    </div>
                  </LiquidGlassCard>
                </motion.div>
              ))}
            </div>
            
            {archivedLeads.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-24">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Archive size={32} className="text-slate-200" />
                </div>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm">No archived leads</h3>
                <p className="text-[10px] text-slate-300 font-bold mt-1">Archive leads in the repository to see them here.</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-white/20 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Archive size={14} />
              <span>Vault // Historical Repository</span>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </div>
  );
}
