import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/openai";
import {
  searchSpotifyArtist,
  getArtistAlbums,
  getArtistTopTracks,
  type SpotifyTopTrack,
} from "@/lib/spotify";
import { fetchLastFmBio } from "@/lib/lastfm";
import { fetchMusicBrainzData } from "@/lib/musicbrainz";
import { getArtistEvents, type TicketmasterEvent } from "@/lib/ticketmaster";
import { CharityDrawer } from "@/components/charity-drawer";
import SimilarArtists from "@/components/SimilarArtists";
import SiteShell from "@/components/SiteShell";

type Params = Promise<{ slug: string }>;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ── Self-Populating Orchestrator ──────────────────────────

async function autoPopulateArtist(slug: string) {
  const searchQuery = slug.replace(/-/g, " ");

  const [spotifyResult, lastfmResult, mbResult] = await Promise.all([
    searchSpotifyArtist(searchQuery).catch(() => null),
    fetchLastFmBio(searchQuery).catch(() => ({ bio: null })),
    fetchMusicBrainzData(searchQuery).catch(() => ({
      country: null,
      wikipediaUrl: null,
      officialWebsite: null,
    })),
  ]);

  if (!spotifyResult) return null;

  const spotifyAlbums = await getArtistAlbums(spotifyResult.spotifyId).catch(
    () => [],
  );

  const canonicalSlug = slugify(spotifyResult.name);

  const existing = await prisma.artist.findUnique({
    where: { slug: canonicalSlug },
    include: {
      albums: { orderBy: { releaseYear: "desc" } },
      charityLinks: { orderBy: { organizationName: "asc" } },
    },
  });

  if (existing) return existing;

  const artist = await prisma.artist.create({
    data: {
      slug: canonicalSlug,
      name: spotifyResult.name,
      bio: lastfmResult.bio || null,
      imageUrl: spotifyResult.imageUrl,
      officialWebsite: mbResult.officialWebsite || null,
      originCountry: mbResult.country || null,
      wikipediaUrl: mbResult.wikipediaUrl || null,
      websiteUrl: mbResult.officialWebsite || null,
      genres: spotifyResult.genres.length > 0
        ? spotifyResult.genres.join(", ")
        : null,
      albums:
        spotifyAlbums.length > 0
          ? {
              create: spotifyAlbums.map((a) => ({
                title: a.title,
                releaseYear: a.releaseYear,
                coverUrl: a.coverUrl,
              })),
            }
          : undefined,
    },
    include: {
      albums: { orderBy: { releaseYear: "desc" } },
      charityLinks: { orderBy: { organizationName: "asc" } },
    },
  });

  try {
    const embeddingText = [spotifyResult.name, lastfmResult.bio]
      .filter(Boolean)
      .join(" — ");
    const vector = await generateEmbedding(embeddingText);
    const vectorStr = `[${vector.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `UPDATE artists SET embedding = $1::vector WHERE id = $2`,
      vectorStr,
      artist.id,
    );
  } catch {
    console.error("Failed to generate embedding for", spotifyResult.name);
  }

  return artist;
}

// ── Related Artists Helper ────────────────────────────────

async function getRelatedInDb(artistName: string, currentId: string) {
  try {
    const apiKey = process.env.LASTFM_API_KEY;
    if (!apiKey) return [];

    const params = new URLSearchParams({
      method: "artist.getsimilar",
      artist: artistName,
      api_key: apiKey,
      format: "json",
      limit: "20",
    });

    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?${params}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];

    const data = await res.json();
    const similarNames: string[] = (data?.similarartists?.artist ?? []).map(
      (a: any) => a.name as string,
    );
    if (similarNames.length === 0) return [];

    return prisma.artist.findMany({
      where: {
        id: { not: currentId },
        name: { in: similarNames, mode: "insensitive" },
      },
      select: { slug: true, name: true, imageUrl: true },
      take: 12,
    });
  } catch {
    return [];
  }
}

// ── Page Component ────────────────────────────────────────

export default async function ArtistPage({ params }: { params: Params }) {
  const { slug } = await params;

  let artist = await prisma.artist.findUnique({
    where: { slug },
    include: {
      albums: { orderBy: { releaseYear: "desc" } },
      charityLinks: { orderBy: { organizationName: "asc" } },
    },
  });

  if (!artist) {
    artist = await autoPopulateArtist(slug);
  }

  if (!artist) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <nav className="mb-10 text-sm text-stone-500">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <span className="mx-2 text-stone-700">/</span>
            <Link href="/artists" className="hover:text-amber-400 transition-colors">Artists</Link>
            <span className="mx-2 text-stone-700">/</span>
            <span className="text-stone-200">Not Found</span>
          </nav>
          <h1
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Artist Not Found
          </h1>
          <p className="mt-4 text-stone-400">
            We couldn&apos;t find an artist matching &ldquo;
            <span className="text-white">{slug.replace(/-/g, " ")}</span>
            &rdquo; in our database or on Spotify.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            &larr; Try a different search
          </Link>
        </div>
      </SiteShell>
    );
  }

  const spotifyArtist = await searchSpotifyArtist(artist.name).catch(
    () => null,
  );

  const [liveEvents, topTracks, relatedArtists] = await Promise.all([
    getArtistEvents(artist.name),
    spotifyArtist
      ? getArtistTopTracks(spotifyArtist.spotifyId)
      : ([] as SpotifyTopTrack[]),
    getRelatedInDb(artist.name, artist.id),
  ]);

  const hasCharity = artist.charityLinks.length > 0;

  return (
    <SiteShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-10 text-sm text-stone-500">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span className="mx-2 text-stone-700">/</span>
          <Link href="/artists" className="hover:text-amber-400 transition-colors">Artists</Link>
          <span className="mx-2 text-stone-700">/</span>
          <span className="text-stone-200">{artist.name}</span>
        </nav>

        {/* ── Header ── */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-stone-800 text-3xl font-bold text-stone-500">
            {artist.imageUrl ? (
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              artist.name.charAt(0)
            )}
          </div>

          <div>
            <h1
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {artist.name}
            </h1>
            {artist.originCountry && (
              <span className="mt-2 inline-block px-2.5 py-1 bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs font-semibold rounded-full tracking-wider">
                {artist.originCountry}
              </span>
            )}
            {artist.officialWebsite && (
              <a
                href={artist.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-amber-500 underline decoration-amber-800 underline-offset-4 transition-colors hover:text-amber-400"
              >
                {artist.officialWebsite.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            )}
          </div>
        </header>

        {/* ── Bio ── */}
        {artist.bio && (
          <section className="mt-14">
            <SectionHeading>Biography</SectionHeading>
            <p className="mt-4 max-w-3xl leading-relaxed text-stone-400">
              {artist.bio}
            </p>
          </section>
        )}

        {/* ── Charity Spotlight ── */}
        {hasCharity && (
          <div className="mt-8 max-w-3xl rounded-lg border border-stone-800 bg-stone-900/50 px-6 py-5">
            <CharityDrawer
              artistName={artist.name}
              charityLinks={artist.charityLinks.map((l) => ({
                organizationName: l.organizationName,
                donationUrl: l.donationUrl,
              }))}
            />
          </div>
        )}

        {/* ── Top Tracks ── */}
        <TopTracksSection tracks={topTracks} />

        {/* ── Discography ── */}
        {artist.albums.length > 0 && (
          <section className="mt-14">
            <SectionHeading>Discography</SectionHeading>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artist.albums.map((album) => (
                <div
                  key={album.id}
                  className="rounded-2xl border border-stone-800 bg-stone-900 p-5 hover:border-amber-700/40 transition-colors"
                >
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="mb-4 aspect-square w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="mb-4 flex aspect-square w-full items-center justify-center rounded-lg bg-stone-800 text-4xl font-bold text-stone-600">
                      &#9835;
                    </div>
                  )}
                  <p className="font-medium text-white">{album.title}</p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    {album.releaseYear}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Live on Tour ── */}
        <LiveOnTourSection events={liveEvents} />

        {/* ── Similar Artists on CHA ── */}
        {relatedArtists.length > 0 && (
          <section className="mt-14">
            <SectionHeading>Similar Artists on CHA</SectionHeading>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedArtists.map((related) => (
                <Link
                  key={related.slug}
                  href={`/artists/${related.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-stone-800 bg-stone-900 p-5 transition-all hover:border-amber-700/40 hover:-translate-y-1"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-800 text-xl font-semibold text-stone-500 group-hover:bg-stone-700">
                    {related.imageUrl ? (
                      <img
                        src={related.imageUrl}
                        alt={related.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      related.name.charAt(0)
                    )}
                  </div>
                  <span className="text-center text-sm font-medium text-white group-hover:text-amber-400 transition-colors">
                    {related.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Discover Similar Artists (Last.fm) ── */}
        <SimilarArtists currentArtistName={artist.name} />

        {/* ── Sticky floating pill ── */}
        {hasCharity && (
          <div className="fixed bottom-6 right-6 z-40">
            <CharityDrawer
              artistName={artist.name}
              charityLinks={artist.charityLinks.map((l) => ({
                organizationName: l.organizationName,
                donationUrl: l.donationUrl,
              }))}
            />
          </div>
        )}
      </div>
    </SiteShell>
  );
}

// ── Top Tracks Section ────────────────────────────────────

function TopTracksSection({ tracks }: { tracks: SpotifyTopTrack[] }) {
  if (tracks.length === 0) return null;

  return (
    <section className="mt-14">
      <SectionHeading>Top Tracks</SectionHeading>
      <div className="mt-6 space-y-3">
        {tracks.map((track, i) => (
          <div
            key={`${track.name}-${i}`}
            className="flex items-center gap-4 rounded-xl border border-stone-800 bg-stone-900 p-4 hover:border-amber-700/30 transition-colors"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-stone-800">
              {track.albumCoverUrl ? (
                <img
                  src={track.albumCoverUrl}
                  alt={track.albumName}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <span className="text-lg text-stone-600">&#9835;</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight text-white">{track.name}</p>
              <p className="mt-0.5 truncate text-sm text-stone-500">
                {track.albumName}
              </p>
            </div>

            {track.previewUrl ? (
              <audio
                controls
                src={track.previewUrl}
                className="h-8 w-48 shrink-0"
                preload="none"
              />
            ) : (
              <span className="shrink-0 text-xs text-stone-600">
                No preview
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Live on Tour Section ──────────────────────────────────

function LiveOnTourSection({ events }: { events: TicketmasterEvent[] }) {
  if (events.length === 0) return null;

  return (
    <section className="mt-14">
      <SectionHeading>Live on Tour</SectionHeading>
      <div className="mt-6 overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-900 text-xs uppercase tracking-widest text-stone-500">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Event</th>
              <th className="px-5 py-3 font-medium">Venue</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Tickets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-stone-900/50 transition-colors">
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-stone-400">
                  {event.date
                    ? new Date(
                        event.date + "T00:00:00",
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "TBA"}
                </td>
                <td className="px-5 py-4 font-medium text-white">{event.name}</td>
                <td className="px-5 py-4 text-stone-400">{event.venue}</td>
                <td className="px-5 py-4 text-stone-400">{event.city}</td>
                <td className="px-5 py-4">
                  {event.ticketUrl ? (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-amber-500"
                    >
                      Buy Tickets &rarr;
                    </a>
                  ) : (
                    <span className="text-stone-600">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── Section Heading ───────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-amber-500">
      <span className="h-px flex-1 bg-amber-900/50" />
      {children}
      <span className="h-px flex-1 bg-amber-900/50" />
    </h2>
  );
}
