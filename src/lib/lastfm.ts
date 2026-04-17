const API_BASE = "http://ws.audioscrobbler.com/2.0";

export interface LastFmBioResult {
  bio: string | null;
}

export async function fetchLastFmBio(
  artistName: string,
): Promise<LastFmBioResult> {
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) return { bio: null };

  try {
    const params = new URLSearchParams({
      method: "artist.getinfo",
      artist: artistName,
      api_key: apiKey,
      format: "json",
    });

    const res = await fetch(`${API_BASE}/?${params}`);
    if (!res.ok) return { bio: null };

    const data = await res.json();
    const content: string = data?.artist?.bio?.content ?? "";

    if (!content.trim()) return { bio: null };

    // Strip HTML tags and Last.fm attribution links
    const cleaned = content
      .replace(/<a\b[^>]*>.*?<\/a>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return { bio: cleaned || null };
  } catch {
    return { bio: null };
  }
}
