import { createPublicClient } from "@/lib/supabase/public";
import TournamentTabs from "@/components/TournamentTabs";
import { buildGroups } from "@/lib/utils/standings";
import type { GroupStandingRow, KnockoutMatch } from "@/lib/types/tournament";

// ISR: revalidate every 60 seconds so Vercel serves a cached page between refreshes.
// Must be a static literal — Next.js performs static analysis and cannot resolve variable references.
export const revalidate = 60;

const COPY = {
  title: "טורניר",
};

export default async function TournamentPage(): Promise<React.ReactElement> {
  const supabase = createPublicClient();

  const [standingsResult, matchesResult] = await Promise.all([
    supabase
      .from("group_standings")
      .select("id, group_name, team_name, team_code, position, played, won, drawn, lost, goals_for, goals_against, points, qualified")
      .order("group_name", { ascending: true })
      .order("position", { ascending: true }),
    supabase
      .from("matches")
      .select("id, stage, team_a, team_b, team_a_code, team_b_code, score_a, score_b, kickoff_at, status")
      .in("stage", ["r32", "r16", "qf", "sf", "final"])
      .not("status", "eq", "cancelled")
      .order("kickoff_at", { ascending: true }),
  ]);

  // Throw on Supabase errors — Next.js ISR will not cache a thrown page, it retries on next request.
  // Rendering empty state on error would cache empty data for 60 seconds.
  if (standingsResult.error) {
    console.error("[TournamentPage] standings fetch failed:", standingsResult.error.message);
    throw new Error("Failed to load tournament standings");
  }
  if (matchesResult.error) {
    console.error("[TournamentPage] matches fetch failed:", matchesResult.error.message);
    throw new Error("Failed to load knockout matches");
  }

  const standings: GroupStandingRow[] = standingsResult.data;

  // Runtime type predicate — validates stage and status against their union types
  // without an unsafe `as` cast. Rows with unexpected values are silently dropped
  // (shouldn't happen given the .in("stage", ...) query filter, but guards DB drift).
  const VALID_STAGES = new Set<string>(["r32", "r16", "qf", "sf", "final"]);
  const VALID_STATUSES = new Set<string>(["scheduled", "live", "finished", "postponed", "cancelled"]);
  const knockoutMatches: KnockoutMatch[] = matchesResult.data.filter(
    (m): m is KnockoutMatch => VALID_STAGES.has(m.stage) && VALID_STATUSES.has(m.status)
  );

  const groups = buildGroups(standings);

  return (
    <div className="flex-1 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3">
        <h1 className="text-[17px] font-bold text-[#111827]">{COPY.title}</h1>
      </div>

      <TournamentTabs groups={groups} knockoutMatches={knockoutMatches} />
    </div>
  );
}
