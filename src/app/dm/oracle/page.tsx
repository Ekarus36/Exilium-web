"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Source {
  title: string;
  slug: string;
  category: string;
}

interface Message {
  role: "user" | "oracle";
  content: string;
  sources?: Source[];
}

export default function OraclePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  async function sendQuery(overrideQuery?: string) {
    const query = (overrideQuery ?? input).trim();
    if (!query || isStreaming) return;

    setInput("");
    setIsStreaming(true);

    // Add user message
    const userMsg: Message = { role: "user", content: query };
    const oracleMsg: Message = { role: "oracle", content: "", sources: [] };
    setMessages((prev) => [...prev, userMsg, oracleMsg]);

    try {
      const response = await fetch("/api/oracle/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errText = await response.text();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "oracle",
            content: `The Oracle is unable to respond. (${response.status}: ${errText})`,
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const data = JSON.parse(jsonStr);

            if (data.type === "sources") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                updated[updated.length - 1] = { ...last, sources: data.sources };
                return updated;
              });
            } else if (data.type === "token") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + data.content,
                };
                return updated;
              });
            } else if (data.type === "done") {
              setIsStreaming(false);
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "oracle",
          content: `Failed to reach the Oracle. Is the backend running? (${err})`,
        };
        return updated;
      });
    }

    setIsStreaming(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuery();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center py-6 border-b border-[var(--gold-shadow)]">
        <div className="text-[var(--gold)] text-sm tracking-[0.5em] mb-2 opacity-60">
          ✦ ✦ ✦
        </div>
        <h1 className="font-['Cinzel',serif] text-3xl font-medium tracking-wide text-[var(--gold)]">
          The Oracle
        </h1>
        <p className="font-['IM_Fell_English',serif] text-[var(--parchment-aged)] italic mt-2">
          Ask and the archives shall answer
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 opacity-30">&#x1F52E;</div>
            <p className="text-[var(--parchment-aged)] font-['IM_Fell_English',serif] text-lg italic mb-8">
              The Oracle awaits your questions about the world of Exilium
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
              {[
                "Who rules Veraheim?",
                "What is the Contribution System?",
                "Tell me about the Dragon War",
                "Who is Velindor Shadowmere?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendQuery(q)}
                  className="text-left px-4 py-3 rounded-sm border border-[var(--gold-shadow)]
                    text-[var(--parchment-dark)] hover:text-[var(--gold)] hover:border-[var(--gold-dark)]
                    transition-colors text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              <UserMessage content={msg.content} />
            ) : (
              <OracleMessage
                content={msg.content}
                sources={msg.sources}
                isStreaming={isStreaming && i === messages.length - 1}
              />
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--gold-shadow)] px-4 py-4">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the Oracle..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none bg-[var(--study-panel)] border border-[var(--gold-shadow)]
              rounded-sm px-4 py-3 text-[var(--parchment)] placeholder:text-[var(--ink-faded)]
              focus:outline-none focus:border-[var(--gold-dark)] transition-colors
              font-['Crimson_Pro',serif] text-lg max-h-32"
          />
          <button
            onClick={() => sendQuery()}
            disabled={isStreaming || !input.trim()}
            className="px-6 py-3 bg-[var(--vermillion)] text-[var(--parchment-light)] rounded-sm
              font-['Cinzel',serif] text-sm tracking-wider
              hover:bg-[var(--vermillion-dark)] disabled:opacity-30 disabled:cursor-not-allowed
              transition-colors"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[80%] bg-[var(--study-wood)] border border-[var(--gold-shadow)]
        rounded-sm px-4 py-3"
      >
        <p className="text-[var(--parchment)] text-base whitespace-pre-wrap">
          {content}
        </p>
      </div>
    </div>
  );
}

function OracleMessage({
  content,
  sources,
  isStreaming,
}: {
  content: string;
  sources?: Source[];
  isStreaming: boolean;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%]">
        {/* Oracle label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[var(--gold)] font-['Cinzel',serif] text-xs tracking-wider">
            THE ORACLE
          </span>
          {isStreaming && (
            <span className="text-[var(--gold-dark)] text-xs animate-pulse">
              consulting the archives...
            </span>
          )}
        </div>

        {/* Response content */}
        <div
          className="bg-[var(--study-panel)] border-l-2 border-[var(--gold-dark)]
          rounded-sm px-5 py-4"
        >
          {content ? (
            <div
              className="text-[var(--parchment)] prose prose-invert prose-sm max-w-none
                prose-headings:font-['Cinzel',serif] prose-headings:text-[var(--gold)]
                prose-strong:text-[var(--parchment-light)]
                prose-a:text-[var(--gold)] prose-a:no-underline hover:prose-a:underline"
            >
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            isStreaming && (
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--gold-dark)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[var(--gold-dark)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[var(--gold-dark)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            )
          )}
        </div>

        {/* Source citations */}
        {sources && sources.length > 0 && !isStreaming && (
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-[var(--ink-faded)] text-xs">Sources:</span>
            {sources.map((src) => (
              <Link
                key={src.slug}
                href={`/dm/${src.category}/${src.slug}`}
                className="text-xs text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors"
              >
                [{src.title}]
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

