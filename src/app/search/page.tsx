import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/openai";

type SearchParams = Promise<{ q?: string }>;

interface ArtistRow {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  image_url: string | null;
  similarity: number | null;
}

async function semanticSearch(query: string): Promise<ArtistRow[]> {
  try {
    const vector = await generateEmbedding(query);
    const vectorStr = `[${vector.join(",")}]`;

    const results = await prisma.$queryRawUnsafe<ArtistRow[]>(
      `SELECT id, slug, name, bio, image_url,
              1 - (embedding <=> $1::vector) AS similarity
       FROM artists
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT 12`,
      vectorStr,
    );

    return results;
  } catch {
    return [];
  }
}

async function textSearch(query: string) {
  return prisma.artist.findMany({
    where: { name: { contains: query, mode: "insensitive" } },
    orderBy: { name: "asc" },
    take: 12,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (!query) {
    return (
      <SearchShell query="">
        <p className="py-12 text-center text-muted">
          Enter a search term to find artists.
        </p>
      </SearchShell>
    );
  }

  // Try semantic search first, fall back to text search
  const semanticResults = await semanticSearch(query);

  const isSemanticHit = semanticResults.length > 0;

  // Normalise into a common shape
  const artists: {
    id: string;
    slug: string;
    name: string;
    bio: string | null;
    imageUrl: string | null;
    similarity: number | null;
  }[] = isSemanticHit
    ? semanticResults.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        bio: r.bio,
        imageUrl: r.image_url,
        similarity: r.similarity,
      }))
    : (await textSearch(query)).map((a) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        bio: a.bio,
        imageUrl: a.imageUrl,
        similarity: null,
      }));

  return (
    <SearchShell query={query} isSemantic={isSemanticHit}>
      <div className="mt-10 divide-y divide-border">
        {artists.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted">
              No artists found for &ldquo;
              <span className="text-foreground">{query}</span>&rdquo;
            </p>
            <p className="mt-2 text-sm text-muted">
              Try a different spelling or{" "}
              <Link
                href="/artists"
                className="underline hover:text-foreground"
              >
                browse all artists
              </Link>
              .
            </p>
          </div>
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

            <div className="min-w-0 flex-1">
              <p className="font-medium group-hover:underline">
                {artist.name}
              </p>
              {artist.bio && (
                <p className="mt-0.5 truncate text-sm text-muted">
                  {artist.bio}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {artist.similarity !== null && (
                <span className="font-mono text-xs text-muted">
                  {Math.round(artist.similarity * 100)}%
                </span>
              )}
              <span className="text-muted transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </SearchShell>
  );
}

function SearchShell({
  query,
  isSemantic,
  children,
}: {
  query: string;
  isSemantic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <nav className="mb-10 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Search</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Search Results
      </h1>

      {query && (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-muted">
            Showing results for &ldquo;
            <span className="text-foreground">{query}</span>&rdquo;
          </p>
          {isSemantic && (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
              Vibe Search
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
