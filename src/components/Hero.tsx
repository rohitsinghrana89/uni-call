"use client";

import { useState } from "react";
import { Video, Keyboard, ArrowRight, ShieldCheck, Zap, Star, Lock, Sparkles } from "lucide-react";

export default function Hero() {
  const [meetingCode, setMeetingCode] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingCode.trim()) {
      alert("Please enter a meeting code or URL!");
      return;
    }
    alert(`Joining meeting with code: ${meetingCode}`);
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Glow Orbs Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill border border-blue-500/30 text-xs sm:text-sm font-medium text-slate-200 mb-8 animate-float shadow-glow">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-cyan-400 font-semibold">UniCall v2.0 Released:</span>
          <span>AI Noise Isolation & Spatial Audio Built-In</span>
          <Sparkles className="w-4 h-4 text-amber-400 ml-1" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl mx-auto leading-[1.15] mb-6">
          Ultra-HD Video Meetings for <br className="hidden sm:inline" />
          <span className="text-gradient-accent">High-Performance Teams</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          Connect seamlessly anywhere in the world with crystal-clear 4K video, zero-latency spatial audio, and enterprise-grade end-to-end encryption. No downloads required.
        </p>

        {/* Quick Meeting Entry Form & Action Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="glass-panel p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center gap-3">
            
            {/* Input Code */}
            <div className="relative w-full sm:flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Keyboard className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
                placeholder="Enter meeting code or link..."
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 text-white placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm font-medium transition-all"
              />
            </div>

            {/* Join Action Button */}
            <button
              onClick={handleJoin}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm transition-all border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
            >
              Join Meeting
            </button>

            {/* Start Instant Meeting Button */}
            <button
              onClick={() => alert("Creating your new HD room link...")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-primary hover:opacity-95 text-white font-semibold text-sm transition-all shadow-glow hover:shadow-glow-cyan flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
            >
              <Video className="w-4 h-4 text-cyan-200" />
              Start Meeting
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2.5 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted
            </span>
            <span>•</span>
            <span>No Account Required</span>
            <span>•</span>
            <span>Free Up to 100 Participants</span>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 border-t border-slate-800/80 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>SOC2 Type II Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>99.99% Guaranteed Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-slate-200">4.9/5 Rating</span>
            <span className="text-slate-500">(12k+ teams)</span>
          </div>
        </div>

      </div>
    </section>
  );
}
