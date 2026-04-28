"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function FeaturedSection({
  artists,
}: {
  artists: any[];
}) {
  const [main, ...rest] = artists.slice(0, 4);

  return (
    <section className="bg-stone-950 py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Hall of Honor" title="Featured Artists" />

        {/* Main Featured */}
        {main && (
          <Link
            href={`/artists/${main.slug}`}
            className="group block w-full mb-6 relative overflow-hidden rounded-3xl bg-stone-900/80 backdrop-blur-sm border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 relative h-72 md:h-auto overflow-hidden">
                {main.imageUrl ? (
                  <img
                    src={main.imageUrl}
                    alt={main.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center min-h-72">
                    <svg className="w-20 h-20 text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-stone-900 hidden md:block" />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-transparent md:hidden" />
              </div>
              <div className="md:w-3/5 p-5 sm:p-8 md:p-10 text-left flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs font-bold rounded-full tracking-wider">
                    Featured
                  </span>
                  {/* Play All button */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 text-stone-950 text-xs font-bold rounded-full tracking-wider hover:bg-amber-500 transition-colors">
                    <Play className="w-3 h-3" />
                    Play All
                  </span>
                </div>

                <h3
                  className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {main.name}
                </h3>

                {/* Genre pills */}
                {main.genres && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(typeof main.genres === "string" ? main.genres.split(",") : [])
                      .slice(0, 4)
                      .map((g: string) => g.trim())
                      .filter(Boolean)
                      .map((genre: string) => (
                        <span
                          key={genre}
                          className="px-2.5 py-0.5 bg-stone-800 border border-stone-700/50 text-stone-400 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                  </div>
                )}

                {main.bio && (
                  <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {main.bio}
                  </p>
                )}

                {/* View top songs link */}
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-amber-500 font-semibold text-sm group-hover:text-amber-400 transition-colors">
                    View Full Profile
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Secondary Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {rest.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 hover:-translate-y-1 text-left block"
            >
              <div className="relative h-48 overflow-hidden">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    <svg className="w-12 h-12 text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-transparent" />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-amber-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-4 h-4 text-stone-950 ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3
                  className="text-white text-xl font-bold mb-1 group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {artist.name}
                </h3>
                {artist.bio && (
                  <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                    {artist.bio}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
