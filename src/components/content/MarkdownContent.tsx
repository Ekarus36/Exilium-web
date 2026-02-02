"use client";

import { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

interface MarkdownContentProps {
  content: string;
  inline?: boolean;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkHtml, { sanitize: true });

/**
 * Render markdown content as HTML using remark
 * WikiLinks have already been converted to standard markdown links by the build script
 */
export function MarkdownContent({ content, inline = false }: MarkdownContentProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    processor.process(content).then((result) => {
      // Restore broken-link spans that were in the source content
      let output = String(result);
      output = output.replace(
        /<span class="broken-link" title="([^"]+)">([^<]+)<\/span>/g,
        '<span class="text-[var(--vermillion)] line-through" title="$1">$2</span>'
      );
      setHtml(output);
    });
  }, [content]);

  if (inline) {
    return (
      <span
        className="markdown-inline"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

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
