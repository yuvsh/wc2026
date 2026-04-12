"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Podium from "@/components/Podium";
import LeaderboardRow from "@/components/LeaderboardRow";

interface League {
  id: string;
  name: string;
}

interface Member {
  user_id: string;
  total_points: number;
  users: {
    display_name: string;
    neighbourhood_id: string | null;
    neighbourhoods: { name: string } | { name: string }[] | null;
  } | {
    display_name: string;
    neighbourhood_id: string | null;
    neighbourhoods: { name: string } | { name: string }[] | null;
  }[];
}

const COPY = {
  title: "טבלת דירוג",
  tabPersonal: "אישי",
  tabHood: "שכונות",
  comingSoon: "בקרוב",
  empty: "אין משתתפים עדיין",
  noLeagues: "עוד לא הצטרפת לליגה",
};

export default function LeaderboardPage(): React.ReactElement {
  const supabase = createClient();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [activeLeagueId, setActiveLeagueId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: memberRows } = await supabase
        .from("league_members")
        .select("league_id")
        .eq("user_id", user.id);

      if (!memberRows || memberRows.length === 0) {
        setLoading(false);
        return;
      }

      const leagueIds = memberRows.map((r) => r.league_id);
      const { data: leagueRows } = await supabase
        .from("leagues")
        .select("id, name")
        .in("id", leagueIds);

      if (leagueRows && leagueRows.length > 0) {
        setLeagues(leagueRows);
        setActiveLeagueId(leagueRows[0].id);
      }

      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!activeLeagueId) return;

    async function loadMembers(): Promise<void> {
      const { data } = await supabase
        .from("league_members")
        .select(`
          user_id,
          total_points,
          users (
            display_name,
            neighbourhood_id,
            neighbourhoods ( name )
          )
        `)
        .eq("league_id", activeLeagueId)
        .order("total_points", { ascending: false });

      if (data) setMembers(data as Member[]);
    }

    loadMembers();
  }, [activeLeagueId]);

  const top3 = members.slice(0, 3);
  const rest = members.slice(3);

  function getMemberName(m: Member): string {
    const u = Array.isArray(m.users) ? m.users[0] : m.users;
    return u?.display_name ?? "—";
  }

  function getNeighbourhood(m: Member): string | null {
    const u = Array.isArray(m.users) ? m.users[0] : m.users;
    if (!u) return null;
    const n = u.neighbourhoods;
    return Array.isArray(n) ? (n[0]?.name ?? null) : (n?.name ?? null);
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 text-right">
        <h1 className="text-[17px] font-bold text-[#111827]">{COPY.title}</h1>
      </div>

      {/* Personal / Neighbourhood tabs */}
      <div className="bg-white border-b border-[#E5E7EB] flex">
        <button className="flex-1 py-3 text-[13px] font-medium text-[#0D9488] border-b-2 border-[#0D9488]">
          {COPY.tabPersonal}
        </button>
        <button className="flex-1 py-3 text-[13px] text-[#9CA3AF] flex items-center justify-center gap-1" disabled>
          {COPY.tabHood}
          <span className="text-[11px] bg-[#F3F4F6] text-[#9CA3AF] px-2 py-0.5 rounded-full">
            {COPY.comingSoon}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : leagues.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[15px] text-[#9CA3AF]">{COPY.noLeagues}</p>
        </div>
      ) : (
        <>
          {/* League tabs */}
          {leagues.length > 1 && (
            <div className="bg-white border-b border-[#E5E7EB] flex overflow-x-auto gap-1 px-4 py-2">
              {leagues.map((league) => (
                <button
                  key={league.id}
                  onClick={() => setActiveLeagueId(league.id)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    activeLeagueId === league.id
                      ? "bg-[#0D9488] text-white"
                      : "bg-[#F3F4F6] text-[#6B7280]"
                  }`}
                >
                  {league.name}
                </button>
              ))}
            </div>
          )}

          {/* Podium */}
          {members.length >= 3 && (
            <Podium
              first={top3[0] ? { displayName: getMemberName(top3[0]), totalPoints: top3[0].total_points, isCurrentUser: top3[0].user_id === userId } : null}
              second={top3[1] ? { displayName: getMemberName(top3[1]), totalPoints: top3[1].total_points, isCurrentUser: top3[1].user_id === userId } : null}
              third={top3[2] ? { displayName: getMemberName(top3[2]), totalPoints: top3[2].total_points, isCurrentUser: top3[2].user_id === userId } : null}
            />
          )}

          {/* Member list */}
          <div className="flex-1 px-4 py-4 flex flex-col gap-2 pb-6">
            {members.length === 0 ? (
              <p className="text-center text-[#9CA3AF] text-[15px] mt-12">{COPY.empty}</p>
            ) : (
              members.map((member, index) => (
                <LeaderboardRow
                  key={member.user_id}
                  position={index + 1}
                  displayName={getMemberName(member)}
                  neighbourhoodName={getNeighbourhood(member)}
                  totalPoints={member.total_points}
                  isCurrentUser={member.user_id === userId}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
