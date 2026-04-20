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

  const rankLabels: Record<1 | 2 | 3, string> = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
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
      <span className="text-[13px] font-bold text-[#111827] tabular-nums">
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
        <span className="text-lg">{rankLabels[rank]}</span>
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
