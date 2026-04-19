"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSimilarArtists } from "@/app/actions/discovery";

interface SimilarArtist {
  name: string;
  imageUrl: string;
  match: string;
}

export default function SimilarArtists({ currentArtistName }: { currentArtistName: string }) {
  const [similar, setSimilar] = useState<SimilarArtist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSimilar() {
      const results = await getSimilarArtists(currentArtistName);
      setSimilar(results);
      setLoading(false);
    }
    loadSimilar();
  }, [currentArtistName]);

  if (loading) {
    return (
      <div className="mt-16 animate-pulse">
        <div className="h-8 w-48 bg-stone-800 rounded-md mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-40 h-48 bg-stone-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (similar.length === 0) return null;

  return (
    <div className="mt-20 border-t border-stone-800/50 pt-12">
      <div className="flex items-center gap-3 mb-8">
        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          Discover Similar Artists
        </h3>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex overflow-x-auto pb-6 gap-4 sm:gap-6 snap-x snap-mandatory hide-scrollbar">
        {similar.map((artist) => {
          // Convert Last.fm's string match (e.g. "0.85") to a clean percentage ("85%")
          const matchPercent = Math.round(parseFloat(artist.match) * 100);
          
          return (
            <Link 
              key={artist.name} 
              href={`/search?q=${encodeURIComponent(artist.name)}`}
              className="group min-w-40 sm:min-w-45 snap-start relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-linear-to-t from-stone-950 to-stone-900/80">
                <h4 className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                  {artist.name}
                </h4>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-600 rounded-full" 
                      style={{ width: `${matchPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium whitespace-nowrap">
                    {matchPercent}% Match
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}