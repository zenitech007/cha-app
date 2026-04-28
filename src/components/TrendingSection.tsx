"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function TrendingSection({
  artists,
}: {
  artists: {
    id: string;
    slug: string;
    name: string;
    imageUrl: string | null;
    genres: string;
  }[];
}) {
  if (artists.length === 0) return null;

  return (
    <section className="bg-stone-950 py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader badge="Trending Now" title="Hot Right Now" align="left" />

        <div className="flex overflow-x-auto gap-5 sm:gap-6 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group shrink-0 snap-start flex flex-col items-center gap-3 w-32 sm:w-36"
            >
              {/* Circular image */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-stone-800 group-hover:border-amber-600/60 transition-all duration-300 shadow-lg group-hover:shadow-amber-900/30">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-stone-600">
                      {artist.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-stone-950/40">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-stone-950 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Name */}
              <span className="text-sm font-semibold text-white text-center truncate w-full group-hover:text-amber-400 transition-colors">
                {artist.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
