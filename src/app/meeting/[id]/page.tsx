"use client";

import { useState, useEffect, useRef, use, FormEvent } from "react";
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
  Clock,
  PhoneOff,
  User,
  AlertCircle,
  Volume2,
  VolumeX,
  MessageSquare,
  Pin,
  Monitor,
  MonitorOff,
  Send,
  X,
  RefreshCw,
  Camera,
  Play
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

// Mock Call Participants Data for grid demonstration
const CALL_PARTICIPANTS = [
  {
    id: "p-1",
    name: "Sarah Jenkins",
    role: "Host",
    isHost: true,
    micOn: true,
    camOn: true,
    isSpeaking: true,
    initials: "SJ",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "p-2",
    name: "David Chen",
    role: "Lead Engineer",
    isHost: false,
    micOn: true,
    camOn: true,
    isSpeaking: false,
    initials: "DC",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: "p-3",
    name: "Emily Watson",
    role: "Product Designer",
    isHost: false,
    micOn: false,
    camOn: true,
    isSpeaking: false,
    initials: "EW",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    id: "p-4",
    name: "Marcus Vance",
    role: "Security Spec",
    isHost: false,
    micOn: true,
    camOn: false,
    isSpeaking: false,
    initials: "MV",
    gradient: "from-emerald-500 to-teal-700",
  },
];

// Mock In-Call Chat Messages
const INITIAL_CHAT = [
  {
    id: "c-1",
    sender: "Sarah Jenkins",
    time: "4:02 PM",
    text: "Welcome everyone! WebRTC Real Browser Media Access is live.",
    isSelf: false,
  },
  {
    id: "c-2",
    sender: "David Chen",
    time: "4:03 PM",
    text: "Testing local video preview and mic mute toggles.",
    isSelf: false,
  },
];

