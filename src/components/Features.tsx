"use client";

import {
  Video,
  Mic,
  Lock,
  Share2,
  Sparkles,
  Zap,
  Globe,
  Cpu,
  ShieldCheck,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  accentColor: string;
}

function FeatureCard({ icon, title, description, badge, accentColor }: FeatureCardProps) {
  return (
    <div className="glass-panel glass-panel-hover p-8 rounded-3xl relative overflow-hidden group">
      {/* Top Ambient Glow */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${accentColor} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-300 pointer-events-none`}></div>
      
      {/* Card Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl glass-pill flex items-center justify-center border border-slate-700/60 group-hover:border-cyan-500/50 transition-colors">
          {icon}
        </div>
        {badge && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {badge}
          </span>
        )}
      </div>

      {/* Card Body */}
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default function Features() {
  const featuresList = [
    {
      icon: <Video className="w-7 h-7 text-cyan-400" />,
      title: "4K Ultra-HD Video & Spatial Audio",
      description: "Crystal clear 60fps video with adaptive bitrate streaming and 3D spatial audio positioning for life-like meeting immersion.",
      badge: "60 FPS",
      accentColor: "bg-cyan-500",
    },
    {
      icon: <Cpu className="w-7 h-7 text-blue-400" />,
      title: "AI Noise Cancellation Built-In",
      description: "Neural network isolation automatically suppresses keyboard clicks, dog barks, sirens, and background fan noise instantly.",
      badge: "Neural AI",
      accentColor: "bg-blue-500",
    },
    {
      icon: <Globe className="w-7 h-7 text-violet-400" />,
      title: "One-Click Instant Browser Links",
      description: "Join meetings directly from Chrome, Safari, or Edge without downloading heavy desktop clients or mobile apps.",
      badge: "Zero Download",
      accentColor: "bg-violet-500",
    },
    {
      icon: <Lock className="w-7 h-7 text-emerald-400" />,
      title: "Enterprise End-to-End Encryption",
      description: "AES-256 GCM encryption ensures your audio, video, and screen shares remain completely private and secure.",
      badge: "SOC2 Certified",
      accentColor: "bg-emerald-500",
    },
    {
      icon: <Share2 className="w-7 h-7 text-amber-400" />,
      title: "Smart Screen & Window Sharing",
      description: "Share single windows, browser tabs, or full displays with ultra-low latency, presenter mode, and interactive laser pointer.",
      badge: "Low Latency",
      accentColor: "bg-amber-500",
    },
    {
      icon: <Sparkles className="w-7 h-7 text-rose-400" />,
      title: "Live Transcripts & AI Summaries",
      description: "Real-time speech-to-text transcriptions with automatic meeting highlights, key action items, and multi-language translation.",
      badge: "AI Powered",
      accentColor: "bg-rose-500",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 relative bg-[#080B11] border-t border-slate-800/80">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-violet-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3 block">
            Engineered for Modern Teams
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Everything You Need for <br />
            <span className="text-gradient-accent">Seamless Remote Collaboration</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Built from the ground up with WebRTC performance optimizations, AI audio isolation, and enterprise security compliance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuresList.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>

        {/* Security & Solutions Highlight Banner */}
        <div id="security" className="mt-16 sm:mt-24 glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700/80 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>ENTERPRISE SECURITY FIRST</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Complete Privacy & Compliance Out of the Box
            </h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              We never store your video recordings, transcripts, or screen share buffers without explicit organization consent. Fully HIPAA, GDPR, and ISO 27001 compliant.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => alert("Security Whitepaper downloaded!")}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
            >
              Read Security Whitepaper
            </button>
            <button
              onClick={() => alert("Enterprise Sales demo scheduled!")}
              className="px-6 py-3.5 rounded-xl bg-gradient-primary hover:opacity-95 text-white font-semibold text-sm shadow-glow transition-all"
            >
              Schedule Enterprise Demo
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
