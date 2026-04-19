"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Podium from "@/components/Podium";
import LeaderboardRow from "@/components/LeaderboardRow";
import { useLeagues } from "@/hooks/useLeagues";
import { useLeagueMembers } from "@/hooks/useLeagueMembers";

const COPY = {
  title: "דירוג",
  tabPersonal: "אישי",
  tabHood: "שכונות",
  comingSoon: "בקרוב",
  empty: "הליגה עדיין ריקה — שתף את הקוד!",
  noLeagues: "עדיין לא בליגה? צור אחת ←",
};

export default function LeaderboardPage(): React.ReactElement {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeLeagueId, setActiveLeagueId] = useState<string | null>(null);

  const handleMemberClick = useCallback(
    (memberId: string, memberName: string) => {
      if (!activeLeagueId) return;
      const params = new URLSearchParams({
        leagueId: activeLeagueId,
        name: memberName,
      });
      router.push(`/leaderboard/${memberId}?${params.toString()}`);
    },
    [activeLeagueId, router]
  );

  useEffect(() => {
    async function loadUser(): Promise<void> {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) return;
      setUserId(user.id);
    }
    loadUser();
  }, [supabase]);

  const { leagues, isLoading: leaguesLoading } = useLeagues(userId);
  const { members, isLoading: membersLoading } = useLeagueMembers(activeLeagueId);

  const loading = leaguesLoading || (!!activeLeagueId && membersLoading);

  // Set first league as active once leagues load
  useEffect(() => {
    if (leagues.length > 0 && !activeLeagueId) {
      setActiveLeagueId(leagues[0].id);
    }
  }, [leagues, activeLeagueId]);

  const top3 = members.slice(0, 3);

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
                  aria-label={league.name}
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
              first={top3[0] ? { displayName: top3[0].display_name, totalPoints: top3[0].total_points, isCurrentUser: top3[0].user_id === userId } : null}
              second={top3[1] ? { displayName: top3[1].display_name, totalPoints: top3[1].total_points, isCurrentUser: top3[1].user_id === userId } : null}
              third={top3[2] ? { displayName: top3[2].display_name, totalPoints: top3[2].total_points, isCurrentUser: top3[2].user_id === userId } : null}
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
                  displayName={member.display_name}
                  neighbourhoodName={member.neighbourhood}
                  totalPoints={member.total_points}
                  isCurrentUser={member.user_id === userId}
                  onClick={() => handleMemberClick(member.user_id, member.display_name)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
