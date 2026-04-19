"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateEmbedding } from "@/lib/openai";
import { searchSpotifyArtist, getArtistAlbums } from "@/lib/spotify";
import { fetchLastFmBio } from "@/lib/lastfm";
import { fetchMusicBrainzData } from "@/lib/musicbrainz";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ── Validation Schemas ────────────────────────────────────

const createArtistSchema = z.object({
  name: z.string().min(1, "Artist name is required").max(200),
  bio: z.string().max(10000).optional().nullable(),
  genres: z.string().max(500).optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  officialWebsite: z.string().url("Invalid website URL").optional().or(z.literal("")),
  originCountry: z.string().max(10).optional().or(z.literal("")),
  wikipediaUrl: z.string().url("Invalid Wikipedia URL").optional().or(z.literal("")),
  charityName: z.string().max(200).optional().or(z.literal("")),
  charityUrl: z.string().url("Invalid charity URL").optional().or(z.literal("")),
  albums: z.string().optional().or(z.literal("")),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createArtist(formData: FormData) {
  await requireAdmin();

  // ── Validate form input ─────────────────────────────────
  const raw = {
    name: (formData.get("name") as string)?.trim() ?? "",
    bio: (formData.get("bio") as string)?.trim() ?? "",
    genres: (formData.get("genres") as string)?.trim() ?? "",
    imageUrl: (formData.get("imageUrl") as string)?.trim() ?? "",
    officialWebsite: (formData.get("officialWebsite") as string)?.trim() ?? "",
    originCountry: (formData.get("originCountry") as string)?.trim() ?? "",
    wikipediaUrl: (formData.get("wikipediaUrl") as string)?.trim() ?? "",
    charityName: (formData.get("charityName") as string)?.trim() ?? "",
    charityUrl: (formData.get("charityUrl") as string)?.trim() ?? "",
    albums: (formData.get("albums") as string)?.trim() ?? "",
  };

  const parsed = createArtistSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new Error(`Validation failed: ${firstIssue.path.join(".")} — ${firstIssue.message}`);
  }

  const { name } = parsed.data;
  const manualBio = parsed.data.bio || null;
  const manualImageUrl = parsed.data.imageUrl || null;
  const manualWebsite = parsed.data.officialWebsite || null;

  // Parse albums JSON if provided (from auto-fill)
  let albumsData: {
    title: string;
    releaseYear: number;
    coverUrl: string | null;
  }[] = [];
  if (parsed.data.albums) {
    try {
      albumsData = JSON.parse(parsed.data.albums);
    } catch {
      // ignore malformed JSON
    }
  }

  // Parse charity fields
  const charityName = parsed.data.charityName || null;
  const charityUrl = parsed.data.charityUrl || null;

  // ── Deep Data Pipeline ──────────────────────────────────
  // Run Spotify, Last.fm, and MusicBrainz in parallel for speed
  const [spotifyResult, lastfmResult, mbResult] = await Promise.all([
    searchSpotifyArtist(name).catch(() => null),
    fetchLastFmBio(name).catch(() => ({ bio: null })),
    fetchMusicBrainzData(name).catch(() => ({
      country: null,
      wikipediaUrl: null,
      officialWebsite: null,
    })),
  ]);

  // Fetch albums from Spotify if we have a Spotify ID and no manual albums
  let spotifyAlbums = albumsData;
  if (spotifyAlbums.length === 0 && spotifyResult?.spotifyId) {
    try {
      spotifyAlbums = await getArtistAlbums(spotifyResult.spotifyId);
    } catch {
      // non-fatal
    }
  }

  // Merge: form values take priority, APIs fill in the gaps
  const finalBio = manualBio || lastfmResult.bio || null;
  const finalImageUrl = manualImageUrl || spotifyResult?.imageUrl || null;
  const finalWebsite = manualWebsite || mbResult.officialWebsite || null;
  const finalGenres =
    parsed.data.genres ||
    (spotifyResult?.genres?.length ? spotifyResult.genres.join(", ") : null);

  // ── Save to Database ────────────────────────────────────
  const artist = await prisma.artist.create({
    data: {
      slug: slugify(name),
      name,
      bio: finalBio,
      imageUrl: finalImageUrl,
      officialWebsite: finalWebsite,
      originCountry: mbResult.country || null,
      wikipediaUrl: mbResult.wikipediaUrl || null,
      websiteUrl: mbResult.officialWebsite || null,
      genres: finalGenres,
      albums:
        spotifyAlbums.length > 0
          ? {
              create: spotifyAlbums.map((a) => ({
                title: a.title,
                releaseYear: a.releaseYear,
                coverUrl: a.coverUrl,
              })),
            }
          : undefined,
      charityLinks: charityName
        ? {
            create: [
              { organizationName: charityName, donationUrl: charityUrl },
            ],
          }
        : undefined,
    },
  });

  // Generate and store the embedding via raw SQL
  try {
    const embeddingText = [name, finalBio].filter(Boolean).join(" — ");
    const vector = await generateEmbedding(embeddingText);
    const vectorStr = `[${vector.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `UPDATE artists SET embedding = $1::vector WHERE id = $2`,
      vectorStr,
      artist.id,
    );
  } catch {
    console.error("Failed to generate embedding for", name);
  }

  revalidatePath("/");
  revalidatePath("/artists");
  revalidatePath("/search");
  revalidatePath("/admin");

  redirect("/admin");
}

export async function deleteArtist(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) throw new Error("Artist ID is required");

  await prisma.artist.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/artists");
  revalidatePath("/search");
  revalidatePath("/admin");
}

export async function toggleFeaturedArtist(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  if (!id) throw new Error("Artist ID is required");

  const artist = await prisma.artist.findUniqueOrThrow({ where: { id } });

  await prisma.artist.update({
    where: { id },
    data: { isFeatured: !artist.isFeatured },
  });

  revalidatePath("/");
  revalidatePath("/artists");
  revalidatePath("/admin");
}
