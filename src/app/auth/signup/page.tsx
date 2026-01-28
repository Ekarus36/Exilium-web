"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-stone-100">
              Check your email
            </h1>
            <p className="text-stone-400 mb-6">
              We&apos;ve sent a confirmation link to <strong>{email}</strong>.
              Click the link to activate your account.
            </p>
            <Link
              href="/auth/login"
              className="text-amber-400 hover:text-amber-300"
            >
              Back to login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-2 text-stone-100">
            Create an account
          </h1>
          <p className="text-stone-400 mb-6">
            Sign up to save campaigns, creatures, and encounters
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
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
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-stone-300 mb-1"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-stone-400 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-amber-400 hover:text-amber-300"
            >
              Sign in
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
