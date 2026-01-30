"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem, NavigationConfig } from "@/lib/content/navigation";
import { getNavIcon, ChevronRightIcon, SearchIcon } from "@/components/ui/Icons";

interface SidebarProps {
  navigation: NavigationConfig;
  title: string;
  titleHref: string;
}

export function Sidebar({ navigation, title, titleHref }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Auto-expand sections that contain the current page
  useEffect(() => {
    const newExpanded = new Set<string>();

    function findAndExpand(items: NavItem[], path: string[] = []): boolean {
      for (const item of items) {
        const currentPath = [...path, item.label];
        const pathKey = currentPath.join("/");

        if (item.href === pathname) {
          // Expand all parent sections
          path.forEach((_, i) => {
            newExpanded.add(path.slice(0, i + 1).join("/"));
          });
          return true;
        }

        if (item.children) {
          if (findAndExpand(item.children, currentPath)) {
            newExpanded.add(pathKey);
            return true;
          }
        }
      }
      return false;
    }

    findAndExpand(navigation.sections);
    setExpandedSections(newExpanded);
  }, [pathname, navigation]);

  const toggleSection = (pathKey: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(pathKey)) {
        next.delete(pathKey);
      } else {
        next.add(pathKey);
      }
      return next;
    });
  };

  return (
    <aside className="sidebar-container">
      {/* Decorative top border */}
      <div className="sidebar-top-border" />

      {/* Header */}
      <div className="sidebar-header">
        <Link href={titleHref} className="sidebar-title">
          <span className="sidebar-title-ornament">✦</span>
          {title}
          <span className="sidebar-title-ornament">✦</span>
        </Link>
      </div>

      {/* Search */}
      <div className="sidebar-search-container">
        <div className="sidebar-search">
          <SearchIcon className="sidebar-search-icon" />
          <input
            type="text"
            placeholder="Search the archives..."
            className="sidebar-search-input"
          />
          <kbd className="sidebar-search-kbd">/</kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {navigation.sections.map((section) => (
            <NavSection
              key={section.label}
              item={section}
              pathname={pathname}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              path={[section.label]}
              depth={0}
            />
          ))}
        </ul>
      </nav>

      {/* Decorative bottom */}
      <div className="sidebar-footer">
        <span className="sidebar-footer-ornament">— ✧ —</span>
      </div>

      <style jsx>{`
        .sidebar-container {
          width: 18rem;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background: var(--study-panel);
          border-right: 1px solid var(--gold-shadow);
          /* Wood grain texture */
          background-image:
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.008) 2px,
              rgba(255, 255, 255, 0.008) 4px
            );
        }

        .sidebar-top-border {
          height: 3px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--gold-dark),
            var(--gold),
            var(--gold-dark),
            transparent
          );
          flex-shrink: 0;
        }

        .sidebar-header {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--gold-shadow);
          background: linear-gradient(
            180deg,
            rgba(184, 148, 61, 0.08) 0%,
            transparent 100%
          );
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: 'Cinzel', serif;
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--gold);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .sidebar-title:hover {
          color: var(--gold-bright);
          text-shadow: 0 0 12px var(--gold-shadow);
        }

        .sidebar-title-ornament {
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .sidebar-search-container {
          padding: 1rem;
          border-bottom: 1px solid var(--gold-shadow);
        }

        .sidebar-search {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sidebar-search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--gold-dark);
          stroke: currentColor;
          pointer-events: none;
        }

        .sidebar-search-input {
          width: 100%;
          padding: 0.6rem 2.5rem 0.6rem 2.25rem;
          font-family: 'Crimson Pro', serif;
          font-size: 0.9rem;
          color: var(--parchment);
          background: var(--study-dark);
          border: 1px solid var(--gold-shadow);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .sidebar-search-input::placeholder {
          color: var(--ink-faded);
          font-style: italic;
        }

        .sidebar-search-input:focus {
          outline: none;
          border-color: var(--gold-dark);
          box-shadow: 0 0 0 1px var(--gold-shadow), 0 0 12px rgba(184, 148, 61, 0.15);
        }

        .sidebar-search-kbd {
          position: absolute;
          right: 0.5rem;
          font-family: 'Crimson Pro', serif;
          font-size: 0.7rem;
          color: var(--gold-dark);
          background: var(--study-panel);
          border: 1px solid var(--gold-shadow);
          padding: 0.15rem 0.4rem;
          border-radius: 2px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          overflow-y: auto;
        }

        .sidebar-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .sidebar-footer {
          padding: 0.75rem;
          text-align: center;
          border-top: 1px solid var(--gold-shadow);
          flex-shrink: 0;
        }

        .sidebar-footer-ornament {
          font-size: 0.8rem;
          color: var(--gold-dark);
          letter-spacing: 0.3em;
          opacity: 0.5;
        }

        /* Custom scrollbar for sidebar */
        .sidebar-container::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-container::-webkit-scrollbar-thumb {
          background: var(--gold-shadow);
          border-radius: 4px;
        }

        .sidebar-container::-webkit-scrollbar-thumb:hover {
          background: var(--gold-dark);
        }
      `}</style>
    </aside>
  );
}

