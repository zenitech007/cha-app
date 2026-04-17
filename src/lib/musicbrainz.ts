const API_BASE = "https://musicbrainz.org/ws/2";
const USER_AGENT = "UniversalMusicHub/1.0 ( admin@umhub.com )";

export interface MusicBrainzData {
  country: string | null;
  wikipediaUrl: string | null;
  officialWebsite: string | null;
}

export async function fetchMusicBrainzData(
  artistName: string,
): Promise<MusicBrainzData> {
  const empty: MusicBrainzData = {
    country: null,
    wikipediaUrl: null,
    officialWebsite: null,
  };

  try {
    // Step 1: Search for the artist
    const searchRes = await fetch(
      `${API_BASE}/artist/?query=${encodeURIComponent(artistName)}&fmt=json&limit=1`,
      { headers: { "User-Agent": USER_AGENT } },
    );

    if (!searchRes.ok) return empty;

    const searchData = await searchRes.json();
    const artist = searchData?.artists?.[0];
    if (!artist) return empty;

    const mbid: string = artist.id;
    const country: string | null = artist.country ?? null;

    // Step 2: Fetch full artist data with relations for URLs
    const detailRes = await fetch(
      `${API_BASE}/artist/${mbid}?inc=url-rels&fmt=json`,
      { headers: { "User-Agent": USER_AGENT } },
    );

    if (!detailRes.ok) return { ...empty, country };

    const detail = await detailRes.json();
    const relations: any[] = detail?.relations ?? [];

    let wikipediaUrl: string | null = null;
    let officialWebsite: string | null = null;

    for (const rel of relations) {
      const url: string = rel?.url?.resource ?? "";
      if (!url) continue;

      if (rel.type === "wikipedia" && !wikipediaUrl) {
        wikipediaUrl = url;
      }
      if (rel.type === "official homepage" && !officialWebsite) {
        officialWebsite = url;
      }
    }

    return { country, wikipediaUrl, officialWebsite };
  } catch {
    return empty;
  }
}
