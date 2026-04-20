"use client";

import { useState } from "react";

interface Player {
  id: string;
  name: string;
  country: string;
  country_code: string;
}

interface PlayerListProps {
  players: Player[];
  selectedId: string | null;
  locked: boolean;
  onSelect: (id: string) => void;
}

const COPY = {
  searchPlaceholder: "חפש שחקן...",
  noResults: "לא נמצאו שחקנים",
};

function FlagIcon({ code }: { code: string }): React.ReactElement {
  return (
    <span
      className={`fi fi-${code.toLowerCase()} rounded-sm shrink-0`}
      style={{ width: 28, height: 20, display: "inline-block" }}
    />
  );
}

export default function PlayerList({
  players,
  selectedId,
  locked,
  onSelect,
}: PlayerListProps): React.ReactElement {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? players.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase()) ||
        p.country.toLowerCase().includes(search.trim().toLowerCase())
      )
    : players;

  return (
    <div className="flex flex-col gap-2">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={COPY.searchPlaceholder}
          disabled={locked}
          dir="rtl"
          className="w-full h-[44px] rounded-xl border border-[#E5E7EB] bg-white px-4 text-[15px] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0D9488] disabled:opacity-50"
        />
      </div>

      {/* Player rows */}
      {filtered.length === 0 ? (
        <p className="text-center text-[#9CA3AF] text-[15px] py-8">{COPY.noResults}</p>
      ) : (
        <div className="flex flex-col gap-1">
          {filtered.map((player) => {
            const isSelected = player.id === selectedId;
            return (
              <button
                key={player.id}
                onClick={() => !locked && onSelect(player.id)}
                disabled={locked}
                dir="rtl"
                aria-label={`בחר ${player.name}`}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-right transition-colors min-h-[44px] ${
                  isSelected
                    ? "bg-[#FAEEDA] border-[#EF9F27]"
                    : "bg-white border-[#E5E7EB]"
                } ${locked ? "opacity-70 cursor-default" : "active:bg-[#F9FAFB]"}`}
              >
                <FlagIcon code={player.country_code} />
                <span className="flex-1 text-[15px] font-medium text-[#111827]">
                  {player.name}
                </span>
                <span className="text-[13px] text-[#6B7280]">{player.country}</span>
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-[#EF9F27] shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
