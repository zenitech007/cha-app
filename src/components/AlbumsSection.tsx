"use client";

import Link from "next/link";
import { Disc3 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function AlbumsSection({
  albums,
}: {
  albums: {
    id: string;
    title: string;
    releaseYear: number;
    coverUrl: string | null;
    artist: { name: string; slug: string };
  }[];
}) {
  if (albums.length === 0) return null;

  return (
    <section className="bg-stone-950 py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Discography"
          title="Top Albums"
          subtitle="Explore the greatest albums from our catalog"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/artists/${album.artist.slug}`}
              className="group block"
            >
              {/* Cover */}
              <div className="relative aspect-square rounded-xl overflow-hidden border border-stone-800 group-hover:border-amber-700/40 transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:shadow-amber-900/20 mb-3">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    <Disc3 className="w-10 h-10 text-stone-600" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/30 transition-colors duration-300" />

                {/* Year badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-stone-950/80 backdrop-blur-sm rounded-full text-xs text-stone-400 font-mono">
                  {album.releaseYear}
                </div>
              </div>

              {/* Info */}
              <h4 className="text-white text-sm font-semibold truncate group-hover:text-amber-400 transition-colors">
                {album.title}
              </h4>
              <p className="text-stone-500 text-xs truncate">
                {album.artist.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
