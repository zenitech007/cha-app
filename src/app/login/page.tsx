"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import SiteShell from "@/components/SiteShell";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && (
        <div className="rounded-md border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <fieldset>
        <label htmlFor="email" className="block text-sm font-medium text-stone-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 h-10 w-full rounded-md border border-stone-700 bg-stone-800 px-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/60"
        />
      </fieldset>

      <fieldset>
        <label htmlFor="password" className="block text-sm font-medium text-stone-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 h-10 w-full rounded-md border border-stone-700 bg-stone-800 px-3 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-600/40 focus:border-amber-600/60"
        />
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="h-10 w-full rounded-full bg-amber-600 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-500 disabled:opacity-50"
      >
        {loading ? "Signing in\u2026" : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-linear-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/40">
              <svg className="w-7 h-7 text-stone-950" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/>
              </svg>
            </div>
            <h1
              className="text-2xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Login
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Sign in to manage the database.
            </p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-xs text-stone-600">
            &larr;{" "}
            <Link href="/" className="underline hover:text-amber-400 transition-colors">
              Back to site
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
