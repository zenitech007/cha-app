"use client";

import { Artist } from "../data/artists";

export default function ArtistCard({
  artist,
  onClick,
}: {
  artist: Artist;
  onClick: (a: Artist) => void;
}) {
  return (
    <button
      onClick={() => onClick(artist)}
      className="group relative bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden text-left hover:border-amber-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20 hover:-translate-y-1 w-full"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={artist.image ?? ""}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-stone-950/80 backdrop-blur-sm border border-amber-700/30 text-amber-400 text-xs font-semibold rounded-full tracking-wider">
            {artist.era}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-stone-950/80 backdrop-blur-sm border border-stone-700/50 rounded-full px-2.5 py-1">
          <svg
            className="w-3 h-3 text-amber-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-white text-xs font-semibold">
            {artist.rating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3
          className="text-white text-lg font-bold mb-1 group-hover:text-amber-300 transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {artist.name}
        </h3>
        <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-3">
          <svg
            className="w-3.5 h-3.5 text-amber-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
          <span>{artist.origin}</span>
          <span className="text-stone-700">•</span>
          <svg
            className="w-3 h-3 text-amber-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{artist.active}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {artist.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 bg-amber-900/30 border border-amber-800/30 text-amber-500/80 text-xs rounded-md"
            >
              {g}
            </span>
          ))}
          {artist.genre.length > 2 && (
            <span className="px-2 py-0.5 bg-stone-800 text-stone-500 text-xs rounded-md">
              +{artist.genre.length - 2}
            </span>
          )}
        </div>
        <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
          {artist.biography}
        </p>
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
    </button>
  );
}