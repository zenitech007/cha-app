"use client";

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-900 px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40">
              <svg
                className="w-5 h-5 text-stone-950"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </div>
            <div>
              <div
                className="text-amber-400 font-bold text-base tracking-widest uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Universal Music Hub
              </div>
              <div className="text-stone-600 text-xs">
                The Premier Global Music Reference Database
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 text-stone-500 text-sm">
            {[
              "Directory",
              "Featured Artists",
              "Eras & Genres",
              "About",
              "Submit Artist",
              "Contact",
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-amber-400 transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-600 text-xs">
          <p>
            © {new Date().getFullYear()} Universal Music Hub. All rights
            reserved.
          </p>
          <div className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 text-amber-800"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Preserving global music heritage since 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}