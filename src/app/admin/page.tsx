import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteArtist } from "@/app/actions/artist";

export default async function AdminDashboard() {
  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Artists</h1>
          <p className="mt-1 text-sm text-muted">
            {artists.length} artist{artists.length !== 1 && "s"} in the
            database.
          </p>
        </div>
        <Link
          href="/admin/artists/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
        >
          Add Artist
        </Link>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-widest text-muted">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Slug</th>
              <th className="pb-3 pr-4 font-medium">Date Added</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {artists.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">
                  No artists yet.{" "}
                  <Link
                    href="/admin/artists/new"
                    className="underline hover:text-foreground"
                  >
                    Add one
                  </Link>
                  .
                </td>
              </tr>
            )}

            {artists.map((artist) => (
              <tr key={artist.id}>
                <td className="py-4 pr-4">
                  <Link
                    href={`/artists/${artist.slug}`}
                    className="font-medium hover:underline"
                  >
                    {artist.name}
                  </Link>
                </td>
                <td className="py-4 pr-4 font-mono text-xs text-muted">
                  {artist.slug}
                </td>
                <td className="py-4 pr-4 whitespace-nowrap text-muted">
                  {new Date(artist.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-4 text-right">
                  <form action={deleteArtist}>
                    <input type="hidden" name="id" value={artist.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-600 transition-colors hover:text-red-800"
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
