import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/openai";
import { searchSpotifyArtists } from "@/lib/spotify";
import SiteShell from "@/components/SiteShell";

type SearchParams = Promise<{ q?: string }>;

interface ArtistRow {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  image_url: string | null;
  similarity: number | null;
}

interface MergedResult {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  similarity: number | null;
  source: "local" | "spotify";
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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
      <SiteShell>
        <SearchInner query="">
          <p className="py-12 text-center text-stone-500">
            Enter a search term to find artists.
          </p>
        </SearchInner>
      </SiteShell>
    );
  }

  // Run local DB search and Spotify search in parallel
  const [semanticResults, textResults, spotifyResults] = await Promise.all([
    semanticSearch(query),
    textSearch(query),
    searchSpotifyArtists(query, 10),
  ]);

  // Build local results (prefer semantic if available)
  const isSemanticHit = semanticResults.length > 0;
  const localResults: MergedResult[] = isSemanticHit
    ? semanticResults.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        bio: r.bio,
        imageUrl: r.image_url,
        similarity: r.similarity,
        source: "local" as const,
      }))
    : textResults.map((a) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        bio: a.bio,
        imageUrl: a.imageUrl,
        similarity: null,
        source: "local" as const,
      }));

  // Merge Spotify results, deduplicating by name (case-insensitive)
  const localNames = new Set(localResults.map((r) => r.name.toLowerCase()));

  const spotifyMerged: MergedResult[] = spotifyResults
    .filter((s) => !localNames.has(s.name.toLowerCase()))
    .map((s) => ({
      id: s.spotifyId,
      slug: slugify(s.name),
      name: s.name,
      bio: s.genres.length > 0 ? s.genres.join(", ") : null,
      imageUrl: s.imageUrl,
      similarity: null,
      source: "spotify" as const,
    }));

  const artists = [...localResults, ...spotifyMerged];

  return (
    <SiteShell>
      <SearchInner query={query} isSemantic={isSemanticHit}>
        <div className="mt-10 divide-y divide-stone-800">
          {artists.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-lg text-stone-400">
                No artists found for &ldquo;
                <span className="text-white">{query}</span>&rdquo;
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Try a different spelling or{" "}
                <Link
                  href="/artists"
                  className="underline hover:text-amber-400"
                >
                  browse all artists
                </Link>
                .
              </p>
            </div>
          )}

          {artists.map((artist) => (
            <Link
              key={`${artist.source}-${artist.id}`}
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

              <div className="min-w-0 flex-1">
                <p className="font-medium text-white group-hover:text-amber-400 transition-colors">
                  {artist.name}
                </p>
                {artist.bio && (
                  <p className="mt-0.5 truncate text-sm text-stone-500">
                    {artist.bio}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {artist.similarity !== null && (
                  <span className="font-mono text-xs text-stone-500">
                    {Math.round(artist.similarity * 100)}%
                  </span>
                )}
                {artist.source === "spotify" && (
                  <span className="rounded-full border border-stone-700 px-2 py-0.5 text-xs text-stone-500">
                    Spotify
                  </span>
                )}
                <span className="text-stone-600 transition-transform group-hover:translate-x-1 group-hover:text-amber-500">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </SearchInner>
    </SiteShell>
  );
}

function SearchInner({
  query,
  isSemantic,
  children,
}: {
  query: string;
  isSemantic?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-10 text-sm text-stone-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <span className="mx-2 text-stone-700">/</span>
        <span className="text-stone-200">Search</span>
      </nav>

      <h1
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Search Results
      </h1>

      {query && (
        <div className="mt-3 flex items-center gap-3">
          <p className="text-stone-400">
            Showing results for &ldquo;
            <span className="text-white">{query}</span>&rdquo;
          </p>
          {isSemantic && (
            <span className="rounded-full border border-amber-700/30 bg-amber-900/10 px-2.5 py-0.5 text-xs text-amber-500">
              Vibe Search
            </span>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
