"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import RealTime from "@/components/landing/Realtime";
import TechStack from "@/components/landing/TechStack";
import FinalCTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function App() {
  return (
    <div className="bg-[#080B11] text-white min-h-screen font-sans antialiased overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <RealTime />
        <TechStack />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
