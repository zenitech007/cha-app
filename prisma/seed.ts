import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const artists = [
  {
    slug: "daft-punk",
    name: "Daft Punk",
    bio: "Daft Punk was a French electronic music duo formed in 1993 by Thomas Bangalter and Guy-Manuel de Homem-Christo. Known for their iconic robot helmets, visual presentation, and genre-defining contributions to house, synth-pop, and disco, the duo became one of the most influential acts in modern music history. Their fusion of electronic sounds with funk, disco, and rock redefined the boundaries of dance music across four studio albums. Daft Punk disbanded in February 2021 after nearly three decades together.",
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
    officialWebsite: "https://daftpunk.com",
    originCountry: "FR",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Daft_Punk",
    websiteUrl: "https://daftpunk.com",
    albums: [
      { title: "Homework", releaseYear: 1997, coverUrl: null },
      { title: "Discovery", releaseYear: 2001, coverUrl: null },
      { title: "Human After All", releaseYear: 2005, coverUrl: null },
      { title: "Random Access Memories", releaseYear: 2013, coverUrl: null },
    ],
    charityLinks: [
      {
        organizationName: "Fondation de France",
        donationUrl: "https://www.fondationdefrance.org",
      },
    ],
  },
  {
    slug: "the-beatles",
    name: "The Beatles",
    bio: "The Beatles were an English rock band formed in Liverpool in 1960, comprising John Lennon, Paul McCartney, George Harrison, and Ringo Starr. They are regarded as the most influential band of all time and were integral to the development of 1960s counterculture and the recognition of popular music as an art form. Rooted in skiffle, beat, and 1950s rock 'n' roll, their sound incorporated elements of classical music, psychedelia, and Indian music in innovative ways. They hold the record for most number-one albums on the UK Albums Chart and are the best-selling music act of all time.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    officialWebsite: "https://www.thebeatles.com",
    originCountry: "GB",
    wikipediaUrl: "https://en.wikipedia.org/wiki/The_Beatles",
    websiteUrl: "https://www.thebeatles.com",
    albums: [
      { title: "Please Please Me", releaseYear: 1963, coverUrl: null },
      { title: "A Hard Day's Night", releaseYear: 1964, coverUrl: null },
      { title: "Rubber Soul", releaseYear: 1965, coverUrl: null },
      { title: "Revolver", releaseYear: 1966, coverUrl: null },
      { title: "Sgt. Pepper's Lonely Hearts Club Band", releaseYear: 1967, coverUrl: null },
      { title: "Abbey Road", releaseYear: 1969, coverUrl: null },
      { title: "Let It Be", releaseYear: 1970, coverUrl: null },
    ],
    charityLinks: [
      {
        organizationName: "War Child UK",
        donationUrl: "https://www.warchild.org.uk",
      },
    ],
  },
  {
    slug: "hans-zimmer",
    name: "Hans Zimmer",
    bio: "Hans Florian Zimmer is a German-born film score composer and music producer. He has composed music for over 150 films, including award-winning scores for The Lion King, Gladiator, The Dark Knight trilogy, Inception, Interstellar, and Dune. Zimmer pioneered the integration of electronic music with traditional orchestral arrangements, creating a signature sound that has defined modern cinema. He has received two Academy Awards, four Grammy Awards, and was appointed a Commander of the Order of the British Empire (CBE) in 2024.",
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
    officialWebsite: "https://hanszimmer.com",
    originCountry: "DE",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Hans_Zimmer",
    websiteUrl: "https://hanszimmer.com",
    albums: [
      { title: "The Lion King (Soundtrack)", releaseYear: 1994, coverUrl: null },
      { title: "Gladiator (Soundtrack)", releaseYear: 2000, coverUrl: null },
      { title: "The Dark Knight (Soundtrack)", releaseYear: 2008, coverUrl: null },
      { title: "Inception (Soundtrack)", releaseYear: 2010, coverUrl: null },
      { title: "Interstellar (Soundtrack)", releaseYear: 2014, coverUrl: null },
      { title: "Dune (Soundtrack)", releaseYear: 2021, coverUrl: null },
    ],
    charityLinks: [
      {
        organizationName: "Global Citizen",
        donationUrl: "https://www.globalcitizen.org",
      },
    ],
  },
  {
    slug: "fela-kuti",
    name: "Fela Kuti",
    bio: "Fela Anikulapo Kuti was a Nigerian multi-instrumentalist, bandleader, composer, political activist, and Pan-Africanist who pioneered Afrobeat, a genre blending West African traditional music with American funk and jazz. Performing with his band Africa '70 and later Egypt '80, Fela used his music as a weapon against Nigeria's corrupt military government, enduring beatings, imprisonment, and the destruction of his commune. His fearless artistry and activism made him one of Africa's most iconic and internationally recognized musicians, influencing countless artists worldwide across genres from hip-hop to electronic music.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    officialWebsite: null,
    originCountry: "NG",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fela_Kuti",
    websiteUrl: "https://felakuti.com",
    albums: [
      { title: "Zombie", releaseYear: 1977, coverUrl: null },
      { title: "Expensive Shit", releaseYear: 1975, coverUrl: null },
      { title: "Gentleman", releaseYear: 1973, coverUrl: null },
      { title: "Water No Get Enemy", releaseYear: 1975, coverUrl: null },
      { title: "Sorrow, Tears and Blood", releaseYear: 1977, coverUrl: null },
    ],
    charityLinks: [
      {
        organizationName: "Fela Kuti Foundation",
        donationUrl: "https://felakuti.com/foundation",
      },
    ],
  },
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.charityLink.deleteMany();
  await prisma.event.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  console.log("Database cleared.");

  for (const data of artists) {
    const artist = await prisma.artist.create({
      data: {
        slug: data.slug,
        name: data.name,
        bio: data.bio,
        imageUrl: data.imageUrl,
        officialWebsite: data.officialWebsite,
        originCountry: data.originCountry,
        wikipediaUrl: data.wikipediaUrl,
        websiteUrl: data.websiteUrl,
        albums: {
          create: data.albums,
        },
        charityLinks: {
          create: data.charityLinks,
        },
      },
    });

    console.log(`  Seeded: ${artist.name} (${artist.originCountry}) — ${data.albums.length} albums`);
  }

  console.log(`\nDone! Seeded ${artists.length} global artists.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
