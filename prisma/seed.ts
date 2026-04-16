import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const artist = await prisma.artist.upsert({
    where: { slug: "george-strait" },
    update: {},
    create: {
      slug: "george-strait",
      name: "George Strait",
      bio: "George Harvey Strait Sr. is an American country music singer, songwriter, actor, and music producer. Dubbed the 'King of Country', Strait is one of the most influential and popular recording artists of all time.",
      imageUrl: null,
      officialWebsite: "https://www.georgestrait.com",
      albums: {
        create: [
          {
            title: "Strait Out of the Box",
            releaseYear: 1995,
            coverUrl: null,
          },
        ],
      },
      events: {
        create: [
          {
            venue: "NRG Stadium — Houston Rodeo",
            location: "Houston, TX",
            date: new Date("2026-03-15T19:00:00"),
            ticketUrl: "https://www.rodeohouston.com",
          },
        ],
      },
      charityLinks: {
        create: [
          {
            organizationName: "Homes For Our Troops",
            donationUrl: "https://www.hfotusa.org",
          },
        ],
      },
    },
  });

  console.log(`Seeded artist: ${artist.name} (${artist.slug})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
