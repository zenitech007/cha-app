"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturedSection from "./FeaturedSection";
import DirectorySection from "./DirectorySection";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import RegionalShowcase from "./RegionalShowcase";

interface CategoryBlock {
  title: string;
  artists: any[];
}

interface HomeClientProps {
  artists: any[];
  hallOfFame?: any[];
  categoryBlocks?: CategoryBlock[];
}

export default function HomeClient({
  artists,
  hallOfFame = [],
  categoryBlocks = [],
}: HomeClientProps) {
  const [activeSection, setActiveSection] = useState("home");

  const homeRef = useRef<HTMLDivElement>(null);
  const directoryRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    switch (section) {
      case "home": scrollTo(homeRef); break;
      case "directory": scrollTo(directoryRef); break;
      case "featured": scrollTo(featuredRef); break;
      case "about": scrollTo(aboutRef); break;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Navbar onNavClick={handleNavClick} activeSection={activeSection} />

      {/* Hero */}
      <div ref={homeRef}>
        <HeroSection
          onExplore={() => handleNavClick("directory")}
          onFeatured={() => handleNavClick("featured")}
          totalArtists={artists.length}
        />
      </div>

      {/* Hall of Fame — admin-curated featured artists */}
      {hallOfFame.length > 0 && (
        <div ref={featuredRef}>
          <FeaturedSection artists={hallOfFame} />
        </div>
      )}

      {/* Fallback: if no Hall of Fame, show first 4 artists as featured */}
      {hallOfFame.length === 0 && (
        <div ref={featuredRef}>
          <FeaturedSection artists={artists} />
        </div>
      )}

      {/* Regional Showcase — timezone-aware */}
      <RegionalShowcase />

      {/* Netflix-Style Genre Category Rows */}
      {categoryBlocks.length > 0 && (
        <section className="bg-stone-950 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto space-y-14">
            {categoryBlocks.map(({ title, artists: genreArtists }) => (
              <div key={title}>
                <h3
                  className="text-xl sm:text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {title}
                </h3>

                <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                  {genreArtists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.slug}`}
                      className="group w-40 sm:w-48 shrink-0 snap-start relative aspect-[4/5] overflow-hidden rounded-xl border border-stone-800 hover:border-amber-700/40 transition-all duration-300"
                    >
                      {artist.imageUrl ? (
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-stone-800 flex items-center justify-center">
                          <span className="text-4xl font-bold text-stone-600">
                            {artist.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="font-bold text-white text-sm leading-tight truncate group-hover:text-amber-400 transition-colors">
                          {artist.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Decorative Divider */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-4 py-4">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-amber-900/40 to-transparent" />
          <svg className="h-5 w-5 text-amber-800/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
          </svg>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-amber-900/40 to-transparent" />
        </div>
      </div>

      {/* Directory */}
      <div ref={directoryRef}>
        <DirectorySection artists={artists} />
      </div>

      {/* About */}
      <div ref={aboutRef}>
        <AboutSection />
      </div>

      <Footer />
    </div>
  );
}
