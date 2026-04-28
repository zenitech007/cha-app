import Link from "next/link";
import Image from "next/image";
import type { ArtistModel as Artist } from "@/generated/prisma/models/Artist";

interface ArtistShelfProps {
  title: string;
  artists: Artist[];
}

export default function ArtistShelf({ title, artists }: ArtistShelfProps) {
  if (!artists || artists.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        {/* Optional 'Show All' link can go here */}
      </div>
      
      {/* Horizontal Scrollable Container */}
      <div className="flex overflow-x-auto gap-4 px-4 md:px-8 pb-4 scrollbar-hide snap-x">
        {artists.map((artist) => (
          <Link 
            key={artist.id} 
            href={`/artists/${artist.slug}`}
            className="flex-none w-40 md:w-48 group snap-start"
          >
            <div className="flex flex-col gap-3">
              {/* Spotify-style Circular or Rounded Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-lg bg-zinc-800 transition-transform duration-300 group-hover:scale-105">
                {artist.imageUrl ? (
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-4xl font-bold">
                    {artist.name.charAt(0)}
                  </div>
                )}
              </div>
              
              {/* Artist Info */}
              <div className="flex flex-col">
                <span className="text-white font-semibold truncate">
                  {artist.name}
                </span>
                <span className="text-zinc-400 text-sm truncate">
                  Artist
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}