"use server";

import { prisma } from "@/lib/prisma";

export async function getSimilarArtists(artistName: string) {
  if (!process.env.LASTFM_API_KEY) {
    console.error("LASTFM_API_KEY is not set.");
    return [];
  }

  try {
    const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(
      artistName
    )}&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=6`;

    const res = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours
    
    if (!res.ok) {
      throw new Error(`Last.fm API responded with status: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.similarartists || !data.similarartists.artist) {
      return [];
    }

    // Map the Last.fm data into a clean array for our UI
    return data.similarartists.artist.map((artist: any) => ({
      name: artist.name,
      // Last.fm's image API is notoriously unreliable now, so we generate a consistent fallback
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}&background=1c1917&color=fbbf24&size=256`, 
      match: artist.match, // A percentage of how similar they are (e.g., "0.85")
    }));
  } catch (error) {
    console.error("Error fetching similar artists:", error);
    return [];
  }
}

const regionCountries: Record<string, string[]> = {
  Africa:    ["NG", "ZA", "KE", "EG", "GH", "TZ", "ET", "SN", "CM", "CI"],
  America:   ["US", "CA", "BR", "MX", "AR", "CO", "CL", "PE", "VE", "CU"],
  Europe:    ["GB", "FR", "DE", "SE", "IT", "NL", "NO", "ES", "PT", "IE", "BE", "AT", "CH", "DK", "FI", "PL"],
  Asia:      ["JP", "KR", "IN", "PH", "ID", "CN", "TH", "VN", "TW", "MY", "SG"],
  Australia: ["AU", "NZ"],
  Pacific:   ["AU", "NZ"],
};

export async function getRegionalArtists(timezone: string) {
  try {
    const continent = timezone.split("/")[0];
    const countries = regionCountries[continent];

    if (!countries || countries.length === 0) return [];

    return prisma.artist.findMany({
      where: { originCountry: { in: countries } },
      take: 8,
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}