"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { LayoutDashboard, Activity, Users, Mail, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { name: "Dash",     href: "/overview",  icon: LayoutDashboard },
  { name: "Audit",    href: "/",          icon: Activity },
  { name: "Leads",    href: "/leads",     icon: Users },
  { name: "Outreach", href: "/outreach",  icon: Mail },
  { name: "Vault",    href: "/archives",  icon: Archive },
];

// Height of the mobile nav bar — used for bottom padding on content
const NAV_H = "64px";

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/diagnostic";

  return (
    <div className="flex w-full min-h-screen">
      {!isPublicRoute && <Sidebar />}

      <main
        className={cn("flex-1 relative z-10 w-full overflow-y-auto")}
        style={!isPublicRoute ? { paddingBottom: `calc(${NAV_H} + env(safe-area-inset-bottom, 0px))` } : undefined}
      >
        {children}
      </main>

      {/* Mobile bottom nav — compact fixed bar, hidden on lg+ where sidebar takes over */}
      {!isPublicRoute && (
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-around bg-white/80 backdrop-blur-xl border-t border-slate-200/60"
          style={{
            height: NAV_H,
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {MOBILE_NAV.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all",
                  isActive ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                <span className="text-[9px] font-bold uppercase tracking-wide">{name}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
