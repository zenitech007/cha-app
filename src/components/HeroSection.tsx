"use client";

import { Play, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection({
  onExplore,
  onFeatured,
  totalArtists,
}: {
  onExplore: () => void;
  onFeatured: () => void;
  totalArtists: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[55vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Live concert landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/70 via-stone-950/50 to-stone-950" />
        <div className="absolute inset-0 bg-linear-to-r from-stone-950/80 via-transparent to-stone-950/60" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-8 opacity-20">
        <svg width="80" height="80" viewBox="0 0 120 120" fill="none" className="text-amber-500">
          <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-8 opacity-10">
        <svg width="120" height="120" viewBox="0 0 200 200" fill="none" className="text-amber-400">
          <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="1" strokeDasharray="3 8" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-600/40 bg-amber-900/20 backdrop-blur-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
            The Premier Global Music Reference
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="block">Universal</span>
          <span className="block text-amber-400 italic">Music</span>
          <span className="block">Hub</span>
        </h1>

        <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
          The definitive global reference for music — artists, discographies,
          and global tours spanning every genre and era.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-6 sm:mb-8">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artists, genres, albums..."
              className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-full bg-stone-900/60 backdrop-blur-md border border-stone-700/50 text-white text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-600/60 focus:ring-1 focus:ring-amber-600/30 transition-all"
            />
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 px-4 sm:px-0">
          <button
            onClick={onFeatured}
            className="group/btn w-full sm:w-auto px-7 py-3.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-full transition-all duration-300 shadow-xl shadow-amber-900/40 hover:shadow-amber-700/50 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Play Featured Mix
          </button>
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-amber-600/50 hover:border-amber-500 text-amber-300 hover:text-amber-200 font-semibold rounded-full transition-all duration-300 hover:bg-amber-900/20 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            Explore Directory
          </button>
        </div>

        {/* Compact Stats */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-stone-500 text-xs tracking-widest uppercase">
          <span><strong className="text-amber-400 font-bold">{totalArtists}+</strong> Artists</span>
          <span><strong className="text-amber-400 font-bold">9+</strong> Genres</span>
          <span><strong className="text-amber-400 font-bold">100+</strong> Years of Music</span>
        </div>
      </div>
    </section>
  );
}
