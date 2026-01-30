"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { NavigationConfig } from "@/lib/content/navigation";

interface WikiLayoutProps {
  children: React.ReactNode;
  navigation: NavigationConfig;
  variant: "player" | "dm";
  title: string;
}

export function WikiLayout({
  children,
  navigation,
  variant,
  title,
}: WikiLayoutProps) {
  const titleHref = variant === "player" ? "/player" : "/dm";

  return (
    <div className="min-h-screen bg-stone-950">
      <Header variant={variant} />
      <div className="flex">
        <Sidebar navigation={navigation} title={title} titleHref={titleHref} />
        <main className="flex-1 min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-4xl mx-auto p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
