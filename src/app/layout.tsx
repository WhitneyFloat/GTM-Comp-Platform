import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import NavigationWrapper from "@/components/NavigationWrapper";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GTM Comp Platform",
  description: "GTM Architecture & Compensation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
      </body>
    </html>
  );
}
