"use client";

import { useEffect, useState, useMemo } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { MermaidDiagram } from "./MermaidDiagram";

interface MarkdownContentProps {
  content: string;
  inline?: boolean;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkHtml, { sanitize: true });

// Extract mermaid code blocks before markdown processing
const MERMAID_BLOCK = /```mermaid\n([\s\S]*?)```/g;
const MERMAID_PLACEHOLDER = "___MERMAID_BLOCK___";

/**
 * Render markdown content as HTML using remark
 * WikiLinks have already been converted to standard markdown links by the build script
 */
export function MarkdownContent({ content, inline = false }: MarkdownContentProps) {
  const [html, setHtml] = useState<string>("");

  // Extract mermaid blocks before markdown processing (they'd get mangled otherwise)
  const mermaidBlocks = useMemo(() => {
    const blocks: string[] = [];
    let match;
    const regex = new RegExp(MERMAID_BLOCK.source, "g");
    while ((match = regex.exec(content)) !== null) {
      blocks.push(match[1].trim());
    }
    return blocks;
  }, [content]);

  // Replace mermaid blocks with placeholders for markdown processing
  const contentWithPlaceholders = useMemo(() => {
    if (mermaidBlocks.length === 0) return content;
    let idx = 0;
    return content.replace(MERMAID_BLOCK, () => `\n${MERMAID_PLACEHOLDER}_${idx++}\n`);
  }, [content, mermaidBlocks]);

  useEffect(() => {
    processor.process(contentWithPlaceholders).then((result) => {
      // Restore broken-link spans that were in the source content
      let output = String(result);
      output = output.replace(
        /<span class="broken-link" title="([^"]+)">([^<]+)<\/span>/g,
        '<span class="text-[var(--vermillion)] line-through" title="$1">$2</span>'
      );
      setHtml(output);
    });
  }, [contentWithPlaceholders]);

  if (inline) {
    return (
      <span
        className="markdown-inline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // If no mermaid blocks, render as before
  if (mermaidBlocks.length === 0) {
    return (
      <div
        className="markdown-content prose max-w-none
          prose-headings:text-[var(--gold)] prose-headings:font-['Cinzel']
          prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3
          prose-h4:text-base prose-h4:font-medium prose-h4:mt-4 prose-h4:mb-2
          prose-p:text-[var(--parchment-dark)] prose-p:leading-relaxed
          prose-a:text-[var(--gold)] prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[var(--gold-bright)]
          prose-strong:text-[var(--parchment-light)]
          prose-ul:text-[var(--parchment-dark)]
          prose-ol:text-[var(--parchment-dark)]
          prose-li:text-[var(--parchment-dark)]
          prose-blockquote:border-[var(--gold-dark)] prose-blockquote:text-[var(--parchment-aged)] prose-blockquote:font-['IM_Fell_English'] prose-blockquote:italic
          prose-code:text-[var(--gold-bright)] prose-code:bg-[var(--study-panel)] prose-code:px-1 prose-code:rounded
          prose-pre:bg-[var(--study-dark)] prose-pre:border prose-pre:border-[var(--gold-shadow)]
          prose-table:text-[var(--parchment-dark)]
          prose-th:text-[var(--gold)] prose-th:border-[var(--gold-shadow)]
          prose-td:border-[var(--gold-shadow)]/50
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Split HTML at mermaid placeholders and interleave with MermaidDiagram components
  const parts = html.split(/<p>___MERMAID_BLOCK____(\d+)<\/p>/);

  return (
    <div
      className="markdown-content prose max-w-none
        prose-headings:text-[var(--gold)] prose-headings:font-['Cinzel']
        prose-h3:text-lg prose-h3:font-medium prose-h3:mt-6 prose-h3:mb-3
        prose-h4:text-base prose-h4:font-medium prose-h4:mt-4 prose-h4:mb-2
        prose-p:text-[var(--parchment-dark)] prose-p:leading-relaxed
        prose-a:text-[var(--gold)] prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[var(--gold-bright)]
        prose-strong:text-[var(--parchment-light)]
        prose-ul:text-[var(--parchment-dark)]
        prose-ol:text-[var(--parchment-dark)]
        prose-li:text-[var(--parchment-dark)]
        prose-blockquote:border-[var(--gold-dark)] prose-blockquote:text-[var(--parchment-aged)] prose-blockquote:font-['IM_Fell_English'] prose-blockquote:italic
        prose-code:text-[var(--gold-bright)] prose-code:bg-[var(--study-panel)] prose-code:px-1 prose-code:rounded
        prose-pre:bg-[var(--study-dark)] prose-pre:border prose-pre:border-[var(--gold-shadow)]
        prose-table:text-[var(--parchment-dark)]
        prose-th:text-[var(--gold)] prose-th:border-[var(--gold-shadow)]
        prose-td:border-[var(--gold-shadow)]/50
      "
    >
      {parts.map((part, i) => {
        // Even indices are HTML content, odd indices are mermaid block numbers
        if (i % 2 === 0) {
          return part ? (
            <div key={i} dangerouslySetInnerHTML={{ __html: part }} />
          ) : null;
        }
        const blockIdx = parseInt(part, 10);
        return mermaidBlocks[blockIdx] ? (
          <MermaidDiagram key={`mermaid-${blockIdx}`} chart={mermaidBlocks[blockIdx]} />
        ) : null;
      })}
    </div>
  );
}
