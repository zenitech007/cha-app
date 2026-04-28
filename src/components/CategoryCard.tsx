"use client";

import Link from "next/link";

export default function CategoryCard({
  title,
  icon,
  artistCount,
  gradient,
  href,
}: {
  title: string;
  icon: string;
  artistCount: number;
  gradient: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-900/20 block"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />

      {/* Glass surface */}
      <div className="relative bg-stone-900/60 backdrop-blur-sm p-6 sm:p-8 flex flex-col items-start gap-3 min-h-[140px]">
        {/* Icon */}
        <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">
          {icon}
        </span>

        {/* Title */}
        <h3
          className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>

        {/* Artist count */}
        <span className="text-stone-500 text-xs font-medium tracking-wide">
          {artistCount} {artistCount === 1 ? "artist" : "artists"}
        </span>

        {/* Arrow indicator */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
