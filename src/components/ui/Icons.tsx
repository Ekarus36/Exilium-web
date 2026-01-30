// Custom SVG icons for the Exilium wiki
// Styled to match the Ancient Cartographer's Study theme

import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const defaultProps = {
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function HomeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

export function GlobeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function MapIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M9 19l-6 3V7l6-3m0 15l6-3m-6 3V4m6 12l6 3V4l-6-3m0 15V1" />
    </svg>
  );
}

export function ScrollIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M19 3H7a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2z" />
      <path d="M5 5a2 2 0 00-2 2v12a2 2 0 002 2" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  );
}

export function SwordsIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
      <path d="M13 19l6-6" />
      <path d="M16 16l4 4" />
      <path d="M9.5 17.5L21 6V3h-3L6.5 14.5" />
      <path d="M11 19l-6-6" />
      <path d="M8 16l-4 4" />
    </svg>
  );
}

export function UsersIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

export function MasksIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M12 4C8 4 4 6 4 10c0 2.5 1 4.5 3 6l1 5h8l1-5c2-1.5 3-3.5 3-6 0-4-4-6-8-6z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
      <path d="M9 14c1.5 1.5 4.5 1.5 6 0" />
    </svg>
  );
}

export function CrownIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M2 17l3-11 5 5 2-7 2 7 5-5 3 11H2z" />
      <path d="M2 17h20v3H2z" />
    </svg>
  );
}

export function CastleIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M3 21h18" />
      <path d="M5 21V7l2-2v16" />
      <path d="M17 21V7l2 2v12" />
      <path d="M7 21V11h10v10" />
      <path d="M11 21v-4h2v4" />
      <path d="M7 7V3h2v2h2V3h2v2h2V3h2v4" />
    </svg>
  );
}

export function BookIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function SearchIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function MoonIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

export function SpinnerIcon({ size = 16, className, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`animate-spin ${className || ""}`} {...props}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={1.5} />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function LightningIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

export function ClipboardIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

export function MapPinIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function SlidersIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

export function CheckIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Hero-sized icons for landing page (40x40 coordinate space)
export function BookHeroIcon({ size = 40, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" {...defaultProps} {...props}>
      <path d="M6 8c0-2 1-3 3-3h22c2 0 3 1 3 3v24c0 2-1 3-3 3H9c-2 0-3-1-3-3V8z" />
      <path d="M12 5v30" />
      <path d="M18 12h12M18 18h10M18 24h8" />
      <circle cx="9" cy="8" r="1" fill="currentColor" />
      <circle cx="9" cy="32" r="1" fill="currentColor" />
    </svg>
  );
}

export function EyeHeroIcon({ size = 40, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" {...defaultProps} {...props}>
      <path d="M4 20s6-10 16-10 16 10 16 10-6 10-16 10S4 20 4 20z" />
      <circle cx="20" cy="20" r="6" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      <path d="M20 6v4M20 30v4M8 20H4M36 20h-4" opacity="0.5" />
    </svg>
  );
}

export function ScrollHeroIcon({ size = 40, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" {...defaultProps} {...props}>
      <path d="M8 6h20c2 0 4 2 4 4v20c0 2-2 4-4 4H8" />
      <path d="M8 6c-2 0-4 2-4 4s2 4 4 4" />
      <path d="M8 34c-2 0-4-2-4-4s2-4 4-4" />
      <path d="M8 14v12" />
      <path d="M14 12h12M14 18h10M14 24h8M14 30h6" />
      <circle cx="28" cy="28" r="4" />
      <path d="M26 28h4M28 26v4" />
    </svg>
  );
}

export function EyeIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function KeyIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaultProps} {...props}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

export function CornerOrnamentIcon({ size = 96, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" {...defaultProps} {...props}>
      <path d="M0 50 Q0 0 50 0" />
      <path d="M10 50 Q10 10 50 10" opacity="0.5" />
      <circle cx="50" cy="0" r="3" fill="currentColor" />
      <circle cx="0" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}

// Icon map for navigation
export const navIcons: Record<string, React.ComponentType<IconProps>> = {
  "🏠": HomeIcon,
  "🌍": GlobeIcon,
  "🗺️": MapIcon,
  "📜": ScrollIcon,
  "⚔️": SwordsIcon,
  "👥": UsersIcon,
  "🎭": MasksIcon,
};

// Get icon component by emoji key
export function getNavIcon(emoji: string): React.ComponentType<IconProps> | null {
  return navIcons[emoji] || null;
}
