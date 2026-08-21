"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Video, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  X
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate authentication API call and redirect to dashboard
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }, 1000);
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    setForgotSubmitted(true);
    setTimeout(() => {
      setForgotSubmitted(false);
      setShowForgotModal(false);
      setForgotEmail("");
    }, 2500);
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-[#080B11] text-slate-100 selection:bg-blue-600 selection:text-white bg-grid-pattern overflow-hidden">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
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
                v2.0
              </span>
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="glass-pill px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-500/80 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          Back to Home
        </Link>
      </header>

      {/* Main Login Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Glass Card */}
          <div className="glass-panel border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-glass shadow-glow/10 backdrop-blur-xl relative">
            
            {/* Header Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Welcome Back
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Log in to UniCall
              </h1>
              <p className="text-sm text-slate-400">
                Access your HD meeting workspace and team rooms
              </p>
            </div>

            {/* Success Toast */}
            {loginSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <div>
                  <p className="font-semibold">Login Successful!</p>
                  <p className="text-xs text-emerald-300/80">Redirecting to your HD meeting portal...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="name@company.com"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900/80 border ${
                      errors.email ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                    } text-slate-100 placeholder:text-slate-500 rounded-xl text-sm outline-none ring-2 ring-transparent transition-all duration-200`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 py-3 bg-slate-900/80 border ${
                      errors.password ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                    } text-slate-100 placeholder:text-slate-500 rounded-xl text-sm outline-none ring-2 ring-transparent transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-300 select-none group">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                    formData.rememberMe 
                      ? "bg-cyan-500 border-cyan-500 text-white" 
                      : "border-slate-700 bg-slate-900 group-hover:border-slate-500"
                  }`}>
                    {formData.rememberMe && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-slate-300">Remember me on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-primary shadow-glow hover:shadow-glow-cyan transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Navigation Link */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Create free account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative shadow-2xl">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-5">
              Enter your email address and we&apos;ll send you a link to reset your account password.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Reset link sent! Please check your email inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder:text-slate-500 rounded-xl text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-white bg-gradient-primary text-xs hover:shadow-glow"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Footer Disclaimer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} UniCall Inc. All rights reserved. Enterprise-grade encryption.
      </footer>
    </div>
  );
}
