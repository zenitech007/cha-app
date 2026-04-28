import { prisma } from "@/lib/prisma";
import { getArtistGenresBatch } from "@/lib/spotify";
import HomeClient from "@/components/home-client";

const premiumCategories = [
  {
    title: "Legends of Rock",
    match: /rock|classic\s?rock|metal|alternative|punk|grunge|hardcore/i,
    icon: "\uD83C\uDFB8",
    gradient: "from-red-900/50 via-stone-900/80 to-stone-900",
  },
  {
    title: "Electronic Pioneers",
    match: /electro|dance|house|techno|edm|trance|dubstep|synth/i,
    icon: "\uD83C\uDFDB",
    gradient: "from-violet-900/50 via-stone-900/80 to-stone-900",
  },
  {
    title: "Masters of Classical & Score",
    match: /classical|soundtrack|score|orchestra|symphony|chamber|opera/i,
    icon: "\uD83C\uDFBB",
    gradient: "from-blue-900/50 via-stone-900/80 to-stone-900",
  },
  {
    title: "Global Sounds & Afrobeat",
    match: /global|world|afro|reggae|dancehall|ska|latin|highlife|amapiano/i,
    icon: "\uD83C\uDF0D",
    gradient: "from-green-900/50 via-stone-900/80 to-stone-900",
  },
  {
    title: "Pop & Contemporary Icons",
    match: /pop|r&b|rnb|contemporary|soul|neo[\s-]?soul/i,
    icon: "\u2B50",
    gradient: "from-amber-900/50 via-stone-900/80 to-stone-900",
  },
];

export default async function HomePage() {
  const [allArtists, hallOfFame, recentlyAdded, topAlbums] = await Promise.all([
    prisma.artist.findMany({ orderBy: { name: "asc" } }),
    prisma.artist.findMany({
      where: { isFeatured: true },
      orderBy: { name: "asc" },
    }),
    prisma.artist.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.album.findMany({
      include: { artist: { select: { name: true, slug: true } } },
      orderBy: { releaseYear: "desc" },
      take: 12,
    }),
  ]);

  // Fetch live genres from Spotify for all artists in parallel.
  // Falls back to the DB genres string if Spotify returns nothing.
  const artistNames = allArtists.map((a) => a.name);
  const spotifyGenresMap = await getArtistGenresBatch(artistNames).catch(
    () => new Map<string, string[]>(),
  );

  // Enrich each artist with live Spotify genres (or fall back to DB value)
  const enrichedArtists = allArtists.map((artist) => {
    const liveGenres = spotifyGenresMap.get(artist.name.toLowerCase());
    const genreString =
      liveGenres && liveGenres.length > 0
        ? liveGenres.join(", ")
        : artist.genres ?? "";
    return { ...artist, genres: genreString };
  });

  // Map artists into the 5 premium buckets using live genre data
  const categoryBlocks = premiumCategories
    .map(({ title, match, icon, gradient }) => {
      const matched = enrichedArtists.filter((a) => {
        if (!a.genres) return false;
        return a.genres.split(",").some((g) => match.test(g.trim()));
      });
      return { title, artists: matched, icon, gradient };
    })
    .filter(({ artists }) => artists.length > 0);

  // Derive trending: featured first, then recently created, deduplicated
  const featuredIds = new Set(hallOfFame.map((a) => a.id));
  const trendingArtists = [
    ...hallOfFame,
    ...enrichedArtists.filter((a) => !featuredIds.has(a.id)),
  ].slice(0, 10);

  return (
    <HomeClient
      artists={enrichedArtists}
      hallOfFame={hallOfFame}
      categoryBlocks={categoryBlocks}
      recentlyAdded={recentlyAdded}
      topAlbums={topAlbums}
      trendingArtists={trendingArtists}
    />
  );
}
