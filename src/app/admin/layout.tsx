import Link from "next/link";
import { signOut } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-stone-800 bg-stone-900 sm:flex sm:flex-col">
        <div className="px-5 py-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-stone-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
              </svg>
            </div>
            <span className="text-amber-400 font-bold text-xs tracking-widest uppercase">UMH Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <SidebarLink href="/admin">Artists</SidebarLink>
          <SidebarLink href="/admin/artists/new">Add Artist</SidebarLink>
          <div className="my-4 border-t border-stone-800" />
          <SidebarLink href="/">View Site &rarr;</SidebarLink>
        </nav>
        <div className="border-t border-stone-800 px-3 py-4">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-stone-500 transition-colors hover:bg-stone-800 hover:text-amber-400"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-4 border-b border-stone-800 bg-stone-900 px-5 py-3 sm:hidden">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Admin
          </p>
          <div className="flex flex-1 gap-4 text-sm">
            <Link href="/admin" className="text-stone-400 hover:text-amber-400 transition-colors">
              Artists
            </Link>
            <Link
              href="/admin/artists/new"
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Add
            </Link>
            <Link href="/" className="text-stone-400 hover:text-amber-400 transition-colors">
              Site &rarr;
            </Link>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="flex-1 px-6 py-8 sm:px-10 sm:py-10">{children}</div>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-sm text-stone-400 transition-colors hover:bg-stone-800 hover:text-amber-400"
    >
      {children}
    </Link>
  );
}
