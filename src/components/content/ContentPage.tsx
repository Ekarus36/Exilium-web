"use client";

import { useState } from "react";
import type { ContentDocument } from "@/lib/content/types";
import { MarkdownContent } from "./MarkdownContent";
import { MermaidDiagram } from "./MermaidDiagram";
import { ChevronDownIcon } from "@/components/ui/Icons";

interface ContentPageProps {
  document: ContentDocument;
  accessLevel: "player" | "dm";
}

export function ContentPage({ document, accessLevel }: ContentPageProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "at-a-glance",
    "common-knowledge",
    ...(accessLevel === "dm" ? ["secret-knowledge"] : []),
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <article className="prose max-w-none">
      {/* Title */}
      <h1 className="text-3xl font-['Cinzel'] font-medium mb-4 text-[var(--gold)]">
        {document.title}
      </h1>

      {/* Epigraph */}
      {document.epigraph && (
        <blockquote className="border-l-4 border-[var(--gold-dark)] pl-4 italic text-[var(--parchment-aged)] mb-6 font-['IM_Fell_English']">
          &ldquo;{document.epigraph}&rdquo;
        </blockquote>
      )}

      {/* Metadata */}
      {Object.keys(document.metadata).length > 0 && (
        <div className="bg-[var(--study-panel)] border border-[var(--gold-shadow)] rounded p-4 mb-6 not-prose">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(document.metadata).map(([key, value]) => (
                <tr key={key} className="border-b border-[var(--gold-shadow)]/50 last:border-0">
                  <td className="py-2 pr-4 font-medium text-[var(--parchment-aged)] w-1/3 font-['Cinzel'] text-xs uppercase tracking-wider">
                    {key}
                  </td>
                  <td className="py-2 text-[var(--parchment)]">
                    <MarkdownContent content={value} inline />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* At a Glance */}
      {document.atAGlance && (
        <ContentSection
          title="At a Glance"
          subtitle="What anyone would know"
          content={document.atAGlance}
          sectionId="at-a-glance"
          isExpanded={expandedSections.includes("at-a-glance")}
          onToggle={() => toggleSection("at-a-glance")}
        />
      )}

      {/* Common Knowledge */}
      {document.commonKnowledge && (
        <ContentSection
          title="Common Knowledge"
          subtitle="What visitors and residents know"
          content={document.commonKnowledge}
          sectionId="common-knowledge"
          isExpanded={expandedSections.includes("common-knowledge")}
          onToggle={() => toggleSection("common-knowledge")}
        />
      )}

      {/* Secret Knowledge (DM only) */}
      {accessLevel === "dm" && document.secretKnowledge && (
        <ContentSection
          title="Secret Knowledge"
          subtitle="DM-only information"
          content={document.secretKnowledge}
          sectionId="secret-knowledge"
          isExpanded={expandedSections.includes("secret-knowledge")}
          onToggle={() => toggleSection("secret-knowledge")}
          variant="secret"
        />
      )}

      {/* Connections Diagram */}
      {document.connections && (
        <div className="mt-8 p-4 bg-[var(--study-panel)] border border-[var(--gold-shadow)] rounded">
          <h2 className="text-lg font-['Cinzel'] font-medium mb-4 text-[var(--gold)]">
            Connections
          </h2>
          <div className="mermaid-container overflow-auto">
            <MermaidDiagram chart={document.connections} />
          </div>
        </div>
      )}

      {/* See Also */}
      {document.seeAlso.length > 0 && (
        <div className="mt-8 p-4 bg-[var(--study-panel)] border border-[var(--gold-shadow)] rounded">
          <h2 className="text-lg font-['Cinzel'] font-medium mb-2 text-[var(--gold)]">
            See Also
          </h2>
          <ul className="list-disc list-inside text-[var(--parchment-aged)]">
            {document.seeAlso.map((link) => (
              <li key={link} className="text-[var(--gold)]">
                {link}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

interface ContentSectionProps {
  title: string;
  subtitle: string;
  content: string;
  sectionId: string;
  isExpanded: boolean;
  onToggle: () => void;
  variant?: "default" | "secret";
}

function ContentSection({
  title,
  subtitle,
  content,
  sectionId,
  isExpanded,
  onToggle,
  variant = "default",
}: ContentSectionProps) {
  const borderColor =
    variant === "secret" ? "border-[var(--vermillion-dark)]" : "border-[var(--gold-shadow)]";
  const bgColor =
    variant === "secret" ? "bg-[var(--vermillion-dark)]/10" : "bg-[var(--study-panel)]";
  const titleColor =
    variant === "secret" ? "text-[var(--vermillion)]" : "text-[var(--gold)]";

  return (
    <section
      id={sectionId}
      className={`mb-6 border ${borderColor} rounded overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className={`w-full p-4 ${bgColor} flex items-center justify-between text-left hover:bg-[var(--study-wood)] transition-colors`}
      >
        <div>
          <h2 className={`text-lg font-['Cinzel'] font-medium ${titleColor}`}>{title}</h2>
          <p className="text-sm text-[var(--ink-faded)]">{subtitle}</p>
        </div>
        <ChevronDownIcon size={20} className={`text-[var(--ink-faded)] transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`} />
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-[var(--gold-shadow)]/50">
          <MarkdownContent content={content} />
        </div>
      )}
    </section>
  );
}