interface NavSectionProps {
  item: NavItem;
  pathname: string;
  expandedSections: Set<string>;
  toggleSection: (key: string) => void;
  path: string[];
  depth: number;
}

function NavSection({
  item,
  pathname,
  expandedSections,
  toggleSection,
  path,
  depth,
}: NavSectionProps) {
  const pathKey = path.join("/");
  const isExpanded = expandedSections.has(pathKey);
  const isActive = item.href === pathname;
  const hasChildren = item.children && item.children.length > 0;

  const paddingLeft = depth * 14 + 12;

  // Get the icon component if available
  const IconComponent = item.icon ? getNavIcon(item.icon) : null;

  if (!hasChildren && item.href) {
    // Leaf node - just a link
    return (
      <li className="nav-item">
        <Link
          href={item.href}
          className={`nav-link ${isActive ? "nav-link-active" : ""}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {IconComponent && (
            <span className="nav-icon">
              <IconComponent size={16} />
            </span>
          )}
          <span className="nav-label">{item.label}</span>
        </Link>

        <style jsx>{`
          .nav-item {
            list-style: none;
            margin: 0.125rem 0;
          }

          :global(.nav-link) {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 0.75rem;
            font-family: 'Crimson Pro', serif;
            font-size: 0.9rem;
            color: var(--parchment-aged);
            text-decoration: none;
            border-radius: 2px;
            transition: all 0.25s ease;
            position: relative;
          }

          :global(.nav-link:hover) {
            color: var(--gold);
            background: rgba(184, 148, 61, 0.08);
          }

          :global(.nav-link-active) {
            color: var(--gold-bright);
            background: rgba(184, 148, 61, 0.12);
            font-weight: 500;
          }

          :global(.nav-link-active)::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 2px;
            height: 60%;
            background: var(--gold);
            border-radius: 1px;
          }

          :global(.nav-icon) {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            color: var(--gold-dark);
            stroke: currentColor;
            flex-shrink: 0;
          }

          :global(.nav-link:hover .nav-icon),
          :global(.nav-link-active .nav-icon) {
            color: var(--gold);
          }

          :global(.nav-label) {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}</style>
      </li>
    );
  }

  // Section with children
  return (
    <li className="nav-section">
      <button
        onClick={() => toggleSection(pathKey)}
        className={`nav-section-button ${isActive ? "nav-section-active" : ""}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <span className="nav-section-left">
          {IconComponent && (
            <span className="nav-section-icon">
              <IconComponent size={16} />
            </span>
          )}
          <span className="nav-section-label">{item.label}</span>
        </span>
        <span className={`nav-section-chevron ${isExpanded ? "expanded" : ""}`}>
          <ChevronRightIcon size={14} />
        </span>
      </button>

      {isExpanded && item.children && (
        <ul className="nav-section-children">
          {item.children.map((child) => (
            <NavSection
              key={child.label}
              item={child}
              pathname={pathname}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              path={[...path, child.label]}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}

      <style jsx>{`
        .nav-section {
          list-style: none;
          margin: 0.125rem 0;
        }

        .nav-section-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--parchment);
          background: transparent;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
        }

        .nav-section-button:hover {
          color: var(--gold);
          background: rgba(184, 148, 61, 0.08);
        }

        .nav-section-active {
          color: var(--gold);
          background: rgba(184, 148, 61, 0.1);
        }

        .nav-section-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }

        .nav-section-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          color: var(--gold-dark);
          flex-shrink: 0;
        }

        .nav-section-icon :global(svg) {
          stroke: currentColor;
        }

        .nav-section-button:hover .nav-section-icon,
        .nav-section-active .nav-section-icon {
          color: var(--gold);
        }

        .nav-section-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-section-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          color: var(--gold-dark);
          transition: transform 0.25s ease;
          flex-shrink: 0;
        }

        .nav-section-chevron :global(svg) {
          stroke: currentColor;
        }

        .nav-section-chevron.expanded {
          transform: rotate(90deg);
        }

        .nav-section-children {
          list-style: none;
          margin: 0;
          padding: 0;
          margin-top: 0.125rem;
        }
      `}</style>
    </li>
  );
}
