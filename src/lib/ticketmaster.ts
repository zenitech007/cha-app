const API_BASE = "https://app.ticketmaster.com/discovery/v2";

export interface TicketmasterEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl: string | null;
}

export interface TourDate {
  id: string;
  name: string;
  date: string;
  time: string | null;
  venue: string;
  city: string;
  country: string;
  ticketUrl: string | null;
}

export async function getUpcomingTourDates(
  artistName: string,
): Promise<TourDate[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    apikey: apiKey,
    keyword: artistName,
    classificationName: "music",
    sort: "date,asc",
    size: "5",
  });

  try {
    const res = await fetch(`${API_BASE}/events.json?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items: any[] = data?._embedded?.events ?? [];

    return items.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.dates?.start?.localDate ?? "",
      time: event.dates?.start?.localTime ?? null,
      venue: event._embedded?.venues?.[0]?.name ?? "TBA",
      city: [
        event._embedded?.venues?.[0]?.city?.name,
        event._embedded?.venues?.[0]?.state?.stateCode,
      ]
        .filter(Boolean)
        .join(", ") || "TBA",
      country: event._embedded?.venues?.[0]?.country?.name ?? "",
      ticketUrl: event.url ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getArtistEvents(
  keyword: string,
): Promise<TicketmasterEvent[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) return [];

  const params = new URLSearchParams({
    apikey: apiKey,
    keyword,
    classificationName: "music",
    sort: "date,asc",
    size: "20",
  });

  try {
    const res = await fetch(`${API_BASE}/events.json?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items: any[] = data?._embedded?.events ?? [];

    return items.map((event) => ({
      id: event.id,
      name: event.name,
      date: event.dates?.start?.localDate ?? "",
      venue: event._embedded?.venues?.[0]?.name ?? "TBA",
      city: [
        event._embedded?.venues?.[0]?.city?.name,
        event._embedded?.venues?.[0]?.state?.stateCode,
        event._embedded?.venues?.[0]?.country?.name,
      ]
        .filter(Boolean)
        .join(", ") || "TBA",
      ticketUrl: event.url ?? null,
    }));
  } catch {
    return [];
  }
}
