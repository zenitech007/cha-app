"use client";

export default function HeroSection({
  onExplore,
  onFeatured,
  totalArtists,
}: {
  onExplore: () => void;
  onFeatured: () => void;
  totalArtists: number;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Country landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/70 via-stone-950/50 to-stone-950" />
        <div className="absolute inset-0 bg-linear-to-r from-stone-950/80 via-transparent to-stone-950/60" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-32 left-8 opacity-20">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          className="text-amber-500"
        >
          <circle
            cx="60"
            cy="60"
            r="58"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="absolute bottom-32 right-8 opacity-10">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          className="text-amber-400"
        >
          <circle
            cx="100"
            cy="100"
            r="98"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 8"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-600/40 bg-amber-900/20 backdrop-blur-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">
            The Premier Country Music Reference
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="block">Country</span>
          <span className="block text-amber-400 italic">Heritage</span>
          <span className="block">Alliance</span>
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-linear-to-r from-transparent to-amber-600/60" />
          <svg
            className="w-5 h-5 text-amber-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-amber-600/60" />
        </div>

        <p className="text-stone-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          The definitive reference database and directory celebrating the
          legends, icons, and rising stars of country music heritage — from
          classic honky tonk to modern Americana.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={onExplore}
            className="group px-8 py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-full transition-all duration-300 shadow-xl shadow-amber-900/40 hover:shadow-amber-700/50 hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z"
              />
            </svg>
            Explore the Directory
          </button>
          <button
            onClick={onFeatured}
            className="px-8 py-4 bg-transparent border border-amber-600/50 hover:border-amber-500 text-amber-300 hover:text-amber-200 font-semibold rounded-full transition-all duration-300 hover:bg-amber-900/20 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            Featured Artists
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { value: `${totalArtists}+`, label: "Artists Listed" },
            { value: "8", label: "Genres Covered" },
            { value: "60+", label: "Years of History" },
            { value: "5", label: "Historic Eras" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl sm:text-3xl font-bold text-amber-400"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
              </div>
              <div className="text-stone-500 text-xs tracking-widest uppercase mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-600">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-stone-600 to-transparent animate-pulse" />
      </div>
    </section>
  );
}