"use client";

import Link from "next/link";
import { useAuth } from "@/lib/supabase/auth-context";
import { HomeIcon, MoonIcon, MenuIcon } from "@/components/ui/Icons";

interface HeaderProps {
  variant: "player" | "dm" | "tools";
  onMenuToggle?: () => void;
}

export function Header({ variant, onMenuToggle }: HeaderProps) {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header className="header-container">
      {/* Top gold accent line */}
      <div className="header-accent" />

      <div className="header-inner">
        {/* Left - Menu + Home + Section switcher */}
        <div className="header-nav">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="header-menu-btn"
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <MenuIcon size={20} />
            </button>
          )}
          <Link
            href="/"
            className="header-home"
            title="Home"
          >
            <HomeIcon size={18} />
          </Link>

          <div className="header-divider" />

          <Link
            href="/player"
            className={`header-tab ${
              variant === "player" ? "header-tab-active header-tab-active-player" : ""
            }`}
          >
            Player
          </Link>
          <Link
            href="/dm"
            className={`header-tab ${
              variant === "dm" ? "header-tab-active header-tab-active-dm" : ""
            }`}
          >
            DM
          </Link>
          <Link
            href="/tools"
            className={`header-tab ${
              variant === "tools" ? "header-tab-active header-tab-active-tools" : ""
            }`}
          >
            Tools
          </Link>
        </div>

        {/* Right - Auth & theme */}
        <div className="header-right">
          {/* Theme toggle placeholder */}
          <button
            className="header-icon-btn"
            title="Toggle theme"
          >
            <MoonIcon size={20} />
          </button>

          {/* Auth */}
          {isLoading ? (
            <div className="header-auth-loading" />
          ) : user ? (
            <div className="header-auth">
              <span className="header-user">
                {user.email?.split("@")[0]}
              </span>
              <button
                onClick={() => signOut()}
                className="header-signout"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="header-signin"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .header-container {
          height: 3.5rem;
          border-bottom: 1px solid var(--gold-shadow);
          background: var(--study-panel);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .header-accent {
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--gold-dark),
            var(--gold),
            var(--gold-dark),
            transparent
          );
        }

        .header-inner {
          height: calc(100% - 2px);
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .header-home {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 4px;
          color: var(--gold-dark);
          transition: all 0.25s ease;
        }

        .header-home :global(svg) {
          stroke: currentColor;
        }

        .header-home:hover {
          color: var(--gold);
          background: rgba(184, 148, 61, 0.1);
        }

        .header-menu-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 4px;
          color: var(--gold-dark);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .header-menu-btn :global(svg) {
          stroke: currentColor;
        }

        .header-menu-btn:hover {
          color: var(--gold);
          background: rgba(184, 148, 61, 0.1);
        }

        @media (min-width: 1024px) {
          .header-menu-btn {
            display: none;
          }
        }

        .header-divider {
          width: 1px;
          height: 1.5rem;
          background: var(--gold-shadow);
          margin: 0 0.5rem;
        }

        .header-tab {
          padding: 0.4rem 0.75rem;
          border-radius: 4px;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--parchment-aged);
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .header-tab:hover {
          color: var(--gold);
          background: rgba(184, 148, 61, 0.08);
        }

        .header-tab-active {
          font-weight: 600;
        }

        .header-tab-active-player {
          color: #6ee7b7;
          background: rgba(16, 185, 129, 0.12);
        }

        .header-tab-active-dm {
          color: var(--gold-bright);
          background: rgba(184, 148, 61, 0.15);
        }

        .header-tab-active-tools {
          color: #93c5fd;
          background: rgba(59, 130, 246, 0.12);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 4px;
          color: var(--gold-dark);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .header-icon-btn:hover {
          color: var(--gold);
          background: rgba(184, 148, 61, 0.1);
        }

        .header-auth-loading {
          width: 5rem;
          height: 2rem;
          background: var(--study-dark);
          border-radius: 4px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .header-auth {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-user {
          font-family: 'Crimson Pro', serif;
          font-size: 0.875rem;
          color: var(--parchment-aged);
        }

        .header-signout {
          padding: 0.4rem 0.75rem;
          font-family: 'Crimson Pro', serif;
          font-size: 0.875rem;
          color: var(--parchment-aged);
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .header-signout:hover {
          color: var(--gold);
          background: rgba(184, 148, 61, 0.1);
        }

        .header-signin {
          padding: 0.4rem 1rem;
          font-family: 'Cinzel', serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: var(--ink-black);
          background: linear-gradient(
            180deg,
            var(--gold-bright) 0%,
            var(--gold) 50%,
            var(--gold-dark) 100%
          );
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .header-signin:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px var(--gold-shadow);
        }
      `}</style>
    </header>
  );
}
