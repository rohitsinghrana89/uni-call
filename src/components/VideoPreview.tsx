"use client";

import { useState } from "react";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Users,
  Hand,
  Settings,
  MoreVertical,
  Volume2,
  Sparkles,
  Maximize2,
  ShieldCheck,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  initials: string;
  isSpeaking?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSharing?: boolean;
}

const initialParticipants: Participant[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Product Lead",
    avatarBg: "from-blue-600 to-indigo-700",
    initials: "AR",
    isSpeaking: true,
    isMuted: false,
  },
  {
    id: "2",
    name: "Elena Rostova",
    role: "Engineering Director",
    avatarBg: "from-cyan-600 to-teal-700",
    initials: "ER",
    isMuted: true,
    isSharing: true,
  },
  {
    id: "3",
    name: "Marcus Chen",
    role: "Principal UX Architect",
    avatarBg: "from-violet-600 to-purple-800",
    initials: "MC",
    isMuted: false,
  },
  {
    id: "4",
    name: "Sophia Lin",
    role: "AI Systems Specialist",
    avatarBg: "from-amber-600 to-rose-700",
    initials: "SL",
    isVideoOff: true,
    isMuted: true,
  },
  {
    id: "5",
    name: "David Vance",
    role: "Security Lead",
    avatarBg: "from-emerald-600 to-green-800",
    initials: "DV",
    isMuted: false,
  },
  {
    id: "6",
    name: "You (Host)",
    role: "Presenter",
    avatarBg: "from-blue-500 to-cyan-500",
    initials: "YOU",
    isMuted: false,
  },
];

export default function VideoPreview() {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [raisedHand, setRaisedHand] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "speaker">("grid");

  return (
    <section id="preview" className="py-16 sm:py-24 relative bg-[#080B11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
            Live Interactive Preview
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Designed for Instant Clarity & Effortless Control
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Experience our next-generation video tile interface featuring AI active speaker tracking, real-time noise suppression badges, and low-latency response.
          </p>
        </div>

        {/* Video Call Mockup Window */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl shadow-blue-900/20 max-w-6xl mx-auto">
          
          {/* Header Bar */}
          <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Room Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE 4K</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Product Roadmap Sync 2026
              </h3>
              <span className="hidden sm:inline text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 font-mono">
                ID: 849-209-110
              </span>
            </div>

            {/* Meeting Meta Stats */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline text-slate-400">Security:</span>
                <span className="text-slate-200">E2E Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-slate-400">
                <span>00:24:15</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-4 h-4 text-blue-400" />
                <span>6 Participants</span>
              </div>
            </div>
          </div>

          {/* Video Grid Canvas */}
          <div className="p-4 sm:p-6 bg-slate-950/95 min-h-[460px] sm:min-h-[520px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialParticipants.map((p) => {
              const isLocalUser = p.id === "6";
              const currentMicState = isLocalUser ? micOn : !p.isMuted;
              const currentCamState = isLocalUser ? cameraOn : !p.isVideoOff;

              return (
                <div
                  key={p.id}
                  className={`relative rounded-2xl overflow-hidden min-h-[200px] sm:min-h-[220px] flex flex-col justify-between p-4 transition-all duration-300 ${
                    p.isSpeaking
                      ? "ring-2 ring-cyan-400 shadow-glow-cyan bg-slate-900/90"
                      : "bg-slate-900/60 border border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  {/* Speaker Wave Banner */}
                  {p.isSpeaking && (
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                      <div className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-md">
                        <Volume2 className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                        Active Speaker
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-4 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}

                  {/* Avatar / Video Stream Mockup */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {currentCamState ? (
                      /* Simulated active video stream background with subtle gradient shift */
                      <div className={`w-full h-full bg-gradient-to-br ${p.avatarBg} opacity-20 transition-opacity duration-300`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${p.avatarBg} flex items-center justify-center text-white text-2xl font-bold tracking-wider shadow-xl opacity-90 border-2 border-white/20`}>
                            {p.initials}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Camera Off Tile */
                      <div className="w-full h-full bg-slate-900/90 flex flex-col items-center justify-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xl font-bold">
                          {p.initials}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Camera Paused</span>
                      </div>
                    )}
                  </div>

                  {/* Top Status Indicators */}
                  <div className="relative z-10 flex justify-end gap-2">
                    {p.isSharing && (
                      <span className="px-2 py-1 rounded-md bg-blue-600/30 text-blue-300 text-[10px] font-bold border border-blue-500/40 flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> Sharing Screen
                      </span>
                    )}
                  </div>

                  {/* Bottom Info Strip */}
                  <div className="relative z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800/80">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {p.name}
                        {isLocalUser && <span className="text-[10px] font-medium text-cyan-400">(You)</span>}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{p.role}</span>
                    </div>

                    {/* Mic Status */}
                    <div className="flex items-center gap-2">
                      {currentMicState ? (
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Mic className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          <MicOff className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Quick Settings */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => alert("Audio & Microphone settings opened")}
                className="p-2.5 rounded-xl glass-pill text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Audio Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="h-6 w-[1px] bg-slate-800"></div>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI Noise Isolation Active
              </span>
            </div>

            {/* Center Main Call Actions */}
            <div className="flex items-center justify-center gap-3 mx-auto sm:mx-0">
              
              {/* Mic Toggle */}
              <button
                onClick={() => setMicOn(!micOn)}
                className={`p-3.5 rounded-2xl font-medium transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                  micOn
                    ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950"
                }`}
                title={micOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={() => setCameraOn(!cameraOn)}
                className={`p-3.5 rounded-2xl font-medium transition-all duration-200 active:scale-95 ${
                  cameraOn
                    ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950"
                }`}
                title={cameraOn ? "Turn Off Camera" : "Turn On Camera"}
              >
                {cameraOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Share Screen */}
              <button
                onClick={() => {
                  setScreenSharing(!screenSharing);
                  alert(screenSharing ? "Screen sharing stopped" : "Screen sharing started!");
                }}
                className={`p-3.5 rounded-2xl font-medium transition-all duration-200 active:scale-95 ${
                  screenSharing
                    ? "bg-cyan-600 text-white shadow-glow-cyan"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
                title="Share Screen"
              >
                <Monitor className="w-5 h-5" />
              </button>

              {/* Raise Hand */}
              <button
                onClick={() => setRaisedHand(!raisedHand)}
                className={`p-3.5 rounded-2xl font-medium transition-all duration-200 active:scale-95 ${
                  raisedHand
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
                title="Raise Hand"
              >
                <Hand className="w-5 h-5" />
              </button>

              {/* End Call Button */}
              <button
                onClick={() => alert("Meeting session ended.")}
                className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition-all active:scale-95 flex items-center gap-2"
              >
                <PhoneOff className="w-5 h-5" />
                <span className="hidden sm:inline">End Meeting</span>
              </button>
            </div>

            {/* Right Drawers */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => alert("Participant list opened")}
                className="px-3 py-2 rounded-xl glass-pill text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>6</span>
              </button>
              <button
                onClick={() => alert("In-meeting Chat opened")}
                className="px-3 py-2 rounded-xl glass-pill text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span>Chat</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
