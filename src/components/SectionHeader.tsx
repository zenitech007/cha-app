"use client";

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  if (align === "left") {
    return (
      <div className="mb-8 sm:mb-10">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-700/30 bg-amber-900/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {badge}
            </span>
          </div>
        )}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-stone-500 text-sm sm:text-base mt-2 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-8 sm:mb-12">
      <div className="h-px flex-1 bg-linear-to-r from-transparent to-amber-900/50" />
      <div className="text-center">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/30 bg-amber-900/10 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {badge}
            </span>
          </div>
        )}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-stone-500 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      <div className="h-px flex-1 bg-linear-to-l from-transparent to-amber-900/50" />
    </div>
  );
}
