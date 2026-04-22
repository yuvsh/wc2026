import type { GroupStandingRow } from "@/lib/types/tournament";

interface GroupTableProps {
  groupName: string;
  rows: GroupStandingRow[];
}

// Headers: team, played, won, drawn, lost, GF, GA, GD, points
const HEADERS = ["קבוצה", "מ", "נ", "ת", "ה", "זכ", "נג", "הפ", "נק'"];

function FlagIcon({ code }: { code: string }): React.ReactElement {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-sm shrink-0`}
      style={{ width: 20, height: 15, display: "inline-block" }}
    />
  );
}

function GD({ value }: { value: number }): React.ReactElement {
  const color =
    value > 0 ? "text-[#0D9488]" : value < 0 ? "text-[#EF4444]" : "text-[#6B7280]";
  const label = value > 0 ? `+${value}` : `${value}`;
  return (
    <span className={`text-[12px] font-semibold text-center tabular-nums ${color}`}>
      {label}
    </span>
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
      <div className="grid grid-cols-[1fr_22px_22px_22px_22px_26px_26px_30px_32px] bg-[#F9FAFB] border-b border-[#E5E7EB] px-3 py-1.5 gap-x-1">
        {HEADERS.map((h, i) => (
          <span
            key={h}
            className={`text-[11px] text-[#6B7280] font-medium text-center ${i === 0 ? "text-right" : ""}`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {sorted.map((row) => {
        const gd = row.goals_for - row.goals_against;
        return (
          <div
            key={row.id}
            className={`grid grid-cols-[1fr_22px_22px_22px_22px_26px_26px_30px_32px] px-3 py-2 border-b border-[#E5E7EB] last:border-b-0 items-center gap-x-1 ${
              row.qualified ? "bg-[#F0FDFA]" : "bg-white"
            }`}
          >
            {/* Team name + flag */}
            <div className="flex items-center gap-1.5 min-w-0">
              <FlagIcon code={row.team_code} />
              <span className="text-[12px] font-medium text-[#111827] truncate">{row.team_name}</span>
            </div>

            {/* Played */}
            <span className="text-[12px] text-[#6B7280] text-center tabular-nums">{row.played}</span>
            {/* Won */}
            <span className="text-[12px] text-[#6B7280] text-center tabular-nums">{row.won}</span>
            {/* Drawn */}
            <span className="text-[12px] text-[#6B7280] text-center tabular-nums">{row.drawn}</span>
            {/* Lost */}
            <span className="text-[12px] text-[#6B7280] text-center tabular-nums">{row.lost}</span>
            {/* GF */}
            <span className="text-[12px] text-[#6B7280] text-center tabular-nums">{row.goals_for}</span>
            {/* GA */}
            <span className="text-[12px] text-[#6B7280] text-center tabular-nums">{row.goals_against}</span>
            {/* GD */}
            <GD value={gd} />
            {/* Points */}
            <span className={`text-[12px] font-bold text-center tabular-nums ${row.qualified ? "text-[#0D9488]" : "text-[#111827]"}`}>
              {row.points}
            </span>
          </div>
        );
      })}
    </div>
  );
}
