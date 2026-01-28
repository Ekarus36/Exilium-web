"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-2 text-stone-100">
            Welcome back
          </h1>
          <p className="text-stone-400 mb-6">
            Sign in to save your campaigns and creatures
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-950/50 border border-red-800 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-stone-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-stone-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-stone-400 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-amber-400 hover:text-amber-300"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center text-stone-500 text-sm">
          <Link href="/" className="hover:text-stone-300">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
