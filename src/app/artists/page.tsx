import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SiteShell from "@/components/SiteShell";

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { albums: true, events: true } },
    },
  });

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <nav className="mb-10 text-sm text-stone-500">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-stone-700">/</span>
          <span className="text-stone-200">Artists</span>
        </nav>

        <h1
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Artist Directory
        </h1>
        <p className="mt-3 text-stone-400">
          Browse the complete Universal Music Hub catalog.
        </p>

        <div className="mt-10 divide-y divide-stone-800">
          {artists.length === 0 && (
            <p className="py-8 text-stone-500">
              No artists found. Search for an artist to get started.
            </p>
          )}

          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group flex items-center gap-5 py-5 transition-colors hover:bg-stone-900/50 rounded-lg px-3 -mx-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-800 text-base font-semibold text-stone-400">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  artist.name.charAt(0)
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-white group-hover:text-amber-400 transition-colors">
                  {artist.name}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {artist._count.albums} album{artist._count.albums !== 1 && "s"}
                  {" \u00B7 "}
                  {artist._count.events} show{artist._count.events !== 1 && "s"}
                </p>
              </div>

              <span className="shrink-0 text-stone-600 transition-transform group-hover:translate-x-1 group-hover:text-amber-500">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
