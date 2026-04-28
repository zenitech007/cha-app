import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the database connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const artists = [
  {
    slug: "daft-punk",
    name: "Daft Punk",
    genres: "electronic, house, dance, edm",
    isFeatured: true,
    bio: "Daft Punk was a French electronic music duo formed in 1993 by Thomas Bangalter and Guy-Manuel de Homem-Christo. Known for their iconic robot helmets, visual presentation, and genre-defining contributions to house, synth-pop, and disco, the duo became one of the most influential acts in modern music history. Their fusion of electronic sounds with funk, disco, and rock redefined the boundaries of dance music across four studio albums. Daft Punk disbanded in February 2021 after nearly three decades together.",
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
    officialWebsite: "https://daftpunk.com",
    originCountry: "FR",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Daft_Punk",
    websiteUrl: "https://daftpunk.com",
    albums: [
      { title: "Homework", releaseYear: 1997 },
      { title: "Discovery", releaseYear: 2001 },
      { title: "Human After All", releaseYear: 2005 },
      { title: "Random Access Memories", releaseYear: 2013 },
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
    genres: "rock, classic rock, alternative",
    isFeatured: true,
    bio: "The Beatles were an English rock band formed in Liverpool in 1960, comprising John Lennon, Paul McCartney, George Harrison, and Ringo Starr. They are regarded as the most influential band of all time and were integral to the development of 1960s counterculture and the recognition of popular music as an art form. Rooted in skiffle, beat, and 1950s rock 'n' roll, their sound incorporated elements of classical music, psychedelia, and Indian music in innovative ways. They hold the record for most number-one albums on the UK Albums Chart and are the best-selling music act of all time.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    officialWebsite: "https://www.thebeatles.com",
    originCountry: "GB",
    wikipediaUrl: "https://en.wikipedia.org/wiki/The_Beatles",
    websiteUrl: "https://www.thebeatles.com",
    albums: [
      { title: "Please Please Me", releaseYear: 1963 },
      { title: "A Hard Day's Night", releaseYear: 1964 },
      { title: "Rubber Soul", releaseYear: 1965 },
      { title: "Revolver", releaseYear: 1966 },
      { title: "Sgt. Pepper's Lonely Hearts Club Band", releaseYear: 1967 },
      { title: "Abbey Road", releaseYear: 1969 },
      { title: "Let It Be", releaseYear: 1970 },
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
    genres: "classical, soundtrack, score, orchestra",
    isFeatured: false,
    bio: "Hans Florian Zimmer is a German-born film score composer and music producer. He has composed music for over 150 films, including award-winning scores for The Lion King, Gladiator, The Dark Knight trilogy, Inception, Interstellar, and Dune. Zimmer pioneered the integration of electronic music with traditional orchestral arrangements, creating a signature sound that has defined modern cinema. He has received two Academy Awards, four Grammy Awards, and was appointed a Commander of the Order of the British Empire (CBE) in 2024.",
    imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",
    officialWebsite: "https://hanszimmer.com",
    originCountry: "DE",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Hans_Zimmer",
    websiteUrl: "https://hanszimmer.com",
    albums: [
      { title: "The Lion King (Soundtrack)", releaseYear: 1994 },
      { title: "Gladiator (Soundtrack)", releaseYear: 2000 },
      { title: "The Dark Knight (Soundtrack)", releaseYear: 2008 },
      { title: "Inception (Soundtrack)", releaseYear: 2010 },
      { title: "Interstellar (Soundtrack)", releaseYear: 2014 },
      { title: "Dune (Soundtrack)", releaseYear: 2021 },
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
    genres: "afro, afrobeat, global, world",
    isFeatured: true,
    bio: "Fela Anikulapo Kuti was a Nigerian multi-instrumentalist, bandleader, composer, political activist, and Pan-Africanist who pioneered Afrobeat, a genre blending West African traditional music with American funk and jazz. Performing with his band Africa '70 and later Egypt '80, Fela used his music as a weapon against Nigeria's corrupt military government, enduring beatings, imprisonment, and the destruction of his commune. His fearless artistry and activism made him one of Africa's most iconic and internationally recognized musicians, influencing countless artists worldwide across genres from hip-hop to electronic music.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    officialWebsite: null,
    originCountry: "NG",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fela_Kuti",
    websiteUrl: "https://felakuti.com",
    albums: [
      { title: "Zombie", releaseYear: 1977 },
      { title: "Expensive Shit", releaseYear: 1975 },
      { title: "Gentleman", releaseYear: 1973 },
      { title: "Water No Get Enemy", releaseYear: 1975 },
      { title: "Sorrow, Tears and Blood", releaseYear: 1977 },
    ],
    charityLinks: [
      {
        organizationName: "Fela Kuti Foundation",
        donationUrl: "https://felakuti.com/foundation",
      },
    ],
  },
  {
    slug: "michael-jackson",
    name: "Michael Jackson",
    genres: "pop, r&b, soul, contemporary",
    isFeatured: true,
    bio: "Michael Joseph Jackson was an American singer, songwriter, and dancer, dubbed the 'King of Pop'. One of the most significant cultural figures of the 20th century, he transformed the art of music videos and popularized dance techniques such as the moonwalk. His contributions to music, dance, and fashion along with his publicized personal life made him a global figure in popular culture for over four decades.",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    officialWebsite: "https://www.michaeljackson.com",
    originCountry: "US",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Michael_Jackson",
    websiteUrl: "https://www.michaeljackson.com",
    albums: [
      { title: "Off the Wall", releaseYear: 1979 },
      { title: "Thriller", releaseYear: 1982 },
      { title: "Bad", releaseYear: 1987 },
      { title: "Dangerous", releaseYear: 1991 },
      { title: "HIStory", releaseYear: 1995 },
    ],
    charityLinks: [
      {
        organizationName: "Heal the World Foundation",
        donationUrl: "https://www.healtheworld.com",
      },
    ],
  },
  {
    slug: "bob-marley",
    name: "Bob Marley",
    genres: "reggae, ska, global, dancehall",
    isFeatured: false,
    bio: "Robert Nesta Marley was a Jamaican singer-songwriter who became an international musical and cultural icon, blending mostly reggae, ska, and rocksteady in his compositions. Starting out in 1963 with the group the Wailers, he forged a distinctive songwriting and vocal style that would later resonate with audiences worldwide. Marley is credited with helping spread Jamaican music to a worldwide audience and remains one of the most celebrated musicians of all time.",
    imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80",
    officialWebsite: "https://www.bobmarley.com",
    originCountry: "JM",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bob_Marley",
    websiteUrl: "https://www.bobmarley.com",
    albums: [
      { title: "Catch a Fire", releaseYear: 1973 },
      { title: "Burnin'", releaseYear: 1973 },
      { title: "Natty Dread", releaseYear: 1974 },
      { title: "Exodus", releaseYear: 1977 },
      { title: "Kaya", releaseYear: 1978 },
      { title: "Legend", releaseYear: 1984 },
    ],
    charityLinks: [
      {
        organizationName: "Bob Marley Foundation",
        donationUrl: "https://www.bobmarleyfoundation.org",
      },
    ],
  },
  {
    slug: "kraftwerk",
    name: "Kraftwerk",
    genres: "electronic, synth-pop, electro",
    isFeatured: false,
    bio: "Kraftwerk is a German band formed in Dusseldorf in 1970 by Ralf Hutter and Florian Schneider. Widely considered innovators and pioneers of electronic music, they were among the first successful acts to popularize the genre. The group's distinctive sound aesthetic, merging technology with art, profoundly influenced the development of synth-pop, hip hop, techno, and virtually every form of electronic dance music that followed.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
    officialWebsite: "https://www.kraftwerk.com",
    originCountry: "DE",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kraftwerk",
    websiteUrl: "https://www.kraftwerk.com",
    albums: [
      { title: "Autobahn", releaseYear: 1974 },
      { title: "Trans-Europe Express", releaseYear: 1977 },
      { title: "The Man-Machine", releaseYear: 1978 },
      { title: "Computer World", releaseYear: 1981 },
      { title: "Electric Cafe", releaseYear: 1986 },
    ],
    charityLinks: [
      {
        organizationName: "Electronic Music Foundation",
        donationUrl: "https://www.emf.org",
      },
    ],
  },
  {
    slug: "pink-floyd",
    name: "Pink Floyd",
    genres: "rock, progressive rock, psychedelic rock",
    isFeatured: false,
    bio: "Pink Floyd were an English rock band formed in London in 1965. Gaining an early following as one of the first British psychedelic groups, they were distinguished by their extended compositions, sonic experimentation, philosophical lyrics, and elaborate live shows. They became a leading band of the progressive rock genre and are one of the best-selling music artists of all time, with estimated sales of over 250 million records worldwide.",
    imageUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80",
    officialWebsite: "https://www.pinkfloyd.com",
    originCountry: "GB",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Pink_Floyd",
    websiteUrl: "https://www.pinkfloyd.com",
    albums: [
      { title: "The Dark Side of the Moon", releaseYear: 1973 },
      { title: "Wish You Were Here", releaseYear: 1975 },
      { title: "Animals", releaseYear: 1977 },
      { title: "The Wall", releaseYear: 1979 },
      { title: "The Division Bell", releaseYear: 1994 },
    ],
    charityLinks: [
      {
        organizationName: "Teenage Cancer Trust",
        donationUrl: "https://www.teenagecancertrust.org",
      },
    ],
  },
];

async function main() {
  console.log("🧹 Clearing existing data...");
  await prisma.charityLink.deleteMany();
  await prisma.event.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  console.log("✅ Database cleared.");

  for (const data of artists) {
    const artist = await prisma.artist.create({
      data: {
        slug: data.slug,
        name: data.name,
        bio: data.bio,
        genres: data.genres,
        isFeatured: data.isFeatured,
        imageUrl: data.imageUrl,
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

    console.log(`🌍 Seeded: ${artist.name} (${artist.originCountry}) — ${data.albums.length} albums`);
  }

  console.log(`\n🎉 Done! Seeded ${artists.length} global artists into Universal Music Hub.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });