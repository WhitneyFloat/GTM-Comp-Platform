"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  Megaphone, 
  Archive 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiquidGlassCard } from "./ui/LiquidGlassCard";

const MOBILE_NAV = [
  { name: "Dash", href: "/overview", icon: LayoutDashboard },
  { name: "Audit", href: "/", icon: Activity },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "Vault", href: "/archives", icon: Archive },
];

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/diagnostic";

  return (
    <div className="flex w-full h-full">
      {!isPublicRoute && <Sidebar />}
      
      <main className={cn(
        "flex-1 overflow-auto h-screen relative z-10 w-full",
        !isPublicRoute ? "p-0 lg:p-4 pb-24 lg:pb-4" : "p-0"
      )}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {!isPublicRoute && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 z-[100]">
          <LiquidGlassCard 
            className="w-full flex items-center justify-around py-4 px-2"
            blurIntensity="xl"
            glowIntensity="sm"
            shadowIntensity="lg"
            borderRadius="20px"
          >
            {MOBILE_NAV.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-all",
                    isActive ? "text-brand-indigo scale-110" : "text-slate-400"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">{item.name}</span>
                </Link>
              );
            })}
          </LiquidGlassCard>
        </div>
      )}
    </div>
  );
}
