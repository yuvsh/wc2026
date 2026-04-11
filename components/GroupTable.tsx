interface GroupStandingRow {
  id: string;
  group_name: string;
  team_name: string;
  team_code: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  qualified: boolean;
}

interface GroupTableProps {
  groupName: string;
  rows: GroupStandingRow[];
}

const HEADERS = ["קבוצה", "מ", "נ", "ת", "ה", "נק'"];

function FlagIcon({ code }: { code: string }): React.ReactElement {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-sm shrink-0`}
      style={{ width: 24, height: 17, display: "inline-block" }}
    />
  );
}

export default function GroupTable({ groupName, rows }: GroupTableProps): React.ReactElement {
  const sorted = [...rows].sort((a, b) => a.position - b.position);

  return (
    <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
      {/* Group header */}
      <div className="bg-[#1F2937] px-4 py-2">
        <span className="text-white text-[13px] font-bold">בית {groupName}</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_28px_28px_28px_28px_36px] bg-[#F9FAFB] border-b border-[#E5E7EB] px-3 py-1.5">
        {HEADERS.map((h) => (
          <span key={h} className="text-[11px] text-[#6B7280] font-medium text-center last:text-center first:text-right">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {sorted.map((row) => {
        const isQualified = row.position <= 2;
        return (
          <div
            key={row.id}
            className={`grid grid-cols-[1fr_28px_28px_28px_28px_36px] px-3 py-2.5 border-b border-[#E5E7EB] last:border-b-0 items-center ${
              isQualified ? "bg-[#F0FDFA]" : "bg-white"
            }`}
          >
            {/* Team name + flag */}
            <div className="flex items-center gap-2 justify-end">
              <span className="text-[13px] font-medium text-[#111827] truncate">{row.team_name}</span>
              <FlagIcon code={row.team_code} />
            </div>
            {/* Stats */}
            <span className="text-[13px] text-[#6B7280] text-center tabular-nums">{row.played}</span>
            <span className="text-[13px] text-[#6B7280] text-center tabular-nums">{row.won}</span>
            <span className="text-[13px] text-[#6B7280] text-center tabular-nums">{row.drawn}</span>
            <span className="text-[13px] text-[#6B7280] text-center tabular-nums">{row.lost}</span>
            <span className={`text-[13px] font-bold text-center tabular-nums ${isQualified ? "text-[#0D9488]" : "text-[#111827]"}`}>
              {row.points}
            </span>
          </div>
        );
      })}
    </div>
  );
}
