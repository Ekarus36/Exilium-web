import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6 animate-float">🧭</div>
        <h1 className="text-4xl font-['Cinzel'] font-medium text-[var(--gold)] mb-4">
          This Passage Leads Nowhere
        </h1>
        <div className="divider-ornate mb-6" />
        <p className="text-[var(--parchment-aged)] text-lg font-['IM_Fell_English'] italic mb-8">
          The path you seek has been lost to time, or perhaps it never existed
          in these chronicles at all.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Return to the Study
          </Link>
          <Link href="/player" className="btn-secondary">
            Browse the Wiki
          </Link>
        </div>
      </div>
    </div>
  );
}
