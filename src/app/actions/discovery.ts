"use server";

import { prisma } from "@/lib/prisma";

export async function getSimilarArtists(timezone: string) {
  try {
    // Safety catch for missing timezone strings
    if (!timezone) timezone = "UTC"; 

    const continent = timezone.split("/")[0];
    const countries = regionCountries[continent];

    // 1. Try to fetch artists from the mapped region
    if (countries && countries.length > 0) {
      const regionalArtists = await prisma.artist.findMany({
        where: { originCountry: { in: countries } },
        take: 8,
        orderBy: { name: "asc" },
      });

      // If we found artists for this region, return them
      if (regionalArtists.length > 0) {
        return regionalArtists;
      }
    }

    // 2. FALLBACK: If timezone is unmapped (like UTC) OR the region has no artists yet
    // Return a global fallback so the UI section doesn't sit empty
    return await prisma.artist.findMany({
      take: 8,
      orderBy: [
        { isFeatured: "desc" }, // Bring featured artists to the front
        { createdAt: "desc" }   // Then sort by newest
      ],
    });

  } catch (error) {
    console.error("Error in getRegionalArtists pipeline:", error);
    return []; // Only return empty on an actual database crash
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