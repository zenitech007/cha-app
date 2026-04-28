"use client";

import Link from "next/link";
import { Play } from "lucide-react";

export default function ArtistCard({
  artist,
}: {
  artist: any;
}) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group relative bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden text-left hover:border-amber-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 hover:-translate-y-1 w-full block"
    >
      <div className="relative h-56 overflow-hidden">
        {artist.imageUrl ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-stone-800 flex items-center justify-center">
            <svg className="w-16 h-16 text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-transparent" />

        {/* Play overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-amber-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-stone-950 ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3
          className="text-white text-lg font-bold mb-1 group-hover:text-amber-300 transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {artist.name}
        </h3>
        {artist.bio && (
          <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mb-4">
            {artist.bio}
          </p>
        )}
        <div className="mt-4 flex items-center gap-1.5 text-amber-600 text-xs font-semibold group-hover:text-amber-400 transition-colors">
          View Full Profile
          <svg
            className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
