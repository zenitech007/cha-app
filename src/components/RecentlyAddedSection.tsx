"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function RecentlyAddedSection({
  artists,
}: {
  artists: {
    id: string;
    slug: string;
    name: string;
    bio: string | null;
    imageUrl: string | null;
  }[];
}) {
  if (artists.length === 0) return null;

  return (
    <section className="bg-stone-950 py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="New Arrivals"
          title="Recently Added"
          subtitle="Fresh additions to the catalog"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 hover:-translate-y-1 block"
            >
              {/* Image */}
              <div className="relative h-44 sm:h-52 overflow-hidden">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    <span className="text-4xl font-bold text-stone-600">
                      {artist.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent" />

                {/* New badge */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-amber-600 text-stone-950 text-xs font-bold rounded-full tracking-wide">
                  NEW
                </div>

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-amber-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 text-stone-950 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3
                  className="text-white text-base font-bold truncate group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {artist.name}
                </h3>
                {artist.bio && (
                  <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mt-1">
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
