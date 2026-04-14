"use client";

import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Database, 
  FileText, 
  User, 
  Bell, 
  Shield, 
  ExternalLink,
  Save,
  Zap
} from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
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
          <div className="p-8 border-b border-white/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-indigo/10 rounded-xl text-brand-indigo">
                <SettingsIcon size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Platform Settings</h1>
                <p className="text-sm text-slate-500 font-medium">Configure your GTM Architecture Environment</p>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Config */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <LiquidGlassCard className="p-6" shadowIntensity="sm" blurIntensity="md">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-brand-indigo" size={18} />
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Primary Profile</h3>
                  </div>
                  <div className="flex flex-col items-center py-6">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center mb-4 text-2xl font-black text-slate-400">
                      KF
                    </div>
                    <h4 className="font-bold text-slate-800">Kelly Architecture</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Platform Admin</p>
                  </div>
                </LiquidGlassCard>

                <LiquidGlassCard className="p-6 bg-brand-indigo/5 border-brand-indigo/10" glowIntensity="sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="text-brand-indigo" size={18} />
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Architect Mode</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
                    When enabled, provides advanced AI diagnostics and raw data access across all repositories.
                  </p>
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-brand-indigo/20">
                    <span className="text-[10px] font-black uppercase text-brand-indigo">Status: Active</span>
                    <div className="w-10 h-5 bg-brand-indigo rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </LiquidGlassCard>
              </div>

              {/* Integrations & Data */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <LiquidGlassCard className="p-8" shadowIntensity="sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Database className="text-brand-indigo" size={18} />
                      <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Data Integrations</h3>
                    </div>
                    <button className="text-[10px] font-black uppercase text-brand-indigo hover:underline flex items-center gap-1">
                      Documentation <ExternalLink size={12} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 border border-slate-100 rounded-2xl bg-white/40">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FileText size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">Google Sheets Database</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Primary Source of Truth</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded uppercase tracking-widest">Connected</span>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          readOnly
                          value="1Kl52x5ORjU-7p4rgjPhqCxR4OrbxNOmEpBxFt41eHQ8"
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-mono text-slate-500 outline-none"
                        />
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                          Edit
                        </button>
                      </div>
                    </div>

                    <div className="p-5 border border-slate-100 rounded-2xl bg-white/40">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-brand-indigo flex items-center justify-center">
                            <Bell size={16} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">Notification Webhooks</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Lead Alert Trigger</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[9px] font-black rounded uppercase tracking-widest">Disabled</span>
                      </div>
                      <button className="w-full py-2.5 bg-white border-2 border-dashed border-indigo-100 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                        Connect Slack / Discord
                      </button>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-end">
                    <button className="flex items-center gap-3 px-8 py-4 bg-brand-indigo text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-sans">
                      <Save size={16} /> Save Configuration
                    </button>
                  </div>
                </LiquidGlassCard>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/20 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <Shield size={14} className="text-emerald-500" />
              <span>Platform Integrity // Secure End-to-End</span>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </div>
  );
}
