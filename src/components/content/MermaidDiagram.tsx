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
          securityLevel: "loose",
          theme: "base",
          themeVariables: {
            // Background & surfaces
            background: "#1a1611",
            mainBkg: "#2d2519",
            secondBkg: "#241f18",
            tertiaryColor: "#1a1611",

            // Text
            primaryTextColor: "#e8d9b8",
            secondaryTextColor: "#c9b896",
            tertiaryTextColor: "#c9b896",

            // Borders & lines
            primaryBorderColor: "#5c4a1f",
            secondaryBorderColor: "#5c4a1f",
            tertiaryBorderColor: "#5c4a1f",
            lineColor: "#8b6f2f",
            textColor: "#e8d9b8",

            // Node colors
            primaryColor: "#2d2519",
            secondaryColor: "#241f18",

            // Accent
            pie1: "#b8943d",
            pie2: "#8b6f2f",
            pie3: "#5c4a1f",
            pie4: "#d4a853",
            pie5: "#967b32",
            pie6: "#6b5623",
            pie7: "#c4a24a",

            // Labels & notes
            noteBkgColor: "#241f18",
            noteTextColor: "#c9b896",
            noteBorderColor: "#5c4a1f",
            labelBoxBkgColor: "#2d2519",
            labelBoxBorderColor: "#5c4a1f",
            labelTextColor: "#e8d9b8",

            // Arrows & edges
            edgeLabelBackground: "#1a1611",
            clusterBkg: "#241f18",
            clusterBorder: "#5c4a1f",
            titleColor: "#b8943d",

            // Typography
            fontFamily: "'Crimson Pro', serif",
            fontSize: "14px",
          },
          flowchart: { curve: "basis", htmlLabels: true },
        });

        // Strip inline style directives designed for light backgrounds
        const cleaned = chart.replace(/^\s*style\s+\S+\s+fill:#[^,\n]+.*$/gm, "");

        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(id, cleaned);

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
