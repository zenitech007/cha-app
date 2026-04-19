"use client";

import Link from "next/link";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-white mb-3">
        Search failed
      </h2>
      <p className="text-stone-400 text-sm mb-6">
        {error.message || "Could not complete the search. Please try again."}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-sm rounded-full transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-stone-700 text-stone-300 text-sm rounded-full hover:bg-stone-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
