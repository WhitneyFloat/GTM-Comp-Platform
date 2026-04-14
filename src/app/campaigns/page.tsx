"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Copy, 
  MoreVertical, 
  Play, 
  Pause, 
  Mail, 
  Layers,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";
import campaignsData from "@/data/campaigns.json";

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [campaigns, setCampaigns] = useState(campaignsData);

  const toggleStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c
    ));
  };

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          {/* Header */}
          <div className="p-8 border-b border-white/20 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-indigo/10 rounded-xl text-brand-indigo">
                  <Megaphone size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Campaign Suites</h1>
                  <p className="text-sm text-slate-500 font-medium font-mono uppercase tracking-widest text-[10px]">Sequence Library // Architecture</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddingNew(true)}
                className="bg-brand-indigo hover:bg-brand-indigo-dark text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                <Plus size={16} /> New Sequence Suite
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search your library..."
                  className="w-full bg-white/40 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/10 transition-all font-medium text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Campaign List */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCampaigns.map((campaign, idx) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <LiquidGlassCard 
                    className="p-6 flex flex-col gap-6 group hover:ring-2 hover:ring-brand-indigo/20 transition-all border border-white/40"
                    shadowIntensity="sm"
                    blurIntensity="md"
                    borderRadius="24px"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                          campaign.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                        )}>
                          <Zap size={20} className={campaign.status === "active" ? "animate-pulse" : ""} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 leading-tight">{campaign.title}</h3>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mt-1">
                            <span className={campaign.status === "active" ? "text-emerald-500" : "text-slate-500"}>{campaign.status}</span>
                            <span>•</span>
                            <span>{campaign.stepCount} Steps</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-500 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-medium bg-white/30 p-3 rounded-lg border border-white/50">
                      {campaign.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                       <div className="flex -space-x-2">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500">
                             {i}
                           </div>
                         ))}
                         <div className="w-6 h-6 rounded-full border-2 border-white bg-brand-indigo flex items-center justify-center text-[8px] font-black text-white">
                           +
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                         <button 
                            onClick={() => toggleStatus(campaign.id)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                              campaign.status === "active" 
                                ? "bg-amber-50 text-amber-600 border border-amber-100" 
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            )}
                         >
                           {campaign.status === "active" ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Launch</>}
                         </button>
                         <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-brand-indigo border border-indigo-100 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-brand-indigo hover:text-white transition-all">
                           <Layers size={12} /> Edit Steps
                         </button>
                       </div>
                    </div>
                  </LiquidGlassCard>
                </motion.div>
              ))}

              {/* Add New Placeholder */}
              <motion.button 
                onClick={() => setIsAddingNew(true)}
                className="flex flex-col items-center justify-center gap-4 p-8 rounded-[24px] border-2 border-dashed border-indigo-200 hover:border-brand-indigo/40 hover:bg-white/40 transition-all group min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-brand-indigo group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Add New Sequence Suite</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Expand the Library</p>
                </div>
              </motion.button>
            </div>
          </div>

          <div className="p-6 bg-white/20 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Sparkles size={14} className="text-brand-indigo" />
              <span>Vault // Sequence Architect Mode</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              System // GTM Comp Platform
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>

      {/* New Campaign Modal Placeholder */}
      <AnimatePresence>
        {isAddingNew && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingNew(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <LiquidGlassCard className="p-8" blurIntensity="xl" shadowIntensity="2xl">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 font-space-grotesk tracking-tight">Create New Suite</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Suite Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Outreach - Series B Founders"
                      className="w-full bg-white/60 border border-slate-200 rounded-xl py-4 px-4 outline-none focus:border-brand-indigo transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Description & Intent</label>
                    <textarea 
                      placeholder="What is the goal of this sequence?"
                      className="w-full bg-white/60 border border-slate-200 rounded-xl py-4 px-4 outline-none focus:border-brand-indigo transition-all font-bold text-slate-800 min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button 
                    onClick={() => setIsAddingNew(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all font-sans"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 font-sans">
                    Initialize Suite
                  </button>
                </div>
              </LiquidGlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
