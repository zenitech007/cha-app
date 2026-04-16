import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home-client";

export default async function HomePage() {
  // 1. Securely fetch data on the server
  const artists = await prisma.artist.findMany({
    orderBy: { name: "asc" },
  });

  // 2. Pass the data to your beautiful React layout
  return <HomeClient artists={artists} />;
}