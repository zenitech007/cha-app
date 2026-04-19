"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const currentQuery = searchParams.get("q") ?? "";

  // Sync input value on mount / back-navigation
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = currentQuery;
    }
  }, [currentQuery]);

  const navigate = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/");
      }
    },
    [router],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => navigate(value), 300);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (timerRef.current) clearTimeout(timerRef.current);
      navigate(e.currentTarget.value);
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search artists\u2026"
        defaultValue={currentQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-9 w-44 rounded-md border border-stone-700 bg-stone-800 px-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/60 sm:w-56"
      />
    </div>
  );
}
