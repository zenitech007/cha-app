"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";

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
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <fieldset>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </fieldset>

      <fieldset>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="h-10 w-full rounded-md bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {loading ? "Signing in\u2026" : "Sign In"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">CHA Admin</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage the database.
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-xs text-muted">
          &larr;{" "}
          <a href="/" className="underline hover:text-foreground">
            Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
