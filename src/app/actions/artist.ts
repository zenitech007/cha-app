"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateEmbedding } from "@/lib/openai";
import { searchSpotifyArtist, getArtistAlbums } from "@/lib/spotify";
import { fetchLastFmBio } from "@/lib/lastfm";
import { fetchMusicBrainzData } from "@/lib/musicbrainz";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Artist name is required");

  // Manual overrides from form (user can still edit these)
  const manualBio = (formData.get("bio") as string)?.trim() || null;
  const manualImageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const manualWebsite =
    (formData.get("officialWebsite") as string)?.trim() || null;

  // Parse albums JSON if provided (from auto-fill)
  const albumsRaw = (formData.get("albums") as string)?.trim() || null;
  let albumsData: {
    title: string;
    releaseYear: number;
    coverUrl: string | null;
  }[] = [];
  if (albumsRaw) {
    try {
      albumsData = JSON.parse(albumsRaw);
    } catch {
      // ignore malformed JSON
    }
  }

  // Parse charity fields
  const charityName =
    (formData.get("charityName") as string)?.trim() || null;
  const charityUrl =
    (formData.get("charityUrl") as string)?.trim() || null;

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
