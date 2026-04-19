"use client";

import { useState, useEffect, useCallback } from "react";

interface CharityLink {
  organizationName: string;
  donationUrl: string | null;
}

export function CharityDrawer({
  artistName,
  charityLinks,
}: {
  artistName: string;
  charityLinks: CharityLink[];
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2.5 rounded-full border border-stone-700 bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-200 transition-all hover:border-amber-700/50 hover:shadow-sm hover:shadow-amber-900/20"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-600/20" />
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="relative h-4 w-4 text-amber-500"
          >
            <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.803-2.033C3.534 12.303 1.5 9.879 1.5 7A4.5 4.5 0 0110 4.914 4.5 4.5 0 0118.5 7c0 2.879-2.034 5.303-4.164 7.187a22.045 22.045 0 01-3.965 2.715l-.019.01-.005.003h-.002a.723.723 0 01-.682 0l-.002-.001z" />
          </svg>
        </span>
        Support {artistName}&apos;s Cause
      </button>

      {/* ── Backdrop + Drawer ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
            style={{ animation: "fadeIn 200ms ease-out" }}
            onClick={close}
          />

          {/* Drawer panel */}
          <div
            className="relative flex w-full max-w-md flex-col bg-stone-900 border-l border-stone-800 shadow-2xl shadow-stone-950"
            style={{ animation: "slideIn 300ms cubic-bezier(0.16,1,0.3,1)" }}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-800 hover:text-white"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>

            {/* Content */}
            <div className="flex flex-1 flex-col overflow-y-auto px-8 py-12">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Charity Spotlight
              </p>

              <h2
                className="mt-6 text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {artistName} Gives Back
              </h2>

              <p className="mt-4 leading-relaxed text-stone-400">
                {artistName} proudly supports the following cause
                {charityLinks.length !== 1 && "s"}. Your contribution makes a
                real difference in the communities and missions these
                organizations serve.
              </p>

              <div className="mt-10 space-y-6">
                {charityLinks.map((link, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-stone-800 bg-stone-950/50 p-6"
                  >
                    <p className="text-lg font-semibold text-white">
                      {link.organizationName}
                    </p>

                    {link.donationUrl ? (
                      <a
                        href={link.donationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 flex h-12 items-center justify-center rounded-full bg-amber-600 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-500"
                      >
                        Donate on Official Site &rarr;
                      </a>
                    ) : (
                      <p className="mt-5 text-sm text-stone-500">
                        No donation link available at this time.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-stone-800 px-8 py-5">
              <p className="text-center text-xs text-stone-600">
                CHA does not process donations directly. All links lead to
                the official organization&apos;s website.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
