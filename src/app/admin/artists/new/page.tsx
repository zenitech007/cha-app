"use client";

import { useState } from "react";
import { createArtist } from "@/app/actions/artist";
import {
  fetchArtistDataAction,
  type SpotifyArtistData,
} from "@/app/actions/spotify";
import type { SpotifyAlbum } from "@/lib/spotify";

export default function NewArtistPage() {
  const [spotifyQuery, setSpotifyQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [spotifyError, setSpotifyError] = useState("");

  // Form fields (editable after auto-fill)
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [filled, setFilled] = useState(false);

  async function handleSpotifySearch() {
    setSpotifyError("");
    setSearching(true);

    const result = await fetchArtistDataAction(spotifyQuery);

    setSearching(false);

    if (!result.ok) {
      setSpotifyError(result.error);
      return;
    }

    const data: SpotifyArtistData = result.data;
    setName(data.name);
    setBio(data.genres);
    setImageUrl(data.imageUrl ?? "");
    setAlbums(data.albums);
    setFilled(true);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Add Artist</h1>
      <p className="mt-1 text-sm text-muted">
        Search Spotify to auto-fill, then review and save.
      </p>

      {/* ── Spotify Auto-Fill ── */}
      <div className="mt-8 rounded-lg border border-border bg-surface px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Spotify Auto-Fill
        </p>
        <div className="mt-3 flex gap-3">
          <input
            type="text"
            value={spotifyQuery}
            onChange={(e) => setSpotifyQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSpotifySearch();
              }
            }}
            placeholder="e.g. George Strait"
            className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
          <button
            type="button"
            onClick={handleSpotifySearch}
            disabled={searching || !spotifyQuery.trim()}
            className="h-10 shrink-0 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {searching ? "Searching\u2026" : "Search"}
          </button>
        </div>

        {spotifyError && (
          <p className="mt-3 text-sm text-red-600">{spotifyError}</p>
        )}

        {filled && (
          <p className="mt-3 text-sm text-green-700">
            Found &ldquo;{name}&rdquo; with {albums.length} album
            {albums.length !== 1 && "s"}. Review below and save.
          </p>
        )}
      </div>

      {/* ── Main Form ── */}
      <form action={createArtist} className="mt-8 space-y-6">
        {/* Hidden albums JSON */}
        {albums.length > 0 && (
          <input
            type="hidden"
            name="albums"
            value={JSON.stringify(albums)}
          />
        )}

        {/* Name */}
        <Field label="Name" required>
          <input
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. George Strait"
            className={inputClass}
          />
        </Field>

        {/* Bio / Genres */}
        <Field label="Biography / Genres">
          <textarea
            name="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A brief biography or genre tags..."
            className={textareaClass}
          />
        </Field>

        {/* Image URL */}
        <Field label="Image URL">
          <input
            name="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className={inputClass}
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-3 h-20 w-20 rounded-full object-cover"
            />
          )}
        </Field>

        {/* Official Website */}
        <Field label="Official Website">
          <input
            name="officialWebsite"
            type="url"
            value={officialWebsite}
            onChange={(e) => setOfficialWebsite(e.target.value)}
            placeholder="https://www.example.com"
            className={inputClass}
          />
        </Field>

        {/* ── Charity & Causes ── */}
        <div className="space-y-4 rounded-lg border border-border p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Charity &amp; Causes
          </p>
          <Field label="Organization Name">
            <input
              name="charityName"
              type="text"
              placeholder="e.g. Homes For Our Troops"
              className={inputClass}
            />
          </Field>
          <Field label="Donation URL">
            <input
              name="charityUrl"
              type="url"
              placeholder="https://www.example.org/donate"
              className={inputClass}
            />
          </Field>
        </div>

        {/* Albums Preview */}
        {albums.length > 0 && (
          <div>
            <p className="text-sm font-medium">
              Discography ({albums.length} albums)
            </p>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-md border border-border p-3">
              {albums.map((album, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm"
                >
                  {album.coverUrl ? (
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-surface text-xs text-muted">
                      &#9835;
                    </div>
                  )}
                  <span className="flex-1 truncate">{album.title}</span>
                  <span className="shrink-0 text-xs text-muted">
                    {album.releaseYear}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            Save to Database
          </button>
          <a
            href="/admin"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

// ── Shared styles & helpers ──

const inputClass =
  "mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-foreground/20";

const textareaClass =
  "mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-foreground/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </fieldset>
  );
}
