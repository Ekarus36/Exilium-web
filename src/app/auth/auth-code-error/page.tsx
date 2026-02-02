import Link from "next/link";
import { ArrowLeftIcon } from "@/components/ui/Icons";

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="text-[30rem] text-[var(--gold-dark)] opacity-[0.02] select-none">
          ✦
        </div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="parchment-card text-center">
          <div className="text-[var(--gold-shadow)] text-sm tracking-[0.5em] mb-4">
            ✧ ◆ ✧
          </div>
          <h1 className="font-['Cinzel',serif] text-3xl font-medium tracking-wide text-[var(--ink-brown)] mb-2">
            Authentication Failed
          </h1>
          <p className="font-['IM_Fell_English',serif] text-[var(--ink-sepia)] italic mb-8">
            The arcane sigils could not be verified
          </p>

          <p className="font-['Crimson_Pro',serif] text-[var(--ink-sepia)] mb-6">
            Something went wrong during sign-in. This can happen if the link
            expired or was already used. Please try again.
          </p>

          <Link
            href="/auth/login"
            className="btn-primary inline-flex justify-center"
          >
            Try Again
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-bright)] transition-colors duration-300 font-['Cinzel',serif] text-sm font-semibold tracking-[0.08em]"
          >
            <ArrowLeftIcon size={16} />
            <span className="opacity-60">✦</span> Return to Exilium{" "}
            <span className="opacity-60">✦</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
