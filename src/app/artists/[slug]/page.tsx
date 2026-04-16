import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getArtistEvents } from "@/lib/ticketmaster";
import { searchSpotifyArtist, getRelatedArtists } from "@/lib/spotify";
import { CharityDrawer } from "@/components/charity-drawer";

type Params = Promise<{ slug: string }>;

async function getRelatedInDb(artistName: string, currentId: string) {
  try {
    const spotifyArtist = await searchSpotifyArtist(artistName);
    if (!spotifyArtist) return [];

    const relatedNames = await getRelatedArtists(spotifyArtist.spotifyId);
    if (relatedNames.length === 0) return [];

    return prisma.artist.findMany({
      where: {
        id: { not: currentId },
        name: { in: relatedNames, mode: "insensitive" },
      },
      select: { slug: true, name: true, imageUrl: true },
      take: 12,
    });
  } catch {
    return [];
  }
}

export default async function ArtistPage({ params }: { params: Params }) {
  const { slug } = await params;

  const artist = await prisma.artist.findUnique({
    where: { slug },
    include: {
      albums: { orderBy: { releaseYear: "desc" } },
      charityLinks: { orderBy: { organizationName: "asc" } },
    },
  });

  if (!artist) notFound();

  const [liveEvents, relatedArtists] = await Promise.all([
    getArtistEvents(artist.name),
    getRelatedInDb(artist.name, artist.id),
  ]);

  const hasCharity = artist.charityLinks.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-muted">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/artists" className="hover:text-foreground">
          Artists
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{artist.name}</span>
      </nav>

      {/* ── Header ── */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-surface text-3xl font-bold text-muted">
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {artist.name}
          </h1>
          {artist.officialWebsite && (
            <a
              href={artist.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-muted underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
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
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            {artist.bio}
          </p>
        </section>
      )}

      {/* ── Charity Spotlight (inline banner after bio) ── */}
      {hasCharity && (
        <div className="mt-8 max-w-3xl rounded-lg border border-border bg-surface/50 px-6 py-5">
          <CharityDrawer
            artistName={artist.name}
            charityLinks={artist.charityLinks.map((l) => ({
              organizationName: l.organizationName,
              donationUrl: l.donationUrl,
            }))}
          />
        </div>
      )}

      {/* ── Discography ── */}
      {artist.albums.length > 0 && (
        <section className="mt-14">
          <SectionHeading>Discography</SectionHeading>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artist.albums.map((album) => (
              <div
                key={album.id}
                className="rounded-lg border border-border p-5"
              >
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="mb-4 aspect-square w-full rounded object-cover"
                  />
                ) : (
                  <div className="mb-4 flex aspect-square w-full items-center justify-center rounded bg-surface text-4xl font-bold text-border">
                    &#9835;
                  </div>
                )}
                <p className="font-medium">{album.title}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {album.releaseYear}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Upcoming Shows (Live from Ticketmaster) ── */}
      <section className="mt-14">
        <SectionHeading>Upcoming Shows</SectionHeading>
        {liveEvents.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-widest text-muted">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Event</th>
                  <th className="pb-3 pr-4 font-medium">Venue</th>
                  <th className="pb-3 pr-4 font-medium">Location</th>
                  <th className="pb-3 font-medium">Tickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {liveEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="whitespace-nowrap py-4 pr-4 font-mono text-xs">
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
                    <td className="py-4 pr-4 font-medium">{event.name}</td>
                    <td className="py-4 pr-4 text-muted">{event.venue}</td>
                    <td className="py-4 pr-4 text-muted">{event.city}</td>
                    <td className="py-4">
                      {event.ticketUrl ? (
                        <a
                          href={event.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                        >
                          Buy Tickets &rarr;
                        </a>
                      ) : (
                        <span className="text-muted">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-6 text-muted">No upcoming shows announced.</p>
        )}
      </section>

      {/* ── Similar Artists on CHA ── */}
      {relatedArtists.length > 0 && (
        <section className="mt-14">
          <SectionHeading>Similar Artists on CHA</SectionHeading>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedArtists.map((related) => (
              <Link
                key={related.slug}
                href={`/artists/${related.slug}`}
                className="group flex flex-col items-center gap-3 rounded-lg border border-border p-5 transition-colors hover:bg-surface"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-xl font-semibold text-muted group-hover:bg-border/30">
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
                <span className="text-center text-sm font-medium group-hover:underline">
                  {related.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Sticky floating pill (bottom-right) ── */}
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
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-medium uppercase tracking-widest text-muted">
      {children}
    </h2>
  );
}
