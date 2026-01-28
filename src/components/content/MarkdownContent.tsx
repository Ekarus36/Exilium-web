"use client";

import { useEffect, useState } from "react";

interface MarkdownContentProps {
  content: string;
  inline?: boolean;
}

/**
 * Render markdown content as HTML
 * WikiLinks have already been converted to standard markdown links by the build script
 */
export function MarkdownContent({ content, inline = false }: MarkdownContentProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    // Simple markdown to HTML conversion for client-side rendering
    // The build script handles WikiLink conversion, so we just need basic markdown
    const converted = convertMarkdown(content);
    setHtml(converted);
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
      className="markdown-content prose prose-stone prose-invert max-w-none
        prose-headings:text-stone-200
        prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
        prose-h4:text-base prose-h4:font-medium prose-h4:mt-4 prose-h4:mb-2
        prose-p:text-stone-300 prose-p:leading-relaxed
        prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-stone-100
        prose-ul:text-stone-300
        prose-ol:text-stone-300
        prose-li:text-stone-300
        prose-blockquote:border-stone-700 prose-blockquote:text-stone-400
        prose-code:text-amber-300 prose-code:bg-stone-800 prose-code:px-1 prose-code:rounded
        prose-pre:bg-stone-900 prose-pre:border prose-pre:border-stone-800
        prose-table:text-stone-300
        prose-th:text-stone-200 prose-th:border-stone-700
        prose-td:border-stone-700
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Simple markdown to HTML converter
 * Handles common markdown syntax
 */
function convertMarkdown(markdown: string): string {
  let html = markdown;

  // Escape HTML (except for our generated elements)
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers (h3-h6 only, h1-h2 handled by component)
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Links (already converted from WikiLinks by build script)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Broken links (styled span from build script)
  html = html.replace(
    /&lt;span class="broken-link" title="([^"]+)"&gt;([^&]+)&lt;\/span&gt;/g,
    '<span class="text-red-400 line-through" title="$1">$2</span>'
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Horizontal rules
  html = html.replace(/^---$/gm, "<hr />");

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");

  // Lists (unordered)
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>");

  // Lists (ordered)
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Paragraphs (lines with content that aren't already wrapped)
  const lines = html.split("\n");
  const processedLines: string[] = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      processedLines.push("");
      inList = false;
      continue;
    }

    if (
      trimmed.startsWith("<h") ||
      trimmed.startsWith("<ul") ||
      trimmed.startsWith("<ol") ||
      trimmed.startsWith("<li") ||
      trimmed.startsWith("<hr") ||
      trimmed.startsWith("<blockquote") ||
      trimmed.startsWith("</")
    ) {
      processedLines.push(line);
      continue;
    }

    // Wrap plain text in paragraphs
    if (!inList) {
      processedLines.push(`<p>${trimmed}</p>`);
    } else {
      processedLines.push(line);
    }
  }

  html = processedLines.join("\n");

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, "");

  // Clean up consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "<br />");

  return html;
}
