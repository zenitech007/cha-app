"use client";

import { useState, useRef } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import FeaturedSection from "./FeaturedSection";
import DirectorySection from "./DirectorySection";
import AboutSection from "./AboutSection";
import ArtistModal from "./ArtistModal";
import Footer from "./Footer";

// We accept the artists fetched from Prisma as a prop
export default function HomeClient({ artists }: { artists: any[] }) {
    const [activeSection, setActiveSection] = useState("home");
    const [selectedArtist, setSelectedArtist] = useState<any | null>(null);

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

    const handleArtistClick = (artist: any) => {
        setSelectedArtist(artist);
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

            {/* Featured Artists (Pass Prisma data down) */}
            <div ref={featuredRef}>
                <FeaturedSection artists={artists} onArtistClick={handleArtistClick} />
            </div>

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

            {/* Directory (Pass Prisma data down) */}
            <div ref={directoryRef}>
                <DirectorySection artists={artists} onArtistClick={handleArtistClick} />
            </div>

            {/* About */}
            <div ref={aboutRef}>
                <AboutSection />
            </div>

            <Footer />

            {/* Artist Modal */}
            <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />
        </div>
    );
}