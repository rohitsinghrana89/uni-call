"use client";

import { useState, useEffect, use, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Share2,
  Users,
  Play,
  Clock,
  PhoneOff,
  User,
  AlertCircle,
  Volume2,
  VolumeX
} from "lucide-react";

interface MeetingData {
  id: string;
  url: string;
  fullUrl: string;
  title: string;
  host: string;
  createdAt: string;
  status: string;
  participantsCount: number;
  isEncrypted: boolean;
}

export default function MeetingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const meetingId = resolvedParams.id.toUpperCase();
  const router = useRouter();

  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pre-join Lobby Form & Media States
  const [displayName, setDisplayName] = useState("Alex Morgan");
  const [nameError, setNameError] = useState("");
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [originUrl, setOriginUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOriginUrl(window.location.origin);
    }

    async function fetchMeeting() {
      try {
        const res = await fetch(`/api/meetings/${meetingId}`);
        const data = await res.json();
        if (data.success && data.meeting) {
          setMeeting(data.meeting);
        } else {
          setMeeting({
            id: meetingId,
            url: `/meeting/${meetingId}`,
            fullUrl: `${window.location.origin}/meeting/${meetingId}`,
            title: `Meeting (${meetingId})`,
            host: "Sarah Jenkins",
            createdAt: new Date().toISOString(),
            status: "active",
            participantsCount: 2,
            isEncrypted: true,
          });
        }
      } catch {
        setMeeting({
          id: meetingId,
          url: `/meeting/${meetingId}`,
          fullUrl: `${window.location.origin}/meeting/${meetingId}`,
          title: `Meeting (${meetingId})`,
          host: "Sarah Jenkins",
          createdAt: new Date().toISOString(),
          status: "active",
          participantsCount: 2,
          isEncrypted: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMeeting();
  }, [meetingId]);

  const displayFullUrl = meeting?.fullUrl || `${originUrl}/meeting/${meetingId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayFullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleJoinMeetingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setNameError("Please enter your display name to join");
      return;
    }
    setNameError("");
    setHasJoined(true);
  };

  const handleLeaveCall = () => {
    setHasJoined(false);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B11] text-slate-100 flex items-center justify-center bg-grid-pattern">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Connecting to Meeting Lobby...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 selection:bg-blue-600 selection:text-white bg-grid-pattern relative flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Ambient Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="relative z-10 w-full px-6 py-5 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-glow transition-all duration-300 group-hover:scale-105">
            <Video className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              UniCall
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                HD Call
              </span>
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>End-to-End Encrypted (AES-256)</span>
          </div>
          <Link
            href="/dashboard"
            className="glass-pill px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-500/80 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {hasJoined ? (
            /* Active Call Simulation Room View */
            <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Call Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                    <h2 className="text-xl font-bold text-white">
                      {meeting?.title}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Meeting ID: <span className="font-mono text-cyan-400 font-bold">{meetingId}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono font-semibold">00:05:22</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Users className="w-4 h-4" />
                    <span>2 Participants</span>
                  </div>
                </div>
              </div>

              {/* Participant Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Host Video Tile */}
                <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-inner group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-blue-950/30 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-glow mb-3">
                      SJ
                    </div>
                    <h3 className="text-base font-bold text-white">{meeting?.host || "Sarah Jenkins"}</h3>
                    <span className="text-[11px] text-cyan-400 font-medium mt-1">Host • HD Stream</span>
                  </div>
                  <div className="absolute bottom-3 left-3 glass-pill px-3 py-1 rounded-lg text-xs text-white font-medium flex items-center gap-1.5 border border-white/10">
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{meeting?.host || "Sarah Jenkins"}</span>
                  </div>
                </div>

                {/* Current User Video Tile */}
                <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-inner group">
                  {camEnabled ? (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-cyan-950/30 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-2xl text-white shadow-glow mb-3">
                        {displayName.trim().slice(0, 2).toUpperCase() || "YOU"}
                      </div>
                      <h3 className="text-base font-bold text-white">{displayName} (You)</h3>
                      <span className="text-[11px] text-cyan-400 font-medium mt-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Live Camera Stream Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <VideoOff className="w-10 h-10 mb-2 text-slate-600" />
                      <p className="text-xs">Camera Turned Off</p>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 glass-pill px-3 py-1 rounded-lg text-xs text-white font-medium flex items-center gap-1.5 border border-white/10">
                    {micEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{displayName} (You)</span>
                  </div>
                </div>

              </div>

              {/* In-Call Action Control Bar */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`p-4 rounded-2xl border transition-all ${
                    micEnabled ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  }`}
                  title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setCamEnabled(!camEnabled)}
                  className={`p-4 rounded-2xl border transition-all ${
                    camEnabled ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  }`}
                  title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
                >
                  {camEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 transition-all"
                  title="Copy Meeting Link"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>

                <button
                  onClick={handleLeaveCall}
                  className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold text-white text-sm transition-all shadow-lg flex items-center gap-2"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>Leave Meeting</span>
                </button>
              </div>

            </div>
          ) : (
            /* Pre-Join Lobby View */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Camera Preview Box & Media Toggles */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative aspect-video w-full rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                  
                  {camEnabled ? (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-blue-950/40 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-3xl text-white shadow-glow mb-3">
                        {displayName.trim() ? displayName.trim().slice(0, 2).toUpperCase() : "ME"}
                      </div>
                      <h3 className="text-lg font-bold text-white">{displayName || "Your Name"}</h3>
                      <p className="text-xs text-cyan-400 font-medium mt-1 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Camera Stream Ready (4K HD)
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <VideoOff className="w-14 h-14 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-400">Camera is turned off</p>
                    </div>
                  )}

                  {/* Floating Live Status Bar at Top */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="glass-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 border border-white/10">
                      <span className={`w-2.5 h-2.5 rounded-full ${camEnabled ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                      <span>{camEnabled ? "Camera Active" : "Camera Off"}</span>
                    </div>

                    <div className="glass-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 border border-white/10">
                      {micEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Microphone Active</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-rose-400">Mic Muted</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pre-join Audio/Video Toggle Overlays */}
                  <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setMicEnabled(!micEnabled)}
                      className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
                        micEnabled
                          ? "bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800"
                          : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                      }`}
                      title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                    >
                      {micEnabled ? <Mic className="w-5 h-5 text-emerald-400" /> : <MicOff className="w-5 h-5 text-rose-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCamEnabled(!camEnabled)}
                      className={`p-3.5 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
                        camEnabled
                          ? "bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800"
                          : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                      }`}
                      title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
                    >
                      {camEnabled ? <Video className="w-5 h-5 text-cyan-400" /> : <VideoOff className="w-5 h-5 text-rose-400" />}
                    </button>
                  </div>

                </div>

                {/* Mic Volume Level Bar */}
                <div className="p-3.5 rounded-2xl glass-panel border border-slate-800/90 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-2">
                    {micEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                    Mic Status:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 h-3 w-16">
                      <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-2 bg-emerald-400" : "h-1 bg-slate-700"}`} />
                      <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-3 bg-emerald-400 animate-pulse" : "h-1 bg-slate-700"}`} />
                      <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-2.5 bg-emerald-400" : "h-1 bg-slate-700"}`} />
                      <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-3.5 bg-cyan-400" : "h-1 bg-slate-700"}`} />
                    </div>
                    <span className={`font-semibold ${micEnabled ? "text-emerald-400" : "text-slate-500"}`}>
                      {micEnabled ? "Ready" : "Muted"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Pre-join Display Name & Join Card */}
              <div className="lg:col-span-5 flex flex-col justify-between glass-panel border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-glass">
                
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Ready to Join Meeting</span>
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-white leading-tight mb-1">
                      {meeting?.title}
                    </h1>
                    <p className="text-xs text-slate-400">
                      Host: <strong className="text-slate-200">{meeting?.host}</strong> • Meeting ID: <span className="font-mono text-cyan-400 font-bold">{meetingId}</span>
                    </p>
                  </div>

                  {/* Pre-Join Form */}
                  <form onSubmit={handleJoinMeetingSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Your Display Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => {
                            setDisplayName(e.target.value);
                            if (nameError) setNameError("");
                          }}
                          placeholder="Enter your name"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 rounded-xl text-sm outline-none transition-all"
                        />
                      </div>
                      {nameError && (
                        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {nameError}
                        </p>
                      )}
                    </div>

                    {/* Full Meeting Link Display */}
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium">Meeting URL:</span>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-300 truncate max-w-[200px]">{displayFullUrl}</span>
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 pl-2 flex-shrink-0"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Join Meeting Action Button */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-primary shadow-glow hover:shadow-glow-cyan transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm mt-4"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Join Meeting</span>
                    </button>
                  </form>
                </div>

                {/* Copy Link Secondary Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-3 rounded-2xl glass-pill hover:bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
                  <span>{copied ? "Meeting Link Copied!" : "Copy Meeting Link"}</span>
                </button>

              </div>

            </div>
          )}
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} UniCall Inc. Enterprise-grade 256-Bit SSL/TLS Encryption.
      </footer>
    </div>
  );
}
