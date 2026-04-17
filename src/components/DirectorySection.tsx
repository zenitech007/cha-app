"use client";

import { useState, useMemo } from "react";
import ArtistCard from "./ArtistCard";

interface DirectorySectionProps {
  artists: any[];
  onArtistClick: (artist: any) => void;
}

export default function DirectorySection({ artists, onArtistClick }: DirectorySectionProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "newest">("name");

  const filtered = useMemo(() => {
    let result = [...artists];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.bio && a.bio.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [artists, search, sortBy]);

  return (
    <section className="bg-stone-950 py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/30 bg-amber-900/10 mb-4">
            <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Artist Directory</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Browse All Artists
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto">
            Search our comprehensive database of artists spanning genres, eras, and continents worldwide.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 text-white placeholder-stone-500 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-amber-600/60 focus:ring-1 focus:ring-amber-600/30 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-37.5">
              <label className="text-stone-500 text-xs uppercase tracking-wider mb-1.5 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "newest")}
                className="w-full bg-stone-800 border border-stone-700 text-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-600/60 transition-all"
              >
                <option value="name">Name A-Z</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-stone-500 text-sm">
            Showing <span className="text-amber-400 font-semibold">{filtered.length}</span> of{" "}
            <span className="text-stone-400">{artists.length}</span> artists
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-amber-600 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear search
            </button>
          )}
        </div>

        {/* Artist Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onClick={onArtistClick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎸</div>
            <h3 className="text-white font-semibold text-lg mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No artists found
            </h3>
            <p className="text-stone-500 text-sm">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
