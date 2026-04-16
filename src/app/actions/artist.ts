"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateEmbedding } from "@/lib/openai";
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

  const bio = (formData.get("bio") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const officialWebsite =
    (formData.get("officialWebsite") as string)?.trim() || null;

  // Parse albums JSON if provided (from Spotify auto-fill)
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
      // ignore malformed JSON, just skip albums
    }
  }

  // Parse charity fields
  const charityName =
    (formData.get("charityName") as string)?.trim() || null;
  const charityUrl =
    (formData.get("charityUrl") as string)?.trim() || null;

  // Create the artist row first (without embedding — Unsupported columns
  // can't be set via the normal Prisma client)
  const artist = await prisma.artist.create({
    data: {
      slug: slugify(name),
      name,
      bio,
      imageUrl,
      officialWebsite,
      albums:
        albumsData.length > 0
          ? {
              create: albumsData.map((a) => ({
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
    const embeddingText = [name, bio].filter(Boolean).join(" — ");
    const vector = await generateEmbedding(embeddingText);
    const vectorStr = `[${vector.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `UPDATE artists SET embedding = $1::vector WHERE id = $2`,
      vectorStr,
      artist.id,
    );
  } catch {
    // Non-fatal: artist is created, embedding just won't be available
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
