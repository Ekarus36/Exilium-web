"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#2a1f14",
            primaryTextColor: "#c4a882",
            primaryBorderColor: "#8b6914",
            lineColor: "#8b6914",
            secondaryColor: "#1a1209",
            tertiaryColor: "#2a1f14",
            fontFamily: "'Crimson Pro', serif",
            fontSize: "14px",
          },
          flowchart: { curve: "basis" },
        });

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Could not render diagram");
          console.error("Mermaid render error:", e);
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <pre className="text-xs text-[var(--ink-faded)] overflow-auto">
        {chart}
      </pre>
    );
  }

  return <div ref={containerRef} className="overflow-auto [&_svg]:max-w-full" />;
}
