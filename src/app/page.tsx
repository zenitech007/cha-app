import { prisma } from "@/lib/prisma";
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

  // Map artists into the 5 premium buckets
  const categoryBlocks = premiumCategories
    .map(({ title, match }) => {
      const matched = allArtists.filter((a) => {
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
