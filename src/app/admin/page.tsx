import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteArtist, toggleFeaturedArtist } from "@/app/actions/artist";

export default async function AdminDashboard() {
  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Artists
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {artists.length} artist{artists.length !== 1 && "s"} in the
            database.
          </p>
        </div>
        <Link
          href="/admin/artists/new"
          className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-500"
        >
          Add Artist
        </Link>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-stone-800">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-900 text-xs uppercase tracking-widest text-stone-500">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Date Added</th>
              <th className="px-5 py-3 font-medium text-center">Featured</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {artists.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-stone-500">
                  No artists yet.{" "}
                  <Link
                    href="/admin/artists/new"
                    className="underline hover:text-amber-400 transition-colors"
                  >
                    Add one
                  </Link>
                  .
                </td>
              </tr>
            )}

            {artists.map((artist) => (
              <tr key={artist.id} className="hover:bg-stone-900/50 transition-colors">
                <td className="px-5 py-4">
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="font-medium text-white hover:text-amber-400 transition-colors"
                  >
                    {artist.name}
                  </Link>
                </td>
                <td className="px-5 py-4 font-mono text-xs text-stone-500">
                  {artist.slug}
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-stone-500">
                  {new Date(artist.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 text-center">
                  <form action={toggleFeaturedArtist}>
                    <input type="hidden" name="id" value={artist.id} />
                    <button
                      type="submit"
                      className="text-lg transition-colors hover:scale-110"
                      title={artist.isFeatured ? "Remove from Hall of Fame" : "Add to Hall of Fame"}
                    >
                      {artist.isFeatured ? (
                        <span className="text-amber-500">&#9733;</span>
                      ) : (
                        <span className="text-stone-600 hover:text-amber-500">&#9734;</span>
                      )}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4 text-right">
                  <form action={deleteArtist}>
                    <input type="hidden" name="id" value={artist.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-500 transition-colors hover:text-red-400"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
