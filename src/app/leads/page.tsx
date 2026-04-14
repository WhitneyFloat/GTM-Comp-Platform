"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Linkedin, 
  Building2, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Mail,
  MoreVertical,
  X,
  Sparkles
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { SequencePanel } from "@/components/SequencePanel";
import { cn } from "@/lib/utils";
import leadsData from "@/data/leads.json";
import { getFitReason } from "@/lib/scoring";

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads")
      .then(res => res.json())
      .then(data => {
        setLeads(data.length > 0 ? data : leadsData.map((l: any) => ({ ...l, status: l.status || "active" })));
        setIsLoading(false);
      })
      .catch(() => {
        setLeads(leadsData.map((l: any) => ({ ...l, status: l.status || "active" })));
        setIsLoading(false);
      });
  }, []);
  
  const filteredLeads = leads.filter(lead => 
    lead.status !== "archived" &&
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
          className="w-full h-full flex flex-col" 
          blurIntensity="xl" 
          shadowIntensity="2xl"
          glowIntensity="lg"
        >
          {/* Header Section */}
          <div className="p-8 border-b border-white/20 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-indigo/10 rounded-xl">
                  <Users className="text-brand-indigo" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Lead Repository</h1>
                  <p className="text-sm text-slate-500 font-medium">syncing data from Google Source Sheet</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Filter by company name..."
                  className="w-full bg-white/40 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 transition-all font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 bg-white/40 border border-slate-200 rounded-xl text-slate-600 text-sm font-bold hover:bg-white/60 transition-all">
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>

          {/* Leads Grid/List */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead: any, idx) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <LiquidGlassCard 
                    className="p-5 flex flex-col gap-4 group hover:ring-2 hover:ring-brand-indigo/30 transition-all"
                    shadowIntensity="sm"
                    blurIntensity="md"
                    borderRadius="20px"
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-brand-indigo transition-colors group-hover:text-white text-brand-indigo">
                        <Building2 size={20} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-black tracking-tighter text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {lead.fit}% FIT
                        </span>
                        <button className="text-slate-300 hover:text-slate-500 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{lead.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <span className="px-2 py-0.5 bg-slate-100 rounded uppercase tracking-wider text-[9px]">{lead.stage}</span>
                        <span>•</span>
                        <span>{lead.headcount} Reps</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {getFitReason({ ...lead, salesRepCount: lead.salesRepCount }).map((reason, i) => (
                           <span key={i} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-bold uppercase tracking-tighter border border-emerald-100/50">
                             {reason}
                           </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <button 
                        onClick={() => setSelectedLead(lead)}
                        className="w-full bg-indigo-600/90 hover:bg-indigo-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                      >
                        <Sparkles size={14} /> Generate AI Sequence
                      </button>
                      <a 
                        href={`https://${lead.url}`} 
                        target="_blank" 
                        className="w-full bg-white border border-slate-200 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-indigo hover:border-brand-indigo transition-all flex items-center justify-center gap-2"
                      >
                        <Linkedin size={14} /> View Profile
                      </a>
                    </div>
                  </LiquidGlassCard>
                </motion.div>
              ))}
            </div>
            
            {filteredLeads.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-24">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-slate-200" />
                </div>
                <h3 className="text-slate-800 font-bold uppercase tracking-widest text-sm">No matches found</h3>
                <p className="text-xs text-slate-400 mt-1">Adjust your filter to view more leads.</p>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-6 bg-white/20 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Total Leads:</span>
                <span className="text-brand-indigo">{leads.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Filtered:</span>
                <span className="text-brand-indigo">{filteredLeads.length}</span>
              </div>
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              Vault // GTM Comp Platform
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>

      <SequencePanel 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
      />
    </div>
  );
}
