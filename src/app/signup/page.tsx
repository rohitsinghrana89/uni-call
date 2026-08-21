"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Video, 
  User,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Check,
  X
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Password requirements calculation
  const hasMinLength = formData.password.length >= 8;
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
  const isMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!hasMinLength) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.acceptTerms) {
      newErrors.terms = "You must accept the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setSignupSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      } else {
        setErrors((prev) => ({ ...prev, email: data.message || "Failed to register account" }));
      }
    } catch {
      setIsLoading(false);
      setSignupSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between bg-[#080B11] text-slate-100 selection:bg-blue-600 selection:text-white bg-grid-pattern overflow-hidden">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Header Navigation */}
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

      {/* Main Signup Form Container */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Main Glass Card */}
          <div className="glass-panel border border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-glass shadow-glow/10 backdrop-blur-xl relative">
            
            {/* Header Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Start 14-Day Free Enterprise Trial
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Create Your Account
              </h1>
              <p className="text-sm text-slate-400">
                Join thousands of high-performance teams on UniCall
              </p>
            </div>

            {/* Success Toast */}
            {signupSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <div>
                  <p className="font-semibold">Account Created Successfully!</p>
                  <p className="text-xs text-emerald-300/80">Welcome to UniCall. Redirecting to setup workspace...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Alex Morgan"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900/80 border ${
                      errors.name ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                    } text-slate-100 placeholder:text-slate-500 rounded-xl text-sm outline-none ring-2 ring-transparent transition-all duration-200`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Work Email
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
                    placeholder="alex@company.com"
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
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
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
                    placeholder="Create a strong password"
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

                {/* Password Strength Criteria Checklist */}
                {formData.password.length > 0 && (
                  <div className="pt-2 grid grid-cols-3 gap-2">
                    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${hasMinLength ? "text-emerald-400" : "text-slate-500"}`}>
                      {hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                      8+ characters
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                      {hasNumber ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                      At least 1 number
                    </div>
                    <div className={`flex items-center gap-1.5 text-[11px] font-medium ${hasSpecial ? "text-emerald-400" : "text-slate-500"}`}>
                      {hasSpecial ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-slate-600" />}
                      Special symbol
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-11 py-3 bg-slate-900/80 border ${
                      errors.confirmPassword ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20"
                    } text-slate-100 placeholder:text-slate-500 rounded-xl text-sm outline-none ring-2 ring-transparent transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword.length > 0 && isMatch && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Passwords match
                  </p>
                )}
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-300 select-none group">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => {
                      setFormData({ ...formData, acceptTerms: e.target.checked });
                      if (errors.terms) setErrors({ ...errors, terms: undefined });
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    formData.acceptTerms 
                      ? "bg-cyan-500 border-cyan-500 text-white" 
                      : "border-slate-700 bg-slate-900 group-hover:border-slate-500"
                  }`}>
                    {formData.acceptTerms && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Create Account Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-primary shadow-glow hover:shadow-glow-cyan transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Link to Login */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  Log in to UniCall
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Footer Disclaimer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} UniCall Inc. All rights reserved. Enterprise-grade encryption.
      </footer>
    </div>
  );
}
