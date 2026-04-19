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
  const [genres, setGenres] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [originCountry, setOriginCountry] = useState("");
  const [wikipediaUrl, setWikipediaUrl] = useState("");
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
    setBio(data.bio || data.genres);
    setGenres(data.genres);
    setImageUrl(data.imageUrl ?? "");
    setAlbums(data.albums);
    setOfficialWebsite(data.officialWebsite ?? "");
    setOriginCountry(data.originCountry ?? "");
    setWikipediaUrl(data.wikipediaUrl ?? "");
    setFilled(true);
  }

  const sourceCount = [
    filled ? "Spotify" : null,
    bio && bio !== "" ? "Last.fm" : null,
    originCountry || wikipediaUrl ? "MusicBrainz" : null,
  ].filter(Boolean);

  return (
    <div className="max-w-2xl">
      <h1
        className="text-2xl font-bold tracking-tight text-white"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Add Artist
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Search to auto-fill from Spotify, Last.fm &amp; MusicBrainz, then review and save.
      </p>

      {/* -- Deep Search Auto-Fill -- */}
      <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900 px-5 py-5">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Deep Search Auto-Fill
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
            placeholder="e.g. Daft Punk, Taylor Swift, Hans Zimmer"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleSpotifySearch}
            disabled={searching || !spotifyQuery.trim()}
            className="h-10 shrink-0 rounded-full bg-amber-600 px-4 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-500 disabled:opacity-40"
          >
            {searching ? "Searching\u2026" : "Search"}
          </button>
        </div>

        {spotifyError && (
          <p className="mt-3 text-sm text-red-400">{spotifyError}</p>
        )}

        {filled && (
          <div className="mt-3">
            <p className="text-sm text-emerald-400">
              Found &ldquo;{name}&rdquo; with {albums.length} album
              {albums.length !== 1 && "s"}.
              {sourceCount.length > 0 && (
                <> Sources: {sourceCount.join(", ")}.</>
              )}
            </p>
          </div>
        )}
      </div>

      {/* -- Main Form -- */}
      <form action={createArtist} className="mt-8 space-y-6">
        {/* Hidden albums JSON */}
        {albums.length > 0 && (
          <input
            type="hidden"
            name="albums"
            value={JSON.stringify(albums)}
          />
        )}

        {/* Hidden genres from Spotify */}
        {genres && (
          <input type="hidden" name="genres" value={genres} />
        )}

        {/* Name */}
        <Field label="Name" required>
          <input
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Daft Punk, Taylor Swift, Hans Zimmer"
            className={inputClass}
          />
        </Field>

        {/* Bio */}
        <Field label="Biography">
          <textarea
            name="bio"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Rich biography auto-filled from Last.fm..."
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
              className="mt-3 h-20 w-20 rounded-full object-cover border-2 border-stone-700"
            />
          )}
        </Field>

        {/* Origin Country */}
        <Field label="Origin Country">
          <input
            name="originCountry"
            type="text"
            value={originCountry}
            onChange={(e) => setOriginCountry(e.target.value)}
            placeholder="e.g. US, GB, FR, JP (from MusicBrainz)"
            className={inputClass}
          />
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

        {/* Wikipedia URL */}
        <Field label="Wikipedia URL">
          <input
            name="wikipediaUrl"
            type="url"
            value={wikipediaUrl}
            onChange={(e) => setWikipediaUrl(e.target.value)}
            placeholder="https://en.wikipedia.org/wiki/..."
            className={inputClass}
          />
        </Field>

        {/* -- Charity & Causes -- */}
        <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Charity &amp; Causes
          </p>
          <Field label="Organization Name">
            <input
              name="charityName"
              type="text"
              placeholder="e.g. UNICEF, Red Cross, charity: water"
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
            <p className="text-sm font-medium text-white">
              Discography ({albums.length} albums)
            </p>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-xl border border-stone-800 bg-stone-900 p-3">
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
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-stone-800 text-xs text-stone-500">
                      &#9835;
                    </div>
                  )}
                  <span className="flex-1 truncate text-stone-300">{album.title}</span>
                  <span className="shrink-0 text-xs text-stone-500">
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
            className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-500"
          >
            Save to Database
          </button>
          <a
            href="/admin"
            className="text-sm text-stone-500 transition-colors hover:text-amber-400"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}

// -- Shared styles & helpers --

const inputClass =
  "mt-1.5 h-10 w-full rounded-md border border-stone-700 bg-stone-800 px-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/60";

const textareaClass =
  "mt-1.5 w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/60";

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
      <label className="block text-sm font-medium text-stone-300">
        {label}
        {required && <span className="text-amber-500"> *</span>}
      </label>
      {children}
    </fieldset>
  );
}
