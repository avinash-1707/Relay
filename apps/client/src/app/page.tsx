"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import RealTime from "@/components/landing/Realtime";
import FinalCTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function App() {
  return (
    <div className="min-h-screen font-sans antialiased overflow-x-hidden" style={{ background: "var(--void)", color: "var(--text)" }}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <RealTime />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
