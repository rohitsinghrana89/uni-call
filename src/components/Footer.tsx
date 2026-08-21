import { Video, Github, Twitter, Linkedin, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#05070B] border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                  UniCall
                </span>
              </a>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Next-generation 4K video conferencing, spatial audio, and AI noise suppression engineered for modern distributed teams.
              </p>
            </div>

            {/* Live Status Pill */}
            <div className="mt-6 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 font-mono text-[11px]">99.99% Latency OK</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  4K HD Video
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Spatial Audio
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  AI Noise Cancellation
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Live Transcripts
                </a>
              </li>
              <li>
                <a href="#preview" className="hover:text-white transition-colors">
                  Meeting Preview
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div id="solutions">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Remote Engineering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Design Reviews
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Enterprise Teams
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Education & Webinars
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Healthcare (HIPAA)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About UniCall
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-white transition-colors flex items-center gap-1.5">
                  Security & SOC2
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Sales
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>© {new Date().getFullYear()} UniCall Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
