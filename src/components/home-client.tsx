"use client";

import { useState, useRef } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import TrendingSection from "./TrendingSection";
import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";
import FeaturedSection from "./FeaturedSection";
import AlbumsSection from "./AlbumsSection";
import RecentlyAddedSection from "./RecentlyAddedSection";
import RegionalShowcase from "./RegionalShowcase";
import DirectorySection from "./DirectorySection";
import AboutSection from "./AboutSection";
import Footer from "./Footer";
import MusicPlayer from "./MusicPlayer";

interface CategoryBlock {
  title: string;
  artists: any[];
  icon: string;
  gradient: string;
}

interface HomeClientProps {
  artists: any[];
  hallOfFame?: any[];
  categoryBlocks?: CategoryBlock[];
  recentlyAdded?: any[];
  topAlbums?: any[];
  trendingArtists?: any[];
}

export default function HomeClient({
  artists,
  hallOfFame = [],
  categoryBlocks = [],
  recentlyAdded = [],
  topAlbums = [],
  trendingArtists = [],
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
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      <Navbar onNavClick={handleNavClick} activeSection={activeSection} />

      {/* Hero */}
      <div ref={homeRef}>
        <HeroSection
          onExplore={() => handleNavClick("directory")}
          onFeatured={() => handleNavClick("featured")}
          totalArtists={artists.length}
        />
      </div>

      {/* Trending Now */}
      {trendingArtists.length > 0 && (
        <TrendingSection artists={trendingArtists} />
      )}

      {/* Browse by Categories */}
      {categoryBlocks.length > 0 && (
        <section className="bg-stone-950 py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader badge="Explore" title="Browse by Category" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {categoryBlocks.map(({ title, artists: catArtists, icon, gradient }) => (
                <CategoryCard
                  key={title}
                  title={title}
                  icon={icon}
                  artistCount={catArtists.length}
                  gradient={gradient}
                  href={`/search?q=${encodeURIComponent(title)}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hall of Fame — admin-curated featured artists */}
      <div ref={featuredRef}>
        <FeaturedSection artists={hallOfFame.length > 0 ? hallOfFame : artists} />
      </div>

      {/* Top Albums */}
      {topAlbums.length > 0 && (
        <AlbumsSection albums={topAlbums} />
      )}

      {/* Recently Added */}
      {recentlyAdded.length > 0 && (
        <RecentlyAddedSection artists={recentlyAdded} />
      )}

      {/* Regional Showcase — timezone-aware */}
      <RegionalShowcase />

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

      {/* Sticky Music Player */}
      <MusicPlayer />
    </div>
  );
}
