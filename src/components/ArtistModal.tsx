"use client";

import { useEffect } from "react";

interface ArtistModalProps {
  artist: any | null;
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
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative z-10 bg-stone-900 border border-stone-700/50 rounded-t-3xl sm:rounded-3xl overflow-hidden w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl shadow-stone-950"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative h-56 sm:h-72 md:h-80">
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-stone-800 flex items-center justify-center">
              <svg className="w-20 h-20 sm:w-24 sm:h-24 text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>
          )}
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
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
            {artist.originCountry && (
              <span className="inline-block px-2.5 py-1 bg-amber-600/30 border border-amber-600/40 text-amber-400 text-xs font-semibold rounded-full tracking-wider mb-2">
                {artist.originCountry}
              </span>
            )}
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {artist.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Biography */}
          {artist.bio && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-amber-900/50" />
                Biography
                <span className="h-px flex-1 bg-amber-900/50" />
              </h3>
              <p className="text-stone-300 leading-relaxed text-sm whitespace-pre-line">{artist.bio}</p>
            </div>
          )}

          {/* Links */}
          {(artist.officialWebsite || artist.websiteUrl || artist.wikipediaUrl) && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">Links</h3>
              <div className="flex flex-wrap gap-3">
                {(artist.officialWebsite || artist.websiteUrl) && (
                  <a
                    href={artist.officialWebsite || artist.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-amber-500 hover:text-amber-400 text-sm transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    Official Website
                  </a>
                )}
                {artist.wikipediaUrl && (
                  <a
                    href={artist.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-amber-500 hover:text-amber-400 text-sm transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    Wikipedia
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
