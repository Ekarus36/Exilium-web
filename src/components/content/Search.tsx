"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { SearchIndexEntry } from "@/lib/content/types";

interface SearchProps {
  accessLevel: "player" | "dm";
  placeholder?: string;
}

export function Search({ accessLevel, placeholder = "Search content..." }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchIndexEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchIndexEntry> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search index
  useEffect(() => {
    const loadIndex = async () => {
      try {
        const response = await fetch(
          `/content/search-${accessLevel}.json`
        );
        const data: SearchIndexEntry[] = await response.json();

        const fuseInstance = new Fuse(data, {
          keys: [
            { name: "title", weight: 2 },
            { name: "content", weight: 1 },
          ],
          threshold: 0.4,
          includeScore: true,
          minMatchCharLength: 2,
        });

        setFuse(fuseInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load search index:", error);
        setIsLoading(false);
      }
    };

    loadIndex();
  }, [accessLevel]);

  // Search on query change
  useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query, { limit: 8 });
    setResults(searchResults.map((r) => r.item));
    setSelectedIndex(0);
  }, [query, fuse]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            navigateToResult(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex]
  );

  const navigateToResult = (result: SearchIndexEntry) => {
    const path = `/${accessLevel}/${result.category}/${result.slug}`;
    router.push(path);
    setIsOpen(false);
    setQuery("");
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.parentElement?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 bg-stone-900 border border-stone-700 rounded-lg text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-600"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-stone-500 bg-stone-800 rounded border border-stone-700">
          <span>⌘</span>K
        </kbd>
      </div>

      {/* Results dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-stone-900 border border-stone-700 rounded-lg shadow-xl overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-stone-500">
              Loading search index...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-stone-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul>
              {results.map((result, index) => (
                <li key={`${result.category}-${result.slug}`}>
                  <button
                    onClick={() => navigateToResult(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-amber-900/30"
                        : "hover:bg-stone-800"
                    }`}
                  >
                    <div className="font-medium text-stone-100">
                      {result.title}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5 capitalize">
                      {result.category}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
