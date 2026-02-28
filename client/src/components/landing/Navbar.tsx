import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080B11]/80 backdrop-blur-md border-b border-white/5 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7 L6 3 L12 7 L6 11 Z" fill="white" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            Relay
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "Docs", "Pricing"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200 tracking-wide"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden md:block text-sm text-white/50 hover:text-white/90 transition-colors duration-200"
          >
            Sign in
          </a>
          <a
            href="#"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-opacity duration-200"
          >
            Get started
          </a>
        </div>
      </div>
    </motion.header>
  );
}
