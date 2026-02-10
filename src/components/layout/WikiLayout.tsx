"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { NavigationConfig } from "@/tools/wiki/lib/navigation";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  return (
    <div className="min-h-screen bg-[var(--study-dark)]">
      <Header variant={variant} onMenuToggle={toggleSidebar} />
      <div className="flex">
        <Sidebar
          navigation={navigation}
          title={title}
          titleHref={titleHref}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />
        {/* Backdrop overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={closeSidebar}
          />
        )}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-4xl mx-auto p-4 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
