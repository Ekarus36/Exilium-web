"use client";

import { useState } from "react";
import type { ContentDocument } from "@/lib/content/types";
import { MarkdownContent } from "./MarkdownContent";

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
    <article className="prose prose-stone prose-invert max-w-none">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4 text-stone-100">
        {document.title}
      </h1>

      {/* Epigraph */}
      {document.epigraph && (
        <blockquote className="border-l-4 border-amber-600 pl-4 italic text-stone-400 mb-6">
          &ldquo;{document.epigraph}&rdquo;
        </blockquote>
      )}

      {/* Metadata */}
      {Object.keys(document.metadata).length > 0 && (
        <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-4 mb-6 not-prose">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(document.metadata).map(([key, value]) => (
                <tr key={key} className="border-b border-stone-800 last:border-0">
                  <td className="py-2 pr-4 font-medium text-stone-400 w-1/3">
                    {key}
                  </td>
                  <td className="py-2 text-stone-200">
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
        <div className="mt-8 p-4 bg-stone-900/50 border border-stone-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-stone-200">
            Connections
          </h2>
          <div className="mermaid-container overflow-auto">
            <pre className="text-xs text-stone-400">
              {document.connections}
            </pre>
            <p className="text-stone-500 text-sm mt-2 italic">
              (Mermaid diagram - will be rendered in production)
            </p>
          </div>
        </div>
      )}

      {/* See Also */}
      {document.seeAlso.length > 0 && (
        <div className="mt-8 p-4 bg-stone-900/50 border border-stone-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-stone-200">
            See Also
          </h2>
          <ul className="list-disc list-inside text-stone-400">
            {document.seeAlso.map((link) => (
              <li key={link} className="text-amber-400">
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
    variant === "secret" ? "border-amber-800/50" : "border-stone-800";
  const bgColor =
    variant === "secret" ? "bg-amber-950/20" : "bg-stone-900/30";
  const titleColor =
    variant === "secret" ? "text-amber-300" : "text-stone-200";

  return (
    <section
      id={sectionId}
      className={`mb-6 border ${borderColor} rounded-lg overflow-hidden`}
    >
      <button
        onClick={onToggle}
        className={`w-full p-4 ${bgColor} flex items-center justify-between text-left hover:bg-stone-900/50 transition-colors`}
      >
        <div>
          <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
          <p className="text-sm text-stone-500">{subtitle}</p>
        </div>
        <svg
          className={`w-5 h-5 text-stone-500 transform transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-stone-800">
          <MarkdownContent content={content} />
        </div>
      )}
    </section>
  );
}
