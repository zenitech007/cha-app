import Link from "next/link";
import { signOut } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-73px)]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-surface sm:flex sm:flex-col">
        <div className="px-5 py-6">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Admin Panel
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          <SidebarLink href="/admin">Artists</SidebarLink>
          <SidebarLink href="/admin/artists/new">Add Artist</SidebarLink>
          <div className="my-4 border-t border-border" />
          <SidebarLink href="/">View Site &rarr;</SidebarLink>
        </nav>
        <div className="border-t border-border px-3 py-4">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-border/50 hover:text-foreground"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-4 border-b border-border bg-surface px-5 py-3 sm:hidden">
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Admin
          </p>
          <div className="flex flex-1 gap-4 text-sm">
            <Link href="/admin" className="text-muted hover:text-foreground">
              Artists
            </Link>
            <Link
              href="/admin/artists/new"
              className="text-muted hover:text-foreground"
            >
              Add
            </Link>
            <Link href="/" className="text-muted hover:text-foreground">
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
              className="text-sm text-muted hover:text-foreground"
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
      className="block rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-border/50 hover:text-foreground"
    >
      {children}
    </Link>
  );
}
