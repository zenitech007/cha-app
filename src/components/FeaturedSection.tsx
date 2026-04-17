"use client";

export default function FeaturedSection({
  artists,
  onArtistClick,
}: {
  artists: any[];
  onArtistClick: (a: any) => void;
}) {
  // Show the first artist as "main featured", the next few as secondary
  const [main, ...rest] = artists.slice(0, 4);

  return (
    <section className="bg-stone-950 py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-amber-900/50" />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/30 bg-amber-900/10 mb-2">
              <svg
                className="w-3.5 h-3.5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">
                Hall of Honor
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Artists
            </h2>
          </div>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-amber-900/50" />
        </div>

        {/* Main Featured */}
        {main && (
          <button
            onClick={() => onArtistClick(main)}
            className="group w-full mb-6 relative overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/20"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 relative h-72 md:h-auto overflow-hidden">
                {main.imageUrl ? (
                  <img
                    src={main.imageUrl}
                    alt={main.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center min-h-72">
                    <svg className="w-20 h-20 text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-stone-900 hidden md:block" />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-transparent to-transparent md:hidden" />
              </div>
              <div className="md:w-3/5 p-5 sm:p-8 md:p-10 text-left flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-amber-600/20 border border-amber-600/30 text-amber-400 text-xs font-bold rounded-full tracking-wider">
                    Featured
                  </span>
                </div>
                <h3
                  className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {main.name}
                </h3>
                {main.bio && (
                  <p className="text-stone-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {main.bio}
                  </p>
                )}
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm group-hover:text-amber-400 transition-colors">
                  View Full Profile
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Secondary Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {rest.map((artist) => (
            <button
              key={artist.id}
              onClick={() => onArtistClick(artist)}
              className="group relative overflow-hidden rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-700/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/20 hover:-translate-y-1 text-left"
            >
              <div className="relative h-48 overflow-hidden">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                    <svg className="w-12 h-12 text-stone-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/20 to-transparent" />
              </div>
              <div className="p-5">
                <h3
                  className="text-white text-xl font-bold mb-1 group-hover:text-amber-300 transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {artist.name}
                </h3>
                {artist.bio && (
                  <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                    {artist.bio}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
