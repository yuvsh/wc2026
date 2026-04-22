import { getInitials } from "@/lib/utils/initials";

interface LeaderboardRowProps {
  position: number;
  displayName: string;
  avatarUrl: string | null;
  neighbourhoodName: string | null;
  totalPoints: number;
  isCurrentUser: boolean;
  onClick?: () => void;
}

function PositionLabel({ position }: { position: number }): React.ReactElement {
  const gold = "text-[#EF9F27] font-bold";
  const silver = "text-[#9CA3AF] font-bold";
  const bronze = "text-[#BA7517] font-bold";
  const normal = "text-[#6B7280]";

  const cls =
    position === 1 ? gold : position === 2 ? silver : position === 3 ? bronze : normal;

  return (
    <span className={`text-[13px] w-5 text-center tabular-nums shrink-0 ${cls}`}>
      {position}
    </span>
  );
}

export default function LeaderboardRow({
  position,
  displayName,
  avatarUrl,
  neighbourhoodName,
  totalPoints,
  isCurrentUser,
  onClick,
}: LeaderboardRowProps): React.ReactElement {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      aria-label={onClick ? `הצג ניחושים של ${displayName}` : undefined}
      className={`flex items-center gap-3 px-4 min-h-[56px] rounded-xl border transition-colors ${
        isCurrentUser
          ? "bg-[#F0FDFA] border-[#2DD4BF]"
          : "bg-white border-[#E5E7EB]"
      } ${onClick ? "cursor-pointer active:opacity-70 hover:bg-[#F9FAFB]" : ""}`}
    >
      {/*
        RTL layout — visual order (right → left):
        [Rank] [Avatar] [Name / Neighbourhood]   [Points] [Chevron]

        In a dir="rtl" flex row, the first DOM child appears on the right.
        So DOM order matches the intended visual order without any overrides.
      */}

      {/* 1. Rank — visually first (rightmost) in RTL */}
      <PositionLabel position={position} />

      {/* 2. Avatar */}
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={displayName}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold ${
            isCurrentUser
              ? "bg-[#0D9488] text-white"
              : "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          {getInitials(displayName)}
        </div>
      )}

      {/* 3. Name + neighbourhood — grows to fill space */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[15px] font-medium text-[#111827] truncate">
            {displayName}
          </p>
          {isCurrentUser && (
            <span className="text-[11px] bg-[#CCFBF1] text-[#0D9488] font-semibold px-1.5 py-0.5 rounded-full shrink-0">
              אתה
            </span>
          )}
        </div>
        {neighbourhoodName && (
          <p className="text-[13px] text-[#9CA3AF] truncate mt-0.5">
            {neighbourhoodName}
          </p>
        )}
      </div>

      {/* 4. Points — visually prominent, left side in RTL */}
      <div className="shrink-0 text-left flex flex-col items-center">
        <span
          className={`text-[17px] font-bold tabular-nums leading-none ${
            isCurrentUser ? "text-[#0D9488]" : "text-[#111827]"
          }`}
        >
          {totalPoints}
        </span>
        <span className="text-[10px] text-[#9CA3AF] mt-0.5">נק׳</span>
      </div>

      {/* 5. Chevron — only when row is tappable; leftmost in RTL = trailing/forward signal */}
      {onClick && (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0 text-[#D1D5DB]"
        >
          {/* Left-pointing chevron: trailing edge in RTL = "go forward" */}
          <path
            d="M10 4L6 8l4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
