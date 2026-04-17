"use client";

export default function AboutSection() {
  const pillars = [
    {
      icon: "🌍",
      title: "Comprehensive Records",
      desc: "Detailed profiles covering biographies, discographies, awards, and career timelines for artists spanning decades of global music history.",
    },
    {
      icon: "🏆",
      title: "Heritage Preservation",
      desc: "Dedicated to safeguarding the legacy of music legends across all cultures, from early classical composers to the defining voices of modern pop and afrobeat.",
    },
    {
      icon: "🎵",
      title: "Genre Exploration",
      desc: "Navigate the rich tapestry of musical genres — from traditional Folk to Electronic, Hip-Hop, Classical, Rock, Afrobeat, and beyond.",
    },
    {
      icon: "🤝",
      title: "Community Driven",
      desc: "Built in partnership with historians, music scholars, and dedicated fans who share a passion for authentic musical cultures and storytelling.",
    },
  ];

  const timeline = [
    { year: "Pre-1950s", label: "Classical, Jazz & Folk Roots", color: "from-amber-900 to-amber-700" },
    { year: "1950s–60s", label: "Rock & Roll Revolution", color: "from-amber-700 to-yellow-600" },
    { year: "1970s–80s", label: "Disco, Funk & Early Hip-Hop", color: "from-yellow-600 to-orange-600" },
    { year: "1990s–00s", label: "Pop Explosion & Electronic Emergence", color: "from-orange-600 to-red-700" },
    { year: "2010s+", label: "Global Pop & Contemporary Afrobeat", color: "from-red-700 to-rose-800" },
  ];

  return (
    <section className="bg-stone-950 py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-700/30 bg-amber-900/10 mb-4">
            <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              Our Mission
            </span>
          </div>
          <h2
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About Universal Music Hub
          </h2>
          <p className="text-stone-400 max-w-3xl mx-auto text-lg leading-relaxed">
            The{" "}
            <span className="text-amber-400 font-semibold">
              Universal Music Hub
            </span>{" "}
            is a dedicated initiative committed to documenting, celebrating, and
            preserving the rich history of global music. We serve as the
            definitive reference for researchers, fans, and historians worldwide.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-stone-900 border border-stone-800 rounded-2xl p-6 hover:border-amber-800/40 transition-all duration-300 group hover:bg-stone-900/80"
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <h3
                className="text-white font-bold text-lg mb-3 group-hover:text-amber-300 transition-colors"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {p.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 sm:p-10 mb-16">
          <h3
            className="text-white text-2xl font-bold text-center mb-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            A Journey Through Global Music History
          </h3>
          <div className="space-y-4">
            {timeline.map((item) => (
              <div key={item.year} className="flex items-center gap-4 group">
                <div className="w-28 shrink-0 text-right">
                  <span className="text-amber-500 font-bold text-sm">{item.year}</span>
                </div>
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-3 h-3 rounded-full bg-linear-to-br ${item.color} shrink-0 group-hover:scale-125 transition-transform`}
                  />
                  <div className="flex-1 h-0.5 bg-linear-to-r from-stone-700 to-transparent" />
                </div>
                <div className="flex-1">
                  <span className="text-stone-300 text-sm font-medium">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-900/40 via-stone-900 to-stone-900 border border-amber-800/30 p-10 sm:p-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🎤</div>
            <h3
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Know a Musical Legend?
            </h3>
            <p className="text-stone-400 max-w-xl mx-auto mb-8 text-sm leading-relaxed">
              We're always expanding our database. If you know of an artist who
              deserves to be recognized in our directory, we'd love to hear from
              you. Help us preserve global music heritage for generations to come.
            </p>
            <button className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-full transition-all duration-200 shadow-xl shadow-amber-900/30 hover:scale-105">
              Submit an Artist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}