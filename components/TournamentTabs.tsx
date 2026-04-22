"use client";

import { useState, useEffect, useMemo, useId } from "react";
import { createClient } from "@/lib/supabase/client";
import GroupTable from "@/components/GroupTable";
import KnockoutBracket from "@/components/KnockoutBracket";
import { buildGroups } from "@/lib/utils/standings";
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

const GROUP_STANDINGS_SELECT =
  "id, group_name, team_name, team_code, position, played, won, drawn, lost, goals_for, goals_against, points, qualified";

export default function TournamentTabs({ groups: initialGroups, knockoutMatches }: TournamentTabsProps): React.ReactElement {
  const [tab, setTab] = useState<TabType>("groups");
  const [groups, setGroups] = useState<GroupData[]>(initialGroups);

  const supabase = useMemo(() => createClient(), []);
  // useId ensures a unique channel name per component instance,
  // preventing collision under React 18 Strict Mode double-invoke.
  // Colons stripped — they are reserved as topic/subtopic delimiters in Phoenix WebSocket.
  const rawId = useId();
  const instanceId = rawId.replace(/:/g, "");

  const fetchStandings = useMemo(
    () => async (): Promise<void> => {
      try {
        const { data, error } = await supabase
          .from("group_standings")
          .select(GROUP_STANDINGS_SELECT)
          .order("group_name", { ascending: true })
          .order("position", { ascending: true });

        if (error) {
          console.error("[TournamentTabs] standings fetch failed:", error.message);
          return;
        }
        if (data) {
          setGroups(buildGroups(data as GroupStandingRow[]));
        }
      } catch (err) {
        console.error("[TournamentTabs] standings fetch threw:", err);
      }
    },
    [supabase]
  );

  // On mount: fetch fresh data regardless of what the Router Cache served.
  // The server ISR data is the initial state; this corrects any stale data
  // caused by Next.js client-side Router Cache (30s TTL for static routes).
  useEffect(() => {
    void fetchStandings();
  }, [fetchStandings]);

  // Realtime: keep the view live while the page is open.
  useEffect(() => {
    const channel = supabase
      .channel(`group_standings_live_${instanceId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_standings" },
        () => { void fetchStandings(); }
      )
      .subscribe();

    // cleanup cannot be async — void discards the unsubscribe promise intentionally
    return () => { void supabase.removeChannel(channel); };
  }, [supabase, instanceId, fetchStandings]);

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