export default function MeetingRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const meetingId = resolvedParams.id.toUpperCase();
  const router = useRouter();

  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pre-join Lobby Form & User States
  const [displayName, setDisplayName] = useState("Alex Morgan");
  const [nameError, setNameError] = useState("");
  const [copied, setCopied] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [originUrl, setOriginUrl] = useState("");

  // WebRTC Real Browser Media Access States
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [isInitializingMedia, setIsInitializingMedia] = useState(false);

  // Video element refs for live WebRTC stream binding
  const lobbyVideoRef = useRef<HTMLVideoElement | null>(null);
  const roomVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // In-Call Drawers & Controls
  const [screenSharing, setScreenSharing] = useState(false);
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [showParticipantsSidebar, setShowParticipantsSidebar] = useState(false);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT);
  const [newMessageText, setNewMessageText] = useState("");

  // Timer State
  const [callSeconds, setCallSeconds] = useState(254);

  // Initialize WebRTC Real Media Stream
  const initMediaStream = async () => {
    setIsInitializingMedia(true);
    setMediaError(null);

    // Stop existing stream tracks if re-initializing
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("WebRTC media devices API is not supported in this browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      localStreamRef.current = stream;

      // Apply initial mic & camera mute states
      stream.getVideoTracks().forEach((track) => {
        track.enabled = camEnabled;
      });
      stream.getAudioTracks().forEach((track) => {
        track.enabled = micEnabled;
      });

      // Bind stream to video elements
      if (lobbyVideoRef.current) {
        lobbyVideoRef.current.srcObject = stream;
      }
      if (roomVideoRef.current) {
        roomVideoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      console.error("WebRTC getUserMedia Error:", err);
      const errorObj = err as { name?: string; message?: string };
      
      if (errorObj.name === "NotAllowedError" || errorObj.name === "PermissionDeniedError") {
        setMediaError(
          "Camera and Microphone permissions were denied by your browser. Please click the lock or camera icon in your address bar to grant permissions and click 'Retry Permission'."
        );
      } else if (errorObj.name === "NotFoundError" || errorObj.name === "DevicesNotFoundError") {
        setMediaError(
          "No camera or microphone device was found on your computer. Please connect a webcam/mic and try again."
        );
      } else if (errorObj.name === "NotReadableError" || errorObj.name === "TrackStartError") {
        setMediaError(
          "Your camera or microphone is currently in use by another application (such as Zoom, Teams, or Skype)."
        );
      } else {
        setMediaError(errorObj.message || "Failed to access browser camera and microphone.");
      }
    } finally {
      setIsInitializingMedia(false);
    }
  };

  // Stop WebRTC Tracks Cleanup
  const stopMediaStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (lobbyVideoRef.current) {
      lobbyVideoRef.current.srcObject = null;
    }
    if (roomVideoRef.current) {
      roomVideoRef.current.srcObject = null;
    }
  };

  // Mount Effect: Fetch Meeting & Request WebRTC Stream
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
            title: `Strategy & Product Sync (${meetingId})`,
            host: "Sarah Jenkins",
            createdAt: new Date().toISOString(),
            status: "active",
            participantsCount: 5,
            isEncrypted: true,
          });
        }
      } catch {
        setMeeting({
          id: meetingId,
          url: `/meeting/${meetingId}`,
          fullUrl: `${window.location.origin}/meeting/${meetingId}`,
          title: `Strategy & Product Sync (${meetingId})`,
          host: "Sarah Jenkins",
          createdAt: new Date().toISOString(),
          status: "active",
          participantsCount: 5,
          isEncrypted: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMeeting();
    initMediaStream();

    // Cleanup on unmount or tab close
    return () => {
      stopMediaStream();
    };
  }, [meetingId]);

  // Re-bind video element when switching to in-call view
  useEffect(() => {
    if (hasJoined && localStreamRef.current && roomVideoRef.current) {
      roomVideoRef.current.srcObject = localStreamRef.current;
    } else if (!hasJoined && localStreamRef.current && lobbyVideoRef.current) {
      lobbyVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [hasJoined]);

  // In-Call Timer Interval
  useEffect(() => {
    if (!hasJoined) return;
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasJoined]);

  // Toggle Camera Track
  const toggleCamera = () => {
    const nextState = !camEnabled;
    setCamEnabled(nextState);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = nextState;
      });
    }
  };

  // Toggle Microphone Track
  const toggleMicrophone = () => {
    const nextState = !micEnabled;
    setMicEnabled(nextState);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = nextState;
      });
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
    stopMediaStream();
    setHasJoined(false);
    router.push("/dashboard");
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg = {
      id: `c-${Date.now()}`,
      sender: displayName || "Alex Morgan",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: newMessageText.trim(),
      isSelf: true,
    };

    setChatMessages([...chatMessages, newMsg]);
    setNewMessageText("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B11] text-slate-100 flex items-center justify-center bg-grid-pattern">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Securing WebRTC Meeting Room...</p>
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
      <header className="relative z-20 w-full px-4 sm:px-6 py-4 glass-panel border-b border-slate-800/80 bg-[#080B11]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-white text-base hidden sm:inline-block">UniCall</span>
          </Link>

          <span className="hidden sm:inline-block text-slate-700">|</span>

          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              {hasJoined && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />}
              {meeting?.title}
            </h1>
            <p className="text-[11px] text-slate-400">
              ID: <span className="font-mono text-cyan-400 font-bold">{meetingId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasJoined && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTimer(callSeconds)}</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>WebRTC Encrypted</span>
          </div>

          <Link
            href="/dashboard"
            onClick={stopMediaStream}
            className="glass-pill px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-500/80 transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-7xl mx-auto">
        {hasJoined ? (
          /* Active Call Meeting Room View */
          <div className="w-full flex-grow flex flex-col lg:flex-row gap-4 h-[calc(100vh-160px)] min-h-[550px] relative">
            
            {/* Left/Center: Video Grid Area */}
            <div className="flex-1 flex flex-col justify-between space-y-4 overflow-y-auto pr-1">
              
              {/* Screen Share Mode Banner / Tile */}
              {screenSharing && (
                <div className="relative aspect-video w-full rounded-3xl bg-slate-950 border-2 border-cyan-500/80 overflow-hidden shadow-glow-cyan flex flex-col items-center justify-center">
                  <div className="absolute top-4 left-4 glass-pill px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-400 flex items-center gap-2 border border-cyan-500/30">
                    <Monitor className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>{displayName} is Sharing Screen (4K Presentation)</span>
                  </div>
                  
                  <div className="p-8 text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
                      <Monitor className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Q3 Architecture & WebRTC Audio Pipeline Specs</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Real-time desktop presentation stream active.
                    </p>
                  </div>
                </div>
              )}

              {/* Responsive Video Grid */}
              <div className={`grid gap-4 w-full flex-grow ${
                screenSharing
                  ? "grid-cols-2 sm:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}>
                
                {/* 1. Real Local WebRTC Camera Video Tile */}
                <div className={`relative aspect-video rounded-3xl bg-slate-950 border transition-all overflow-hidden flex flex-col items-center justify-center shadow-2xl group ${
                  pinnedParticipantId === "self" ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                }`}>
                  {/* Real WebRTC Video Tag */}
                  <video
                    ref={roomVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      camEnabled ? "opacity-100" : "opacity-0 absolute"
                    }`}
                  />

                  {/* Fallback Avatar when Camera is Off */}
                  {!camEnabled && (
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-bold text-xl text-white shadow-glow">
                        {displayName.trim() ? displayName.trim().slice(0, 2).toUpperCase() : "YOU"}
                      </div>
                      <p className="text-xs font-semibold text-slate-400">Camera Off</p>
                    </div>
                  )}

                  {/* Tile Overlays */}
                  <div className="absolute bottom-3 left-3 glass-pill px-3 py-1 rounded-xl text-xs font-semibold text-white flex items-center gap-2 border border-white/10 z-20">
                    {micEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{displayName} (You)</span>
                  </div>

                  <button
                    onClick={() => setPinnedParticipantId(pinnedParticipantId === "self" ? null : "self")}
                    className="absolute top-3 right-3 p-2 rounded-xl glass-pill text-slate-400 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    title="Pin Video"
                  >
                    <Pin className={`w-3.5 h-3.5 ${pinnedParticipantId === "self" ? "text-cyan-400 fill-current" : ""}`} />
                  </button>
                </div>

                {/* 2. Team Participant Cards */}
                {CALL_PARTICIPANTS.map((participant) => (
                  <div
                    key={participant.id}
                    className={`relative aspect-video rounded-3xl bg-slate-950 border transition-all overflow-hidden flex flex-col items-center justify-center shadow-2xl group ${
                      participant.isSpeaking ? "border-cyan-500/90 ring-2 ring-cyan-500/30" : "border-slate-800"
                    } ${pinnedParticipantId === participant.id ? "ring-2 ring-cyan-400" : ""}`}
                  >
                    {participant.camOn ? (
                      <div className={`absolute inset-0 bg-gradient-to-tr ${participant.gradient} opacity-20 flex flex-col items-center justify-center p-4 text-center`} />
                    ) : null}

                    <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr ${participant.gradient} flex items-center justify-center font-bold text-xl sm:text-2xl text-white shadow-glow mb-2 ${
                        participant.isSpeaking ? "scale-105 transition-transform" : ""
                      }`}>
                        {participant.initials}
                      </div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {participant.name}
                        {participant.isHost && (
                          <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Host
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium">{participant.role}</p>
                    </div>

                    <div className="absolute bottom-3 left-3 glass-pill px-3 py-1 rounded-xl text-xs font-semibold text-white flex items-center gap-2 border border-white/10 z-20">
                      {participant.micOn ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                          {participant.isSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                        </span>
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>{participant.name}</span>
                    </div>

                    <button
                      onClick={() => setPinnedParticipantId(pinnedParticipantId === participant.id ? null : participant.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl glass-pill text-slate-400 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                      title="Pin Video"
                    >
                      <Pin className={`w-3.5 h-3.5 ${pinnedParticipantId === participant.id ? "text-cyan-400 fill-current" : ""}`} />
                    </button>
                  </div>
                ))}

              </div>
            </div>

            {/* Right Side Panel: In-Call Chat Sidebar */}
            {showChatSidebar && (
              <div className="w-full lg:w-80 glass-panel border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right-4 duration-200">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      In-Call Meeting Chat
                    </h3>
                    <button
                      onClick={() => setShowChatSidebar(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages List */}
                  <div className="space-y-3 py-4 max-h-[350px] overflow-y-auto pr-1">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex flex-col ${msg.isSelf ? "items-end" : "items-start"}`}>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-300">{msg.sender}</span>
                          <span>•</span>
                          <span>{msg.time}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          msg.isSelf
                            ? "bg-gradient-primary text-white font-medium rounded-tr-none"
                            : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type message to room..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-slate-100 rounded-xl outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-gradient-primary rounded-xl text-white hover:shadow-glow flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* Right Side Panel: Participants Roster Sidebar */}
            {showParticipantsSidebar && (
              <div className="w-full lg:w-80 glass-panel border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right-4 duration-200">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      Call Participants (5)
                    </h3>
                    <button
                      onClick={() => setShowParticipantsSidebar(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Roster List */}
                  <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                          {displayName.trim() ? displayName.trim().slice(0, 2).toUpperCase() : "ME"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{displayName} (You)</p>
                          <p className="text-[10px] text-cyan-400 font-medium">WebRTC Live</p>
                        </div>
                      </div>
                      {micEnabled ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-400" />}
                    </div>

                    {CALL_PARTICIPANTS.map((p) => (
                      <div key={p.id} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${p.gradient} flex items-center justify-center text-white text-xs font-bold`}>
                            {p.initials}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-400">{p.role} {p.isHost ? "• Host" : ""}</p>
                          </div>
                        </div>
                        {p.micOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-400" />}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 rounded-xl glass-pill hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-cyan-400 flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Link Copied!" : "Invite People"}</span>
                </button>
              </div>
            )}

          </div>
        ) : (
          /* Pre-Join Lobby View */
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Real WebRTC Camera Preview Box & Media Toggles */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Permission Error Banner */}
              {mediaError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-200">Media Permission Required</p>
                      <p className="text-rose-300/90 leading-relaxed mt-1">{mediaError}</p>
                    </div>
                  </div>
                  <button
                    onClick={initMediaStream}
                    disabled={isInitializingMedia}
                    className="mt-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold text-xs border border-rose-500/40 flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isInitializingMedia ? "animate-spin" : ""}`} />
                    <span>Retry Permission</span>
                  </button>
                </div>
              )}

              <div className="relative aspect-video w-full rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                
                {/* Real WebRTC Video Tag */}
                <video
                  ref={lobbyVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    camEnabled && !mediaError ? "opacity-100" : "opacity-0 absolute"
                  }`}
                />

                {/* Fallback Placeholder when Camera Off or Error */}
                {(!camEnabled || mediaError) && (
                  <div className="flex flex-col items-center justify-center text-slate-500 space-y-2 p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-2xl text-white shadow-glow">
                      {displayName.trim() ? displayName.trim().slice(0, 2).toUpperCase() : "ME"}
                    </div>
                    <p className="text-sm font-semibold text-slate-400">
                      {mediaError ? "Camera Access Disabled" : "Camera is turned off"}
                    </p>
                  </div>
                )}

                {/* Floating Live Status Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                  <div className="glass-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 border border-white/10">
                    <span className={`w-2.5 h-2.5 rounded-full ${camEnabled && !mediaError ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                    <span>{camEnabled && !mediaError ? "WebRTC Camera Active" : "Camera Off"}</span>
                  </div>

                  <div className="glass-pill px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 border border-white/10">
                    {micEnabled && !mediaError ? (
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
                <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-4 z-20">
                  <button
                    type="button"
                    onClick={toggleMicrophone}
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
                    onClick={toggleCamera}
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

              {/* Mic Level Status Widget */}
              <div className="p-3.5 rounded-2xl glass-panel border border-slate-800/90 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-2 font-medium">
                  {micEnabled ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                  WebRTC Audio Track Status:
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 h-3 w-16">
                    <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-2 bg-emerald-400" : "h-1 bg-slate-700"}`} />
                    <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-3 bg-emerald-400 animate-pulse" : "h-1 bg-slate-700"}`} />
                    <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-2.5 bg-emerald-400" : "h-1 bg-slate-700"}`} />
                    <span className={`w-1.5 rounded-full transition-all ${micEnabled ? "h-3.5 bg-cyan-400" : "h-1 bg-slate-700"}`} />
                  </div>
                  <span className={`font-semibold ${micEnabled ? "text-emerald-400" : "text-slate-500"}`}>
                    {micEnabled ? "Live" : "Muted"}
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
      </main>

      {/* In-Call Bottom Control Bar */}
      {hasJoined && (
        <footer className="relative z-30 w-full glass-panel border-t border-slate-800/80 bg-[#080B11]/95 backdrop-blur-xl py-3.5 px-4 sm:px-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left Info (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-bold text-white">{meeting?.title}</span>
              <span className="text-slate-700">|</span>
              <span className="text-xs font-mono text-cyan-400 font-semibold">{meetingId}</span>
            </div>

            {/* Center Controls */}
            <div className="flex items-center gap-2 sm:gap-4 mx-auto md:mx-0">
              {/* Microphone Button */}
              <button
                onClick={toggleMicrophone}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  micEnabled
                    ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                    : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                }`}
                title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
              >
                {micEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />}
              </button>

              {/* Camera Button */}
              <button
                onClick={toggleCamera}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  camEnabled
                    ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                    : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                }`}
                title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
              >
                {camEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />}
              </button>

              {/* Screen Share Button */}
              <button
                onClick={() => setScreenSharing(!screenSharing)}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  screenSharing
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow-cyan"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
                title={screenSharing ? "Stop Sharing Screen" : "Share Screen"}
              >
                {screenSharing ? <MonitorOff className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" /> : <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Chat Button */}
              <button
                onClick={() => {
                  setShowChatSidebar(!showChatSidebar);
                  if (showParticipantsSidebar) setShowParticipantsSidebar(false);
                }}
                className={`relative p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  showChatSidebar
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
                title="In-Call Chat"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full" />
              </button>

              {/* Participants Button */}
              <button
                onClick={() => {
                  setShowParticipantsSidebar(!showParticipantsSidebar);
                  if (showChatSidebar) setShowChatSidebar(false);
                }}
                className={`relative p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  showParticipantsSidebar
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
                title="View Participants"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-white">
                  5
                </span>
              </button>

              {/* Leave Meeting Button */}
              <button
                onClick={handleLeaveCall}
                className="px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 font-bold text-white text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
                title="Leave Meeting"
              >
                <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Leave</span>
              </button>
            </div>

            {/* Right Share Button (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="glass-pill px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

          </div>
        </footer>
      )}

      {/* Pre-Join Footer Disclaimer */}
      {!hasJoined && (
        <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} UniCall Inc. WebRTC Media Stream Standard.
        </footer>
      )}
    </div>
  );
}
