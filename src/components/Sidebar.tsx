"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Activity, 
  Mail, 
  Users, 
  Megaphone, 
  Archive, 
  Settings,
  Zap
} from "lucide-react";
import { LiquidGlassCard } from "./ui/LiquidGlassCard";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Diagnostic Engine", href: "/", icon: Activity },
  { name: "Outreach", href: "/outreach", icon: Mail },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Archives", href: "/archives", icon: Archive },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-68 h-screen p-4 flex-col z-50">
      <LiquidGlassCard 
        className="w-full h-full flex flex-col"
        blurIntensity="xl" 
        glowIntensity="md" 
        shadowIntensity="md" 
        borderRadius="24px"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/20">
          <div className="w-8 h-8 rounded bg-brand-indigo/20 flex items-center justify-center text-brand-indigo">
            <Zap size={18} fill="currentColor" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-widest text-indigo-900 uppercase">GTM Comp</h1>
            <p className="text-[10px] text-indigo-700/60 tracking-wider">Architecture // Platform</p>
          </div>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-brand-indigo font-semibold" 
                    : "text-indigo-900/60 hover:text-indigo-900"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-white/40 blur-sm rounded-xl -z-10" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-brand-indigo rounded-r-full" />
                )}
                
                <Icon 
                  size={18} 
                  className={cn(
                    "transition-colors relative z-10",
                    isActive ? "text-brand-indigo" : "text-indigo-400 group-hover:text-brand-indigo/70"
                  )} 
                />
                <span className="tracking-wide relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/20">
          <LiquidGlassCard 
            className="p-3 flex items-center gap-3"
            blurIntensity="sm" 
            borderRadius="16px"
            glowIntensity="none"
            shadowIntensity="xs"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center border border-white/40">
              <span className="text-xs font-bold text-slate-600">KF</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Kelly</p>
              <p className="text-[10px] text-slate-500">Architect Mode</p>
            </div>
          </LiquidGlassCard>
        </div>
      </LiquidGlassCard>
    </aside>
  );
}
