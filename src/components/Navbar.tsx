"use client";

import { useState } from "react";

interface NavbarProps {
  onNavClick: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onNavClick, activeSection }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "directory", label: "Directory" },
    { id: "featured", label: "Featured" },
    { id: "about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavClick("home")}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-stone-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <div className="text-amber-400 font-bold text-sm tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                Universal Music
              </div>
              <div className="text-amber-600/70 text-xs tracking-[0.2em] uppercase -mt-0.5">
                Hub
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium tracking-wide transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-amber-600/20 text-amber-400 border border-amber-600/30"
                    : "text-stone-400 hover:text-amber-300 hover:bg-stone-800/60"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavClick("directory")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-sm rounded-full transition-all duration-200 shadow-lg shadow-amber-900/30 hover:shadow-amber-800/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
              Search Artists
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-stone-400 hover:text-amber-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-stone-950 border-t border-amber-900/20 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavClick(item.id); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-amber-600/20 text-amber-400"
                  : "text-stone-400 hover:text-amber-300 hover:bg-stone-800"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { onNavClick("directory"); setMenuOpen(false); }}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-sm rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            Search Artists
          </button>
        </div>
      </div>
    </nav>
  );
}
