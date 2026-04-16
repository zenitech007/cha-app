"use client";

import { Artist } from "../data/artists";

export default function FeaturedSection({
  artists,
  onArtistClick,
}: {
  artists: Artist[];
  onArtistClick: (a: Artist) => void;
}) {
  const featured = artists.filter((a) => a.featured);
  const [main, ...rest] = featured;

  return (
    <section className="bg-stone-950 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-amber-900/50" />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/30 bg-amber-900/10 mb-2">
              <svg
                className="w-3.5 h-3.5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">
                Hall of Honor
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Artists
            </h2>
          </div>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-amber-900/50" />
        </div>

        {/* Main Featured */}
        {main && (
          <button
            onClick={() => onArtistClick(main)}
            className="group w-full mb-6 relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 relative h-72 md:h-auto overflow-hidden">
                <img
                  src={main.image ?? ""}
                  alt={main.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-stone-900 hidden md:block" />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-transparent md:hidden" />
              </div>
              <div className="md:w-3/5 p-8 md:p-10 text-left flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs font-bold rounded-full tracking-wider">
                    ⭐ Featured
                  </span>
                  <span className="px-3 py-1 bg-stone-800 border border-stone-700 text-stone-400 text-xs font-semibold rounded-full">
                    {main.era} Era
                  </span>
                </div>
                <h3
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {main.name}
                </h3>
                <div className="flex items-center gap-3 text-stone-500 text-sm mb-5">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-amber-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    {main.origin}
                  </span>
                  <span className="text-stone-700">•</span>
                  <span>{main.active}</span>
                  <span className="text-stone-700">•</span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {main.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-stone-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {main.biography}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {main.genre.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 bg-amber-900/30 border border-amber-800/30 text-amber-500/80 text-xs rounded-md"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm group-hover:text-amber-400 transition-colors">
                  View Full Profile
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
            </div>
          </button>
        )}

        {/* Secondary Featured */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((artist) => (
            <button
              key={artist.id}
              onClick={() => onArtistClick(artist)}
              className="group relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 hover:-translate-y-1 text-left"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={artist.image ?? ""}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-600/30 backdrop-blur-sm border border-amber-600/40 rounded-full px-2.5 py-1">
                  <svg
                    className="w-3 h-3 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-amber-300 text-xs font-semibold">
                    {artist.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="text-amber-700 text-xs font-semibold tracking-wider uppercase mb-1">
                  {artist.era}
                </div>
                <h3
                  className="text-white text-xl font-bold mb-1 group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {artist.name}
                </h3>
                <p className="text-stone-500 text-xs mb-3">
                  {artist.origin} · {artist.active}
                </p>
                <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                  {artist.biography}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}