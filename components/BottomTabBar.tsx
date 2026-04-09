"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactElement;
}

const TABS: Tab[] = [
  {
    href: "/dashboard",
    label: "ניחושים",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M11 4H4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-7"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/leaderboard",
    label: "טבלה",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/tournament",
    label: "טורניר",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 21h8M12 17v4M7 4H5a1 1 0 00-1 1v3a5 5 0 005 5h6a5 5 0 005-5V5a1 1 0 00-1-1h-2"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 4h10v5a5 5 0 01-5 5 5 5 0 01-5-5V4z"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "היסטוריה",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
        />
        <path
          d="M12 7v5l3 3"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "פרופיל",
    icon: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
        />
        <path
          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke={active ? "#0D9488" : "#6B7280"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomTabBar(): React.ReactElement {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] flex items-center"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center h-14 gap-1 px-3"
          >
            {tab.icon(active)}
            <span
              className="text-[11px] font-medium"
              style={{ color: active ? "#0D9488" : "#6B7280" }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
