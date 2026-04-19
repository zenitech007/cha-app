const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const id = process.env.SPOTIFY_CLIENT_ID!;
  const secret = process.env.SPOTIFY_CLIENT_SECRET!;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${res.status}`);
  }

  const data = await res.json();

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.value;
}

async function spotifyFetch(path: string) {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.warn(`Spotify API ${res.status} on ${path}:`, errorText);
    throw new Error(`Spotify API error: ${res.status} on ${path}`);
  }

  return res.json();
}

// ── Public API ──────────────────────────────────────────

export interface SpotifyArtist {
  spotifyId: string;
  name: string;
  genres: string[];
  imageUrl: string | null;
}

export async function searchSpotifyArtist(
  query: string,
): Promise<SpotifyArtist | null> {
  const data = await spotifyFetch(
    `/search?type=artist&limit=1&q=${encodeURIComponent(query)}`,
  );

  const artist = data?.artists?.items?.[0];
  if (!artist) return null;

  return {
    spotifyId: artist.id,
    name: artist.name,
    genres: artist.genres ?? [],
    imageUrl: artist.images?.[0]?.url ?? null,
  };
}

export async function searchSpotifyArtists(
  query: string,
  limit = 10,
): Promise<SpotifyArtist[]> {
  try {
    const data = await spotifyFetch(
      `/search?type=artist&limit=${limit}&q=${encodeURIComponent(query)}`,
    );

    const items: any[] = data?.artists?.items ?? [];

    return items.map((artist) => ({
      spotifyId: artist.id,
      name: artist.name,
      genres: artist.genres ?? [],
      imageUrl: artist.images?.[0]?.url ?? null,
    }));
  } catch {
    return [];
  }
}

export interface SpotifyAlbum {
  title: string;
  releaseYear: number;
  coverUrl: string | null;
}

export async function getArtistAlbums(
  spotifyArtistId: string,
): Promise<SpotifyAlbum[]> {
  try {
    const data = await spotifyFetch(
      `/artists/${spotifyArtistId}/albums?include_groups=album&limit=20`,
    );

    const items: any[] = data?.items ?? [];

    // Deduplicate by title (Spotify often has deluxe + standard editions)
    const seen = new Set<string>();
    const albums: SpotifyAlbum[] = [];

    for (const item of items) {
      const normalised = item.name.toLowerCase();
      if (seen.has(normalised)) continue;
      seen.add(normalised);

      albums.push({
        title: item.name,
        releaseYear: parseInt(item.release_date?.slice(0, 4), 10) || 0,
        coverUrl: item.images?.[0]?.url ?? null,
      });
    }

    return albums.sort((a, b) => b.releaseYear - a.releaseYear);
  } catch {
    return [];
  }
}

export interface SpotifyTopTrack {
  name: string;
  previewUrl: string | null;
  albumName: string;
  albumCoverUrl: string | null;
}

export async function getArtistTopTracks(
  spotifyArtistId: string,
): Promise<SpotifyTopTrack[]> {
  try {
    const data = await spotifyFetch(
      `/artists/${spotifyArtistId}/top-tracks?market=US`,
    );

    const tracks: any[] = data?.tracks ?? [];

    return tracks.slice(0, 5).map((track) => ({
      name: track.name,
      previewUrl: track.preview_url ?? null,
      albumName: track.album?.name ?? "",
      albumCoverUrl: track.album?.images?.[0]?.url ?? null,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches genres for a batch of artists from Spotify in parallel.
 * Returns a Map of artist name (lowercased) → genres array.
 * Falls back to an empty array for any artist not found or on error.
 */
export async function getArtistGenresBatch(
  artistNames: string[],
): Promise<Map<string, string[]>> {
  const results = await Promise.allSettled(
    artistNames.map((name) => searchSpotifyArtist(name)),
  );

  const map = new Map<string, string[]>();
  artistNames.forEach((name, i) => {
    const result = results[i];
    if (result.status === "fulfilled" && result.value) {
      map.set(name.toLowerCase(), result.value.genres);
    } else {
      map.set(name.toLowerCase(), []);
    }
  });

  return map;
}

export async function getRelatedArtists(
  spotifyArtistId: string,
): Promise<string[]> {
  try {
    const data = await spotifyFetch(
      `/artists/${spotifyArtistId}/related-artists`,
    );
    const items: any[] = data?.artists ?? [];
    return items.map((a) => a.name as string);
  } catch {
    return [];
  }
}
