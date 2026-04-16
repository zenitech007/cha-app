"use server";

import { auth } from "@/lib/auth";
import {
  searchSpotifyArtist,
  getArtistAlbums,
  type SpotifyAlbum,
} from "@/lib/spotify";

export interface SpotifyArtistData {
  name: string;
  genres: string;
  imageUrl: string | null;
  albums: SpotifyAlbum[];
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
    const artist = await searchSpotifyArtist(trimmed);
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
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}
