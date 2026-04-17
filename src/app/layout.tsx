import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Universal Music Hub",
  description:
    "The authoritative global reference database for music artists, albums, and discographies worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      {/* 2. ADDED overflow-x-hidden TO KILL THE HORIZONTAL WOBBLE */}
      <body className="flex min-h-full flex-col bg-stone-950 text-stone-100 font-sans overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}