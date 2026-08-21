"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Copy,
  Check,
  Search,
  Bell,
  LogOut,
  ShieldCheck,
  HardDrive,
  VideoOff,
  Mic,
  MicOff,
  History as HistoryIcon,
  LayoutDashboard,
  Settings,
  Sparkles,
  Play,
  FileText,
  X,
  Menu,
  ChevronRight,
  Share2
} from "lucide-react";

// Mock Upcoming Meetings Data
const INITIAL_UPCOMING = [
  {
    id: "meet-101",
    title: "Q3 Product Strategy & Roadmap Alignment",
    time: "Today, 4:00 PM - 5:00 PM",
    date: "Today",
    code: "unicall.app/meet/prd-strat-901",
    participants: 6,
    avatars: ["/avatars/u1.jpg", "/avatars/u2.jpg", "/avatars/u3.jpg"],
    isHost: true,
  },
  {
    id: "meet-102",
    title: "Engineering Architecture Review & E2EE Specs",
    time: "Tomorrow, 10:30 AM - 11:30 AM",
    date: "Tomorrow",
    code: "unicall.app/meet/eng-arch-442",
    participants: 4,
    avatars: ["/avatars/u4.jpg", "/avatars/u5.jpg"],
    isHost: false,
  },
  {
    id: "meet-103",
    title: "Design System & UI/UX Component Audit",
    time: "Aug 24, 2:00 PM - 3:00 PM",
    date: "Aug 24",
    code: "unicall.app/meet/ui-audit-881",
    participants: 8,
    avatars: ["/avatars/u1.jpg", "/avatars/u3.jpg"],
    isHost: true,
  },
];

// Mock Recent Meetings Data
const RECENT_MEETINGS = [
  {
    id: "hist-201",
    title: "Weekly All-Hands & Executive Sync",
    date: "Yesterday at 3:15 PM",
    duration: "45 mins",
    participants: 24,
    recordingAvailable: true,
    transcriptAvailable: true,
  },
  {
    id: "hist-202",
    title: "Client Onboarding - Acme Global Corp",
    date: "Aug 19 at 11:00 AM",
    duration: "28 mins",
    recordingAvailable: true,
    transcriptAvailable: true,
  },
  {
    id: "hist-203",
    title: "Sprint Planning & Standup",
    date: "Aug 18 at 9:30 AM",
    duration: "15 mins",
    recordingAvailable: false,
    transcriptAvailable: true,
  },
];

