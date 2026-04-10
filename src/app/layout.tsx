"use client";

import { Space_Grotesk } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/diagnostic";

  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex text-text-main font-sans overflow-hidden relative">
        {/* New Sunset Radial Gradient Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
          }}
        />
        
        {!isPublicRoute && <Sidebar />}
        <main className={cn(
          "flex-1 overflow-auto h-screen relative z-10",
          !isPublicRoute ? "p-4" : "p-0"
        )}>
          {children}
        </main>
      </body>
    </html>
  );
}
