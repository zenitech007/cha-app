"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { getRegionalArtists } from "@/app/actions/discovery";

interface RegionalArtist {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  originCountry: string | null;
}

export default function RegionalShowcase() {
  const [artists, setArtists] = useState<RegionalArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const continent = tz.split("/")[0];
        setRegion(continent);
        const results = await getRegionalArtists(tz);
        setArtists(results as RegionalArtist[]);
      } catch {
        // silent
      }
      setLoading(false);
    }
    load();
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  if (!loading && artists.length === 0) return null;

  if (loading) {
    return (
      <section className="bg-stone-950 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 w-56 bg-stone-800 rounded-md mb-6" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-44 h-56 bg-stone-900 rounded-2xl shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-stone-950 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with scroll arrows */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <h2
              className="text-xl sm:text-2xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Artists from {region}
            </h2>
          </div>

          {/* Scroll arrows — desktop only */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-amber-600/50 flex items-center justify-center text-stone-400 hover:text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-stone-700 hover:border-amber-600/50 flex items-center justify-center text-stone-400 hover:text-white transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-4 gap-4 sm:gap-6 snap-x snap-mandatory hide-scrollbar"
        >
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group min-w-48 sm:min-w-52 snap-start relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:-translate-y-1 shrink-0"
            >
              <div className="aspect-square w-full overflow-hidden relative">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    <span className="text-3xl font-bold text-stone-600">
                      {artist.name.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-stone-950/30">
                  <div className="w-10 h-10 rounded-full bg-amber-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-4 h-4 text-stone-950 ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                  {artist.name}
                </h4>
                {artist.originCountry && (
                  <span className="mt-1 inline-block text-xs text-stone-500">
                    {artist.originCountry}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
