"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-stone-400 text-sm mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-sm rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
