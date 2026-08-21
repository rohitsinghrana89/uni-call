"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Video, Menu, X, ChevronRight, LogIn, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { getStoredUser, clearStoredUser, getUserInitials, UserSession } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    setCurrentUser(null);
    router.push("/login");
  };

  const displayName = currentUser?.name || "";
  const displayInitials = getUserInitials(currentUser?.name);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-[#080B11]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-primary shadow-glow transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow-cyan">
              <Video className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                UniCall
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v2.0
                </span>
              </span>
              <span className="text-xs text-slate-400 tracking-wide font-medium">Enterprise HD Meetings</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#solutions" className="hover:text-white transition-colors duration-200">
              Solutions
            </a>
            <a href="#security" className="hover:text-white transition-colors duration-200 flex items-center gap-1.5">
              Security
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                E2EE
              </span>
            </a>
            <Link href="/dashboard" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors duration-200 flex items-center gap-1">
              Dashboard
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-pill hover:bg-slate-800/60 border border-slate-700/80 transition-all text-xs font-semibold text-white"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-glow">
                    {displayInitials}
                  </div>
                  <span className="text-slate-200 truncate max-w-[120px]">{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Log In Link */}
                <Link
                  href="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white glass-pill hover:bg-white/10 transition-all duration-200 flex items-center gap-2 border border-slate-700/60 hover:border-slate-500/80 active:scale-95"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  Log In
                </Link>

                {/* Sign Up / Start Meeting Button */}
                <Link
                  href="/signup"
                  className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-primary shadow-glow hover:shadow-glow-cyan transition-all duration-300 active:scale-95 flex items-center"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
                    Sign Up
                    <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white glass-pill focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 bg-[#080B11]/95 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {currentUser && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {displayInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">{displayName}</span>
                <span className="text-xs text-slate-400">{currentUser.email}</span>
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-3 font-medium text-slate-300 text-base">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white"
            >
              Features
            </a>
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white"
            >
              Solutions
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white flex items-center justify-between"
            >
              Security
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">E2EE</span>
            </a>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800/60 hover:text-white flex items-center gap-2 text-cyan-400"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>
          
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-3 rounded-xl text-center font-semibold text-rose-400 glass-pill hover:bg-rose-500/10 border border-rose-500/20 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl text-center font-semibold text-slate-200 glass-pill hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  Log In
                </Link>
                
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl text-center font-semibold text-white bg-gradient-primary shadow-glow flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