// Mock Meeting History Data
const MEETING_HISTORY = [
  {
    id: "h-1",
    title: "Global Sales Sync Q3",
    date: "2026-08-20",
    time: "15:00",
    duration: "52m 14s",
    host: "Alex Morgan (You)",
    participants: 18,
    recordingUrl: "https://unicall.app/rec/rec-90812",
    status: "Completed",
  },
  {
    id: "h-2",
    title: "Security & Compliance Audit",
    date: "2026-08-19",
    time: "11:00",
    duration: "34m 02s",
    host: "Sarah Jenkins",
    participants: 6,
    recordingUrl: "https://unicall.app/rec/rec-88219",
    status: "Completed",
  },
  {
    id: "h-3",
    title: "Frontend Performance Optimization",
    date: "2026-08-18",
    time: "14:30",
    duration: "41m 50s",
    host: "Alex Morgan (You)",
    participants: 5,
    recordingUrl: "https://unicall.app/rec/rec-77123",
    status: "Completed",
  },
  {
    id: "h-4",
    title: "AI Noise Suppression Demo",
    date: "2026-08-17",
    time: "16:00",
    duration: "22m 10s",
    host: "David Chen",
    participants: 12,
    recordingUrl: "https://unicall.app/rec/rec-66104",
    status: "Completed",
  },
  {
    id: "h-5",
    title: "1-on-1 Mentorship & Career Feedback",
    date: "2026-08-15",
    time: "10:00",
    duration: "30m 00s",
    host: "Alex Morgan (You)",
    participants: 2,
    recordingUrl: "",
    status: "Completed",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "upcoming" | "recent" | "history" | "settings">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Join Meeting state
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // New Instant Meeting Modal state
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatedRoomCode] = useState("unicall.app/meet/unicall-hd-8921");

  // Schedule Modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    title: "",
    date: "",
    time: "",
    duration: "45",
  });
  const [upcomingMeetings, setUpcomingMeetings] = useState(INITIAL_UPCOMING);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Filtered History
  const filteredHistory = MEETING_HISTORY.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.host.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinError("Please enter a meeting code or link");
      return;
    }
    setJoinError("");
    setIsJoining(true);
    setTimeout(() => {
      setIsJoining(false);
      alert(`Joining meeting room: ${joinCode.trim()} with 4K HD Video and Spatial Audio!`);
      setJoinCode("");
    }, 1000);
  };

  const handleCopyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleData.title || !scheduleData.date || !scheduleData.time) {
      alert("Please fill in all meeting details.");
      return;
    }

    const newMeeting = {
      id: `meet-${Date.now()}`,
      title: scheduleData.title,
      time: `${scheduleData.date}, ${scheduleData.time}`,
      date: scheduleData.date,
      code: `unicall.app/meet/${scheduleData.title.toLowerCase().replace(/\s+/g, "-").slice(0, 10)}-${Math.floor(100 + Math.random() * 900)}`,
      participants: 1,
      avatars: ["/avatars/u1.jpg"],
      isHost: true,
    };

    setUpcomingMeetings([newMeeting, ...upcomingMeetings]);
    setScheduleSuccess(true);
    setTimeout(() => {
      setScheduleSuccess(false);
      setShowScheduleModal(false);
      setScheduleData({ title: "", date: "", time: "", duration: "45" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col md:flex-row selection:bg-blue-600 selection:text-white bg-grid-pattern relative overflow-x-hidden">
      
      {/* Background Glow Blobs */}
      <div className="fixed top-10 left-60 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Mobile Top Navbar */}
      <div className="md:hidden sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-[#080B11]/90 px-4 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-primary shadow-glow">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-lg">UniCall</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl text-slate-300 glass-pill focus:outline-none"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-72 glass-panel border-r border-slate-800/80 bg-[#080B11]/95 md:bg-[#080B11]/70 backdrop-blur-xl flex flex-col justify-between p-5 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-glow group-hover:scale-105 transition-transform">
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
                    Pro
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Enterprise Portal</span>
              </div>
            </Link>
          </div>

          {/* Sidebar Navigation */}
          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab("upcoming"); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "upcoming"
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Upcoming Calls</span>
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-cyan-300 font-bold border border-blue-500/30">
                {upcomingMeetings.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("recent"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "recent"
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Recent Meetings</span>
            </button>

            <button
              onClick={() => { setActiveTab("history"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "history"
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
            >
              <HistoryIcon className="w-4 h-4" />
              <span>Meeting History</span>
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings & Audio</span>
            </button>
          </nav>

          {/* Storage & Encryption Widget */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                Cloud Recording
              </span>
              <span className="font-semibold text-white">14.2 / 50 GB</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full w-[28%]" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3 h-3" /> E2EE Active
              </span>
              <span className="text-cyan-400 hover:underline cursor-pointer">Upgrade Plan</span>
            </div>
          </div>
        </div>

        {/* User Profile Widget at Bottom */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between p-2 rounded-2xl glass-pill hover:bg-slate-800/40 transition-all">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-glow text-sm">
                  AM
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#080B11] rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white leading-tight">Alex Morgan</span>
                <span className="text-xs text-slate-400 truncate max-w-[130px]">alex@company.com</span>
              </div>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 space-y-8 relative z-10">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-3xl border border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>4K Ultra HD Engine & Spatial Audio Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, Alex 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your HD video rooms, schedule team conferences, and access recordings.
            </p>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetings..."
                className="pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 outline-none w-56"
              />
            </div>

            {/* Notifications Bell */}
            <button className="relative p-2.5 rounded-xl glass-pill hover:bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-white transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-500 rounded-full" />
            </button>

            {/* Quick Schedule Button */}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="glass-pill border border-slate-700/80 hover:border-slate-500 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Schedule Call</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Views */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Quick Action Grid (New Meeting & Join Meeting) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Box: New Meeting Launch Button Card */}
              <div className="lg:col-span-6 glass-panel border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-glass relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-full pointer-events-none" />
                
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Start Instant HD Meeting</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Create an instant 4K meeting room with one click. Invite teammates using a secure encrypted link.
                  </p>
                </div>

                <button
                  onClick={() => setShowNewMeetingModal(true)}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-primary shadow-glow hover:shadow-glow-cyan transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm group"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                  <span>New Instant Meeting</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform ml-auto" />
                </button>
              </div>

              {/* Right Box: Join Meeting Input Card */}
              <div className="lg:col-span-6 glass-panel border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-glass relative">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Join an Existing Meeting</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Enter a meeting code or invitation link to join a live video conference instantly.
                  </p>
                </div>

                <form onSubmit={handleJoinMeeting} className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Enter code (e.g. unicall.app/meet/abc-123)"
                      className="w-full pl-4 pr-24 py-3.5 bg-slate-900/90 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 placeholder:text-slate-500 rounded-xl text-xs sm:text-sm outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isJoining}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-700"
                    >
                      {isJoining ? (
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Join</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                  {joinError && <p className="text-xs text-rose-400 font-medium">{joinError}</p>}
                </form>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel border border-slate-800/80 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-medium mb-1">Total Meetings</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  34
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">+12%</span>
                </div>
              </div>
              <div className="glass-panel border border-slate-800/80 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-medium mb-1">HD Call Time</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                  52.4 hrs
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">4K Ultra</span>
                </div>
              </div>
              <div className="glass-panel border border-slate-800/80 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-medium mb-1">Cloud Storage</div>
                <div className="text-2xl font-bold text-white">14.2 GB</div>
              </div>
              <div className="glass-panel border border-slate-800/80 p-5 rounded-2xl">
                <div className="text-xs text-slate-400 font-medium mb-1">Encryption Spec</div>
                <div className="text-2xl font-bold text-emerald-400 flex items-center gap-1.5 text-base sm:text-xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  AES-256 Bit
                </div>
              </div>
            </div>

            {/* Upcoming Meetings Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Upcoming Meetings
                </h3>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  View All ({upcomingMeetings.length})
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingMeetings.slice(0, 3).map((meeting) => (
                  <div
                    key={meeting.id}
                    className="glass-panel border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {meeting.time}
                        </span>
                        {meeting.isHost && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Host
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-100 text-base line-clamp-2">
                        {meeting.title}
                      </h4>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Participants:</span>
                        <span className="font-semibold text-slate-200">{meeting.participants} Members</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => alert(`Starting meeting: ${meeting.title}`)}
                          className="flex-1 py-2 rounded-xl bg-gradient-primary text-white text-xs font-semibold hover:shadow-glow transition-all flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Start Call
                        </button>
                        <button
                          onClick={() => handleCopyMeetingLink(meeting.code)}
                          className="p-2 rounded-xl glass-pill hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Meetings Log */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Recent Sessions
                </h3>
              </div>

              <div className="glass-panel border border-slate-800/80 rounded-2xl divide-y divide-slate-800/80 overflow-hidden">
                {RECENT_MEETINGS.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.duration}</span>
                          <span>•</span>
                          <span>{item.participants} Participants</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {item.recordingAvailable && (
                        <button
                          onClick={() => alert(`Playing cloud recording for: ${item.title}`)}
                          className="px-3 py-1.5 rounded-lg glass-pill text-xs text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-1.5 font-medium"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Recording
                        </button>
                      )}
                      {item.transcriptAvailable && (
                        <button
                          onClick={() => alert(`Downloading AI transcript for: ${item.title}`)}
                          className="px-3 py-1.5 rounded-lg glass-pill text-xs text-slate-300 hover:bg-slate-800 border border-slate-800 flex items-center gap-1.5 font-medium"
                        >
                          <FileText className="w-3 h-3 text-slate-400" />
                          Transcript
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Upcoming Meetings */}
        {activeTab === "upcoming" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Upcoming Scheduled Calls</h2>
                <p className="text-xs text-slate-400">View and manage all your upcoming video conferences</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-primary shadow-glow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule New Meeting
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="glass-panel border border-slate-800/90 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {meeting.time}
                    </span>
                    <span className="text-xs text-slate-400">{meeting.participants} Expected</span>
                  </div>
                  <h3 className="font-bold text-white text-lg">{meeting.title}</h3>
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
                    <span className="truncate max-w-[240px] font-mono">{meeting.code}</span>
                    <button
                      onClick={() => handleCopyMeetingLink(meeting.code)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => alert(`Launching room: ${meeting.title}`)}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-primary text-white text-xs font-semibold hover:shadow-glow flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Meeting Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Recent Meetings */}
        {activeTab === "recent" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Meeting Sessions</h2>
              <p className="text-xs text-slate-400">Review meeting logs, recordings, and AI noise logs</p>
            </div>

            <div className="glass-panel border border-slate-800/80 rounded-2xl divide-y divide-slate-800/80">
              {RECENT_MEETINGS.map((item) => (
                <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-400">{item.date} • {item.duration} • {item.participants} Participants</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alert(`Rejoining room: ${item.title}`)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
                    >
                      Rejoin Room
                    </button>
                    {item.recordingAvailable && (
                      <button
                        onClick={() => alert(`Playing recording for: ${item.title}`)}
                        className="px-4 py-2 rounded-xl bg-gradient-primary text-xs font-semibold text-white shadow-glow flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Watch Recording
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Meeting History Table */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Full Meeting History</h2>
                <p className="text-xs text-slate-400">Searchable log of all past conferences and cloud archives</p>
              </div>
            </div>

            <div className="glass-panel border border-slate-800/80 rounded-2xl overflow-hidden shadow-glass">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                      <th className="py-4 px-6">Meeting Name</th>
                      <th className="py-4 px-6">Date & Time</th>
                      <th className="py-4 px-6">Duration</th>
                      <th className="py-4 px-6">Host</th>
                      <th className="py-4 px-6">Attendees</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                    {filteredHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">{row.title}</td>
                        <td className="py-4 px-6 text-slate-400">{row.date} at {row.time}</td>
                        <td className="py-4 px-6">{row.duration}</td>
                        <td className="py-4 px-6">{row.host}</td>
                        <td className="py-4 px-6">{row.participants} Users</td>
                        <td className="py-4 px-6 text-right">
                          {row.recordingUrl ? (
                            <button
                              onClick={() => alert(`Opening recording: ${row.recordingUrl}`)}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs inline-flex items-center gap-1"
                            >
                              <Play className="w-3 h-3 fill-current" /> Play Rec
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs">No Recording</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Settings */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-white">Audio & Video Settings</h2>
              <p className="text-xs text-slate-400">Configure your hardware devices, spatial audio, and AI noise suppression</p>
            </div>

            <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">Camera Device</h3>
                <select className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none">
                  <option>Integrated Ultra HD Camera (4K 60fps)</option>
                  <option>External WebCam HD Pro</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider text-slate-300">Microphone & Audio</h3>
                <select className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none">
                  <option>Default High-Definition Microphone Array</option>
                  <option>Studio USB Microphone</option>
                </select>

                <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-xs">AI Smart Noise Suppression</h4>
                    <p className="text-[11px] text-slate-400">Filter background keyboard noise, dogs, and echo in real-time</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500" />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* New Instant Meeting Modal */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-6">
            <button
              onClick={() => setShowNewMeetingModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center shadow-glow">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Your Instant Meeting is Ready</h3>
              <p className="text-xs text-slate-400">Share this secure link to invite participants</p>
            </div>

            {/* Link Box */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-2">
              <span className="text-xs text-cyan-300 font-mono truncate">{generatedRoomCode}</span>
              <button
                onClick={() => handleCopyMeetingLink(generatedRoomCode)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1 border border-cyan-500/20"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Quick Audio/Video Toggle */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  micEnabled ? "bg-slate-800 border-slate-700 text-white" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
                title={micEnabled ? "Mute Mic" : "Unmute Mic"}
              >
                {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setCamEnabled(!camEnabled)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  camEnabled ? "bg-slate-800 border-slate-700 text-white" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                }`}
                title={camEnabled ? "Turn Off Camera" : "Turn On Camera"}
              >
                {camEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={() => {
                alert(`Starting HD Video Meeting Room: ${generatedRoomCode}`);
                setShowNewMeetingModal(false);
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-primary shadow-glow hover:shadow-glow-cyan text-sm flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Meeting Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl space-y-5">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">Schedule Video Conference</h3>
            
            {scheduleSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Meeting scheduled successfully! Added to your dashboard.</span>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Meeting Title</label>
                  <input
                    type="text"
                    value={scheduleData.title}
                    onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
                    placeholder="e.g. Q3 Design Review"
                    required
                    className="w-full p-3 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                      required
                      className="w-full p-3 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Time</label>
                    <input
                      type="time"
                      value={scheduleData.time}
                      onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                      required
                      className="w-full p-3 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-primary shadow-glow hover:shadow-glow-cyan"
                >
                  Confirm & Schedule
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
