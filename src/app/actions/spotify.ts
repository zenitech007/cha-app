"use server";

import { auth } from "@/lib/auth";
import {
  searchSpotifyArtist,
  getArtistAlbums,
  type SpotifyAlbum,
} from "@/lib/spotify";
import { fetchLastFmBio } from "@/lib/lastfm";
import { fetchMusicBrainzData } from "@/lib/musicbrainz";

// ── Rate Limiter Setup ──────────────────────────────────
// Maps User ID to their last request timestamp
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 5000; // 5 seconds between searches

export interface SpotifyArtistData {
  name: string;
  genres: string;
  imageUrl: string | null;
  albums: SpotifyAlbum[];
  bio: string | null;
  originCountry: string | null;
  wikipediaUrl: string | null;
  officialWebsite: string | null;
}

export type FetchArtistResult =
  | { ok: true; data: SpotifyArtistData }
  | { ok: false; error: string };

export async function fetchArtistDataAction(
  artistName: string,
): Promise<FetchArtistResult> {
  const session = await auth();

  // Ensure we have a user AND an ID to track
  if (!session?.user?.email) return { ok: false, error: "Unauthorized" };
  const userIdentifier = session.user.email; // or session.user.id if available in your auth config

  // ── Rate Limit Check ────────────────────────────────────
  const now = Date.now();
  const lastRequestTime = rateLimitMap.get(userIdentifier);

  if (lastRequestTime && now - lastRequestTime < RATE_LIMIT_WINDOW_MS) {
    const timeLeft = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequestTime)) / 1000);
    return { ok: false, error: `Too many requests. Please wait ${timeLeft} seconds.` };
  }

  // Update the user's last request time
  rateLimitMap.set(userIdentifier, now);
  // ────────────────────────────────────────────────────────

  const trimmed = artistName.trim();
  if (!trimmed) return { ok: false, error: "Please enter an artist name." };

  try {
    // Run all three APIs in parallel with error logging
    const [artist, lastfm, mb] = await Promise.all([
      searchSpotifyArtist(trimmed),
      fetchLastFmBio(trimmed).catch((error) => {
        console.error(`[External API Error] Last.fm bio fetch failed for "${trimmed}":`, error);
        return { bio: null };
      }),
      fetchMusicBrainzData(trimmed).catch((error) => {
        console.error(`[External API Error] MusicBrainz fetch failed for "${trimmed}":`, error);
        return { country: null, wikipediaUrl: null, officialWebsite: null };
      }),
    ]);

    if (!artist) {
      return { ok: false, error: `No Spotify results for "${trimmed}".` };
    }

    const albums = await getArtistAlbums(artist.spotifyId);

    return {
      ok: true,
      data: {
        name: artist.name,
        genres: artist.genres.join(", "),
        imageUrl: artist.imageUrl,
        albums,
        bio: lastfm.bio,
        originCountry: mb.country,
        wikipediaUrl: mb.wikipediaUrl,
        officialWebsite: mb.officialWebsite,
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}
