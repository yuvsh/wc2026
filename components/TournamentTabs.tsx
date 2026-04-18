"use client";

import { useState } from "react";
import GroupTable from "@/components/GroupTable";
import KnockoutBracket from "@/components/KnockoutBracket";
import type { GroupStandingRow, KnockoutMatch } from "@/lib/types/tournament";

interface GroupData {
  name: string;
  rows: GroupStandingRow[];
}

interface TournamentTabsProps {
  groups: GroupData[];
  knockoutMatches: KnockoutMatch[];
}

type TabType = "groups" | "knockout";

const COPY = {
  tabGroups: "בתים",
  tabKnockout: "נוקאאוט",
  emptyGroups: "הבתים יתמלאו עם תחילת הטורניר",
};

const TAB_IDS: Record<TabType, string> = {
  groups: "tab-groups",
  knockout: "tab-knockout",
};

const PANEL_IDS: Record<TabType, string> = {
  groups: "panel-groups",
  knockout: "panel-knockout",
};

export default function TournamentTabs({ groups, knockoutMatches }: TournamentTabsProps): React.ReactElement {
  const [tab, setTab] = useState<TabType>("groups");

  return (
    <>
      {/* Tab toggle */}
      <div role="tablist" className="flex gap-2 px-4 py-3 bg-white border-b border-[#E5E7EB]">
        {(["groups", "knockout"] as TabType[]).map((t) => (
          <button
            key={t}
            id={TAB_IDS[t]}
            role="tab"
            aria-selected={tab === t}
            aria-controls={PANEL_IDS[t]}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
              tab === t
                ? "bg-[#0D9488] text-white"
                : "bg-[#F3F4F6] text-[#6B7280]"
            }`}
          >
            {t === "groups" ? COPY.tabGroups : COPY.tabKnockout}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        id={PANEL_IDS[tab]}
        role="tabpanel"
        aria-labelledby={TAB_IDS[tab]}
        className="flex-1 flex flex-col px-4 py-4"
      >
        {tab === "groups" ? (
          groups.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[15px] text-[#9CA3AF]">{COPY.emptyGroups}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {groups.map(({ name, rows }) => (
                <GroupTable key={name} groupName={name} rows={rows} />
              ))}
            </div>
          )
        ) : (
          <KnockoutBracket matches={knockoutMatches} />
        )}
      </div>
    </>
  );
}
