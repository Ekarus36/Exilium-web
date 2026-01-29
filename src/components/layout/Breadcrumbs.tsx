"use client";

import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/Icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm text-stone-500 mb-4">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRightIcon size={16} />
          )}
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="hover:text-stone-300 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={index === items.length - 1 ? "text-stone-300" : ""}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
