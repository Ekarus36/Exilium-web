"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-6">📜</div>
        <h1 className="text-4xl font-['Cinzel'] font-medium text-[var(--vermillion)] mb-4">
          The Scroll Has Torn
        </h1>
        <div className="divider-ornate mb-6" />
        <p className="text-[var(--parchment-aged)] text-lg font-['IM_Fell_English'] italic mb-8">
          An ancient ward has disrupted this page. The archivists have been
          notified.
        </p>
        <button onClick={reset} className="btn-primary">
          Attempt to Mend
        </button>
      </div>
    </div>
  );
}
