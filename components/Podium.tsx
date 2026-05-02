interface PodiumEntry {
  displayName: string;
  avatarUrl: string | null;
  totalPoints: number;
  isCurrentUser: boolean;
}

interface PodiumProps {
  first: PodiumEntry | null;
  second: PodiumEntry | null;
  third: PodiumEntry | null;
}

import { getInitials } from "@/lib/utils/initials";

interface PodiumBlockProps {
  entry: PodiumEntry | null;
  rank: 1 | 2 | 3;
}

function MedalIcon({ rank }: { rank: 1 | 2 | 3 }): React.ReactElement {
  const fills: Record<1 | 2 | 3, string> = {
    1: "#EF9F27",
    2: "#9CA3AF",
    3: "#BA7517",
  };
  const fill = fills[rank];
  return (
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" aria-hidden="true">
      {/* ribbon */}
      <rect x="11" y="24" width="6" height="10" rx="1.5" fill={fill} />
      {/* medal circle */}
      <circle cx="14" cy="14" r="12" fill={fill} />
      {/* inner ring for depth */}
      <circle cx="14" cy="14" r="9" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      {/* highlight arc — 3D sheen */}
      <path d="M 8 9 A 7 7 0 0 1 18 7" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* rank numeral */}
      <text x="14" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(0,0,0,0.45)" fontFamily="system-ui">{rank}</text>
    </svg>
  );
}

function PodiumBlock({ entry, rank }: PodiumBlockProps): React.ReactElement {
  const heights: Record<1 | 2 | 3, string> = {
    1: "h-24",
    2: "h-16",
    3: "h-12",
  };

  const blockColors: Record<1 | 2 | 3, string> = {
    1: "bg-[#EF9F27]",
    2: "bg-[#9CA3AF]",
    3: "bg-[#BA7517]",
  };

  if (!entry) {
    return (
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className={`w-full ${heights[rank]} ${blockColors[rank]} rounded-t-lg opacity-30`} />
      </div>
    );
  }

  const avatarBg = entry.isCurrentUser ? "bg-[#0D9488]" : "bg-[#1F2937]";

  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      {/* Points */}
      <span className="text-[13px] font-bold text-[#111827] tabular-nums font-[family-name:var(--font-big-shoulders)]">
        {entry.totalPoints}
      </span>

      {/* Avatar */}
      {entry.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.avatarUrl}
          alt={entry.displayName}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold ${avatarBg}`}
        >
          {getInitials(entry.displayName)}
        </div>
      )}

      {/* Name */}
      <p className="text-[11px] text-[#111827] font-medium text-center max-w-[80px] truncate">
        {entry.displayName}
      </p>

      {/* Podium block */}
      <div
        className={`w-full ${heights[rank]} ${blockColors[rank]} rounded-t-lg flex items-center justify-center`}
      >
        <MedalIcon rank={rank} />
      </div>
    </div>
  );
}

export default function Podium({ first, second, third }: PodiumProps): React.ReactElement {
  return (
    <div className="flex items-end gap-2 px-4 pt-4">
      <PodiumBlock entry={second} rank={2} />
      <PodiumBlock entry={first} rank={1} />
      <PodiumBlock entry={third} rank={3} />
    </div>
  );
}
