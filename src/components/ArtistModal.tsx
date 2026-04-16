"use client";

import { useEffect } from "react";
import { Artist } from "../data/artists";

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
}

export default function ArtistModal({ artist, onClose }: ArtistModalProps) {
  useEffect(() => {
    if (artist) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [artist]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!artist) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative z-10 bg-stone-900 border border-stone-700/50 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-stone-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-72 sm:h-80">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-stone-950/70 backdrop-blur-sm border border-stone-700/50 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Artist Name Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-amber-600/30 border border-amber-600/40 text-amber-400 text-xs font-semibold rounded-full tracking-wider">
                {artist.era} Era
              </span>
              {artist.featured && (
                <span className="px-2.5 py-1 bg-stone-950/60 border border-stone-600/40 text-stone-300 text-xs font-semibold rounded-full">
                  ⭐ Featured Artist
                </span>
              )}
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {artist.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Meta Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: "📍", label: "Origin", value: artist.origin },
              { icon: "🎵", label: "Active", value: artist.active },
              { icon: "⭐", label: "Rating", value: `${artist.rating.toFixed(1)} / 5.0` },
            ].map((item) => (
              <div key={item.label} className="bg-stone-800/60 border border-stone-700/30 rounded-xl p-3">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-white font-semibold text-sm flex items-center gap-1.5">
                  <span>{item.icon}</span>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Biography */}
          <div className="mb-8">
            <h3 className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="h-px flex-1 bg-amber-900/50" />
              Biography
              <span className="h-px flex-1 bg-amber-900/50" />
            </h3>
            <p className="text-stone-300 leading-relaxed text-sm">{artist.biography}</p>
          </div>

          {/* Genres */}
          <div className="mb-8">
            <h3 className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {artist.genre.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1.5 bg-amber-900/30 border border-amber-800/40 text-amber-400 text-xs font-semibold rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Albums & Awards Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Notable Albums */}
            <div>
              <h3 className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                </svg>
                Notable Albums
              </h3>
              <ul className="space-y-2">
                {artist.notableAlbums.map((album) => (
                  <li key={album} className="flex items-center gap-2.5 text-stone-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    {album}
                  </li>
                ))}
              </ul>
            </div>

            {/* Awards */}
            <div>
              <h3 className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Awards & Recognition
              </h3>
              <ul className="space-y-2">
                {artist.awards.map((award) => (
                  <li key={award} className="flex items-start gap-2.5 text-stone-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
