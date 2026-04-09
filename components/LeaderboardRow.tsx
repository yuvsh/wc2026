interface LeaderboardRowProps {
  position: number;
  displayName: string;
  neighbourhoodName: string | null;
  totalPoints: number;
  isCurrentUser: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function PositionLabel({ position }: { position: number }): React.ReactElement {
  const gold = "text-[#EF9F27] font-bold";
  const silver = "text-[#9CA3AF] font-bold";
  const bronze = "text-[#BA7517] font-bold";
  const normal = "text-[#6B7280]";

  const cls =
    position === 1 ? gold : position === 2 ? silver : position === 3 ? bronze : normal;

  return (
    <span className={`text-[15px] w-6 text-center tabular-nums ${cls}`}>
      {position}
    </span>
  );
}

export default function LeaderboardRow({
  position,
  displayName,
  neighbourhoodName,
  totalPoints,
  isCurrentUser,
}: LeaderboardRowProps): React.ReactElement {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
        isCurrentUser
          ? "bg-[#F0FDFA] border-[#2DD4BF]"
          : "bg-white border-[#E5E7EB]"
      }`}
    >
      <PositionLabel position={position} />

      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold ${
          isCurrentUser
            ? "bg-[#0D9488] text-white"
            : "bg-[#F3F4F6] text-[#6B7280]"
        }`}
      >
        {getInitials(displayName)}
      </div>

      {/* Name + neighbourhood */}
      <div className="flex-1 text-right min-w-0">
        <div className="flex items-center justify-end gap-2">
          <p className="text-[15px] font-medium text-[#111827] truncate">{displayName}</p>
          {isCurrentUser && (
            <span className="text-[11px] text-[#0D9488] font-medium shrink-0">אתה</span>
          )}
        </div>
        {neighbourhoodName && (
          <p className="text-[13px] text-[#9CA3AF] truncate">{neighbourhoodName}</p>
        )}
      </div>

      {/* Points */}
      <span
        className={`text-[15px] font-bold tabular-nums shrink-0 ${
          isCurrentUser ? "text-[#0D9488]" : "text-[#111827]"
        }`}
      >
        {totalPoints}
      </span>
    </div>
  );
}
