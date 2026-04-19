import { prisma } from "@/lib/prisma";
import { getArtistGenresBatch } from "@/lib/spotify";
import HomeClient from "@/components/home-client";

const premiumCategories = [
  {
    title: "Legends of Rock",
    match: /rock|classic\s?rock|metal|alternative|punk|grunge|hardcore/i,
  },
  {
    title: "Electronic Pioneers",
    match: /electro|dance|house|techno|edm|trance|dubstep/i,
  },
  {
    title: "Masters of Classical & Score",
    match: /classical|soundtrack|score|orchestra|symphony|chamber|opera/i,
  },
  {
    title: "Global Sounds & Afrobeat",
    match: /global|world|afro|reggae|dancehall|ska|latin|highlife|amapiano/i,
  },
  {
    title: "Pop & Contemporary Icons",
    match: /pop|r&b|rnb|contemporary|soul|neo[\s-]?soul/i,
  },
];

export default async function HomePage() {
  const [allArtists, hallOfFame] = await Promise.all([
    prisma.artist.findMany({ orderBy: { name: "asc" } }),
    prisma.artist.findMany({
      where: { isFeatured: true },
      orderBy: { name: "asc" },
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
    .map(({ title, match }) => {
      const matched = enrichedArtists.filter((a) => {
        if (!a.genres) return false;
        return a.genres.split(",").some((g) => match.test(g.trim()));
      });
      return { title, artists: matched };
    })
    .filter(({ artists }) => artists.length > 0);

  return (
    <HomeClient
      artists={allArtists}
      hallOfFame={hallOfFame}
      categoryBlocks={categoryBlocks}
    />
  );
}
