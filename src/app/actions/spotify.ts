"use server";

import { auth } from "@/lib/auth";
import {
  searchSpotifyArtist,
  getArtistAlbums,
  type SpotifyAlbum,
} from "@/lib/spotify";
import { fetchLastFmBio } from "@/lib/lastfm";
import { fetchMusicBrainzData } from "@/lib/musicbrainz";

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
  if (!session?.user) return { ok: false, error: "Unauthorized" };

  const trimmed = artistName.trim();
  if (!trimmed) return { ok: false, error: "Please enter an artist name." };

  try {
    // Run all three APIs in parallel
    const [artist, lastfm, mb] = await Promise.all([
      searchSpotifyArtist(trimmed),
      fetchLastFmBio(trimmed).catch(() => ({ bio: null })),
      fetchMusicBrainzData(trimmed).catch(() => ({
        country: null,
        wikipediaUrl: null,
        officialWebsite: null,
      })),
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
