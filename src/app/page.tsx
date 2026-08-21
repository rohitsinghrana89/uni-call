import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoPreview from "@/components/VideoPreview";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080B11] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Section Stream */}
      <main className="flex-grow">
        <Hero />
        <VideoPreview />
        <Features />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
