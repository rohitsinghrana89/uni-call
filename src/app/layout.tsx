import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UniCall - Modern HD Video Conferencing & Team Collaboration",
  description: "Instant ultra HD video meetings, spatial audio, smart screen sharing, and AI noise suppression built for high-performance teams.",
  keywords: ["video conferencing", "hd meeting", "team collaboration", "online meetings", "screen sharing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} antialiased bg-[#080B11] text-slate-100 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
