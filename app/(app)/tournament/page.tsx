"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import GroupTable from "@/components/GroupTable";
import KnockoutBracket from "@/components/KnockoutBracket";

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

interface KnockoutMatch {
  id: string;
  stage: "r32" | "r16" | "qf" | "sf" | "final";
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  score_a: number | null;
  score_b: number | null;
  kickoff_at: string;
  status: string;
}

type TabType = "groups" | "knockout";

const COPY = {
  title: "טורניר",
  tabGroups: "בתים",
  tabKnockout: "סבב פלאיאוף",
  loading: "טוען...",
  emptyGroups: "נתוני הבתים יתעדכנו לאחר תחילת הטורניר",
};

export default function TournamentPage(): React.ReactElement {
  const supabase = createClient();

  const [tab, setTab] = useState<TabType>("groups");
  const [standings, setStandings] = useState<GroupStandingRow[]>([]);
  const [knockoutMatches, setKnockoutMatches] = useState<KnockoutMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (): Promise<void> => {
    const [standingsResult, matchesResult] = await Promise.all([
      supabase
        .from("group_standings")
        .select("id, group_name, team_name, team_code, position, played, won, drawn, lost, points, qualified")
        .order("group_name", { ascending: true })
        .order("position", { ascending: true }),
      supabase
        .from("matches")
        .select("id, stage, team_a, team_b, team_a_code, team_b_code, score_a, score_b, kickoff_at, status")
        .in("stage", ["r32", "r16", "qf", "sf", "final"])
        .not("status", "eq", "cancelled")
        .order("kickoff_at", { ascending: true }),
    ]);

    if (standingsResult.data) setStandings(standingsResult.data);
    if (matchesResult.data) setKnockoutMatches(matchesResult.data as KnockoutMatch[]);

    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh on page focus
  useEffect(() => {
    window.addEventListener("focus", loadData);
    return () => window.removeEventListener("focus", loadData);
  }, [loadData]);

  // Group standings by group_name
  const groupMap = new Map<string, GroupStandingRow[]>();
  for (const row of standings) {
    if (!groupMap.has(row.group_name)) groupMap.set(row.group_name, []);
    groupMap.get(row.group_name)!.push(row);
  }
  const groupNames = Array.from(groupMap.keys()).sort();

  return (
    <div className="flex-1 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 text-right">
        <h1 className="text-[17px] font-bold text-[#111827]">{COPY.title}</h1>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-[#E5E7EB]">
        {(["groups", "knockout"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-label={t === "groups" ? COPY.tabGroups : COPY.tabKnockout}
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
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
      <div className="flex-1 flex flex-col px-4 py-4">
        {tab === "groups" ? (
          groupNames.length === 0 ? (
            <div className="flex-1 flex items-center justify-center"><p className="text-[15px] text-[#9CA3AF]">{COPY.emptyGroups}</p></div>
          ) : (
            <div className="flex flex-col gap-4">
              {groupNames.map((name) => (
                <GroupTable
                  key={name}
                  groupName={name}
                  rows={groupMap.get(name)!}
                />
              ))}
            </div>
          )
        ) : (
          <KnockoutBracket matches={knockoutMatches} />
        )}
      </div>
      )}
    </div>
  );
}
