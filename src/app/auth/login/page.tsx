"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SpinnerIcon, ArrowLeftIcon } from "@/components/ui/Icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Decorative background compass */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-[30rem] text-[var(--gold-dark)] opacity-[0.02] select-none">
          ✦
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Parchment-style card */}
        <div className="parchment-card">
          {/* Decorative header */}
          <div className="text-center mb-8">
            <div className="text-[var(--gold-shadow)] text-sm tracking-[0.5em] mb-4">
              ✧ ◆ ✧
            </div>
            <h1 className="font-['Cinzel',serif] text-3xl font-medium tracking-wide text-[var(--ink-brown)] mb-2">
              Welcome Back
            </h1>
            <p className="font-['IM_Fell_English',serif] text-[var(--ink-sepia)] italic">
              Sign in to chronicle your campaigns
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-[var(--vermillion)]/10 border border-[var(--vermillion-dark)] text-[var(--vermillion)] px-4 py-3 rounded text-sm font-['Crimson_Pro',serif]">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase text-[var(--ink-sepia)]"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="scribe@veraheim.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="font-['Cinzel',serif] text-xs tracking-[0.2em] uppercase text-[var(--ink-sepia)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your secret phrase"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <SpinnerIcon size={16} />
                  Signing In...
                </span>
              ) : (
                "Enter the Archive"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--gold-shadow)] to-transparent" />
            <span className="text-[var(--gold-shadow)] text-xs">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--gold-shadow)] to-transparent" />
          </div>

          <p className="text-center font-['Crimson_Pro',serif] text-[var(--ink-sepia)]">
            New to the archives?{" "}
            <Link
              href="/auth/signup"
              className="text-[var(--ink-brown)] font-semibold hover:text-[var(--gold-dark)] transition-colors underline decoration-[var(--gold-shadow)] underline-offset-2"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-bright)] transition-colors duration-300 font-['Cinzel',serif] text-sm font-semibold tracking-[0.08em]"
          >
            <ArrowLeftIcon size={16} />
            <span className="opacity-60">✦</span> Return to Exilium <span className="opacity-60">✦</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
