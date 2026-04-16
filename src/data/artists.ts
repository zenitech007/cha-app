export type Era = "Classic" | "Modern" | "Contemporary" | "Outlaw" | "Bluegrass";
export type Genre = "Traditional" | "Country Pop" | "Outlaw" | "Bluegrass" | "Honky Tonk" | "Americana" | "Country Rock" | "Nashville Sound";

export interface Artist {
  id: number;
  name: string;
  image: string;
  era: Era;
  genre: Genre[];
  origin: string;
  active: string;
  biography: string;
  notableAlbums: string[];
  awards: string[];
  featured: boolean;
  rating: number;
}

export const artists: Artist[] = [
  {
    id: 1,
    name: "Jake Harlan",
    image: "/images/artist-1.jpg",
    era: "Contemporary",
    genre: ["Traditional", "Honky Tonk"],
    origin: "Nashville, TN",
    active: "2008 – Present",
    biography:
      "Jake Harlan rose to prominence in the late 2000s with his gritty, straight-ahead honky tonk sound that harkened back to country music's golden age. Known for his baritone voice and heartfelt storytelling, Harlan has become one of the genre's most respected traditionalists.",
    notableAlbums: ["Dusty Roads", "Heartland Hymns", "Back to Basics", "The Long Way Home"],
    awards: ["CMA Single of the Year", "ACM Album of the Year", "Grammy Nominee – Best Country Album"],
    featured: true,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Savannah Blake",
    image: "/images/artist-2.jpg",
    era: "Contemporary",
    genre: ["Country Pop", "Americana"],
    origin: "Savannah, GA",
    active: "2014 – Present",
    biography:
      "A powerhouse vocalist from the Georgia coast, Savannah Blake blends soulful Southern charm with mainstream country appeal. Her rich storytelling and commanding stage presence have earned her multiple platinum certifications and a dedicated global fanbase.",
    notableAlbums: ["Southern Lights", "Golden Hour", "Magnolia Dreams", "Wide Open Spaces"],
    awards: ["Billboard Music Award – Top Country Artist", "CMA Female Vocalist of the Year", "CMT Video of the Year"],
    featured: true,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Cody Maverick",
    image: "/images/artist-3.jpg",
    era: "Modern",
    genre: ["Country Rock", "Outlaw"],
    origin: "Austin, TX",
    active: "2010 – Present",
    biography:
      "With roots deep in the Texas hill country, Cody Maverick carved out a niche with his rebellious, road-worn sound. Fusing classic outlaw attitudes with modern production, his music speaks to working-class audiences across the heartland.",
    notableAlbums: ["Highway Gospel", "Red Dirt Soul", "Lone Star Lullabies", "Maverick"],
    awards: ["Texas Music Chart #1 – 6 Times", "ACM New Male Artist", "Americana Music Award"],
    featured: false,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Earl Whitmore",
    image: "/images/artist-4.jpg",
    era: "Classic",
    genre: ["Nashville Sound", "Traditional"],
    origin: "Hendersonville, TN",
    active: "1968 – 2005",
    biography:
      "A titan of the classic Nashville era, Earl Whitmore defined the polished sound of 1970s country music. With dozens of chart-toppers and a legacy spanning nearly four decades, his velvet baritone and impeccable phrasing remain the gold standard of traditional country.",
    notableAlbums: ["Midnight in Memphis", "Tennessee Rain", "The Earl of Nashville", "Forever Country"],
    awards: ["Country Music Hall of Fame Inductee", "CMA Entertainer of the Year (3x)", "Grammy Lifetime Achievement Award"],
    featured: true,
    rating: 5.0,
  },
  {
    id: 5,
    name: "Clara Fiddler",
    image: "/images/artist-5.jpg",
    era: "Modern",
    genre: ["Bluegrass", "Americana"],
    origin: "Asheville, NC",
    active: "2005 – Present",
    biography:
      "Clara Fiddler is a virtuoso instrumentalist whose fiddle playing bridges the gap between old-time Appalachian music and contemporary bluegrass. Her compositions are celebrated for their emotional depth and technical brilliance.",
    notableAlbums: ["Mountain Laurel", "Strings & Stories", "Appalachian Suite", "Porch Sessions"],
    awards: ["IBMA Fiddle Player of the Year (4x)", "Americana Music Award – Instrumental Artist", "Grammy – Best Bluegrass Album"],
    featured: false,
    rating: 4.7,
  },
  {
    id: 6,
    name: "Lily Rose Dawson",
    image: "/images/artist-6.jpg",
    era: "Contemporary",
    genre: ["Country Pop", "Nashville Sound"],
    origin: "Franklin, TN",
    active: "2019 – Present",
    biography:
      "One of Nashville's brightest young stars, Lily Rose Dawson burst onto the scene with her debut single that shattered streaming records. Her fresh perspective on country pop, paired with lyrical vulnerability, has made her the voice of a new generation.",
    notableAlbums: ["First Light", "Wildflower"],
    awards: ["CMT Breakthrough Artist", "ACM New Female Artist of the Year", "Billboard Hot Country Songs – #1"],
    featured: false,
    rating: 4.6,
  },
  {
    id: 7,
    name: "Wade Colton",
    image: "/images/artist-1.jpg",
    era: "Outlaw",
    genre: ["Outlaw", "Country Rock"],
    origin: "Lubbock, TX",
    active: "1975 – 1998",
    biography:
      "Wade Colton was the quintessential outlaw country rebel — a songwriter's songwriter whose unflinching honesty and refusal to conform to Nashville's polished machine made him a cult hero. His raw, uncompromising albums remain touchstones of the outlaw movement.",
    notableAlbums: ["Wanted: Dead or Alive", "Renegade Soul", "West Texas Winds", "Colton Country"],
    awards: ["Outlaw Country Hall of Fame", "Rolling Stone – 100 Greatest Country Albums"],
    featured: false,
    rating: 4.6,
  },
  {
    id: 8,
    name: "Mae-Beth Collins",
    image: "/images/artist-2.jpg",
    era: "Classic",
    genre: ["Traditional", "Honky Tonk"],
    origin: "Bakersfield, CA",
    active: "1960 – 1990",
    biography:
      "Mae-Beth Collins was a pioneering figure in the Bakersfield Sound movement, bringing a no-frills, honky tonk aesthetic to country music at a time when Nashville was moving toward orchestral polish. Her fierce independence and powerful voice made her an icon.",
    notableAlbums: ["Bakersfield Bound", "Hard Times & Honky Tonks", "Queen of the West", "Legends"],
    awards: ["Country Music Hall of Fame Inductee", "Pioneer Award – CMT"],
    featured: false,
    rating: 4.8,
  },
  {
    id: 9,
    name: "Beau Remington",
    image: "/images/artist-3.jpg",
    era: "Modern",
    genre: ["Americana", "Country Rock"],
    origin: "Muscle Shoals, AL",
    active: "2003 – Present",
    biography:
      "Drawing deeply from the Muscle Shoals soul tradition, Beau Remington crafts Americana-tinged country that resonates with rootsy authenticity. His cinematic songwriting and versatile guitar work have earned him critical acclaim across multiple genres.",
    notableAlbums: ["Shoals Sessions", "River Road", "Bayou Nights", "The Southern Way"],
    awards: ["Americana Music Award – Artist of the Year", "Roots Rock Award", "NPR Best Albums of the Year"],
    featured: false,
    rating: 4.4,
  },
  {
    id: 10,
    name: "Dolly June Porter",
    image: "/images/artist-5.jpg",
    era: "Bluegrass",
    genre: ["Bluegrass", "Traditional"],
    origin: "Sevierville, TN",
    active: "1990 – Present",
    biography:
      "Named after her idol, Dolly June Porter has spent decades preserving and celebrating the Appalachian bluegrass heritage. A multi-instrumentalist and harmony singer of rare talent, she runs the Porter Mountain Music School alongside her touring career.",
    notableAlbums: ["Mountain Roots", "Harmony Hollow", "Pines & Prayers", "Old Timey"],
    awards: ["IBMA Distinguished Achievement Award", "Tennessee Heritage Arts Prize", "Grammy Nominee – Best Folk Album"],
    featured: false,
    rating: 4.3,
  },
  {
    id: 11,
    name: "Tucker James",
    image: "/images/artist-1.jpg",
    era: "Contemporary",
    genre: ["Country Pop", "Nashville Sound"],
    origin: "Cookeville, TN",
    active: "2016 – Present",
    biography:
      "Tucker James emerged from small-town Tennessee with an infectious blend of radio-ready hooks and genuine country soul. His rapid rise through the ranks of Nashville's competitive scene has been marked by consistent hits and a devoted touring fanbase.",
    notableAlbums: ["Cookeville Kid", "Drive", "Summer Roads"],
    awards: ["ACM New Male Artist Nominee", "CMT Hot 20 Countdown #1"],
    featured: false,
    rating: 4.2,
  },
  {
    id: 12,
    name: "Rosie Mae Sutton",
    image: "/images/artist-6.jpg",
    era: "Outlaw",
    genre: ["Outlaw", "Americana"],
    origin: "Tulsa, OK",
    active: "1982 – 2010",
    biography:
      "Rosie Mae Sutton was a firebrand performer and songwriter who defied the gender norms of 1980s Nashville. Channeling outlaw energy through a distinctly feminine lens, she paved the way for generations of women in country music who refused to be put in a box.",
    notableAlbums: ["Rebel Rose", "Oklahoma Wildfire", "No Apologies", "Sutton's Law"],
    awards: ["Trailblazer Award – Americana Music Association", "Oklahoma Music Hall of Fame"],
    featured: false,
    rating: 4.5,
  },
];

export const eras: Era[] = ["Classic", "Modern", "Contemporary", "Outlaw", "Bluegrass"];
export const genres: Genre[] = ["Traditional", "Country Pop", "Outlaw", "Bluegrass", "Honky Tonk", "Americana", "Country Rock", "Nashville Sound"];
