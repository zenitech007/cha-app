import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { albums: true, events: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <nav className="mb-10 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Artists</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Artist Directory
      </h1>
      <p className="mt-3 text-muted">
        Browse the complete Country Heritage Alliance catalog.
      </p>

      <div className="mt-10 divide-y divide-border">
        {artists.length === 0 && (
          <p className="py-8 text-muted">
            No artists found. Seed the database to get started.
          </p>
        )}

        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/artists/${artist.slug}`}
            className="group flex items-center gap-5 py-5 transition-colors hover:bg-surface"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-base font-semibold text-muted">
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
              <p className="font-medium group-hover:underline">
                {artist.name}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {artist._count.albums} album{artist._count.albums !== 1 && "s"}
                {" \u00B7 "}
                {artist._count.events} show{artist._count.events !== 1 && "s"}
              </p>
            </div>

            <span className="shrink-0 text-muted transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
