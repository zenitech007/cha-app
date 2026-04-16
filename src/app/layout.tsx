import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Country Heritage Alliance",
  description:
    "The authoritative reference database for country music artists, albums, tours, and charitable work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* Sticky Glassmorphism Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-5">
            <Link 
              href="/" 
              className="shrink-0 tracking-tight transition-colors hover:text-(--color-accent)"
            >
              <span className="text-lg font-semibold">CHA</span>
              <span className="ml-2 hidden text-sm font-normal text-muted sm:inline">
                Country Heritage Alliance
              </span>
            </Link>

            <div className="flex items-center gap-5">
              <Suspense>
                <SearchBar />
              </Suspense>
              <Link
                href="/artists"
                className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-(--color-accent)"
              >
                Artists
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-auto border-t border-border bg-surface">
          <div className="mx-auto max-w-5xl px-6 py-8 text-center text-xs text-muted">
            &copy; {new Date().getFullYear()} Country Heritage Alliance. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}