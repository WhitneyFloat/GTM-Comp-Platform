import { Space_Grotesk } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: "GTM Comp Platform",
  description: "Building the comp infrastructure that turns a sales team into a revenue engine.",
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
        
        <Sidebar />
        <main className="flex-1 overflow-auto h-screen relative z-10 p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
