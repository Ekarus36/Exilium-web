"use client";

import { Search } from "./Search";

interface SearchWrapperProps {
  accessLevel: "player" | "dm";
}

export function SearchWrapper({ accessLevel }: SearchWrapperProps) {
  return <Search accessLevel={accessLevel} />;
}
