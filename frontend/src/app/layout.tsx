import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { CinematicLoader } from "@/components/ui/CinematicLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AETHER | AI Engineering Intelligence",
  description: "Observe. Evaluate. Diagnose. Optimize production AI systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen selection:bg-primary selection:text-background flex flex-col">
        <CinematicLoader />
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}
