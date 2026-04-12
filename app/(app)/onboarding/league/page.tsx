"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isValidInviteCode } from "@/lib/utils/inviteCode";

interface League {
  id: string;
  name: string;
  invite_code: string;
}

interface LeagueMemberRow {
  total_points: number;
  leagues: League | League[];
}

const COPY = {
  greeting: (name: string) => `שלום, ${name} 👋`,
  createTitle: "צור ליגה",
  createDesc: "קבל קוד הזמנה ושתף עם החברים",
  divider: "או",
  joinPlaceholder: "הכנס קוד — A4X9K2",
  joinBtn: "הצטרף",
  joinError: "קוד לא תקין, נסה שוב",
  myLeagues: "הליגות שלי",
  leagueRank: (rank: number) => `דירוג #${rank}`,
};

export default function LeaguePage(): React.ReactElement {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState(false);
  const [joining, setJoining] = useState(false);
  const [existingLeagues, setExistingLeagues] = useState<LeagueMemberRow[]>([]);

  useEffect(() => {
    async function loadUser(): Promise<void> {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("users")
        .select("display_name")
        .eq("id", user.id)
        .single();

      if (profile) setDisplayName(profile.display_name);

      // Fetch memberships first, then fetch league details separately to avoid RLS join issues
      const { data: memberRows } = await supabase
        .from("league_members")
        .select("total_points, league_id")
        .eq("user_id", user.id);

      if (memberRows && memberRows.length > 0) {
        const leagueIds = memberRows.map((m) => m.league_id);
        const { data: leagueRows } = await supabase
          .from("leagues")
          .select("id, name, invite_code")
          .in("id", leagueIds);

        if (leagueRows) {
          const merged: LeagueMemberRow[] = memberRows.map((m) => ({
            total_points: m.total_points,
            leagues: leagueRows.find((l) => l.id === m.league_id) as League,
          }));
          setExistingLeagues(merged);
        }
      }
    }
    loadUser();
  }, []);

  function handleCreateLeague(): void {
    router.push("/onboarding/create-league");
  }

  async function handleJoin(): Promise<void> {
    const code = joinCode.trim().toUpperCase();
    if (!isValidInviteCode(code)) {
      setJoinError(true);
      return;
    }

    setJoining(true);
    setJoinError(false);

    const { data: league } = await supabase
      .from("leagues")
      .select("id")
      .eq("invite_code", code)
      .single();

    if (!league) {
      setJoinError(true);
      setJoining(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) { setJoining(false); return; }

    // Insert — ignore conflict if already a member
    await supabase
      .from("league_members")
      .upsert(
        { league_id: league.id, user_id: user.id },
        { onConflict: "league_id,user_id", ignoreDuplicates: true }
      );

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col px-4 pt-12 pb-8" dir="rtl">
      {/* Step dots */}
      <div className="flex justify-center gap-2 mb-8">
        <div className="h-2 w-2 rounded-full bg-[#D1D5DB]" />
        <div className="h-2 w-2 rounded-full bg-[#D1D5DB]" />
        <div className="h-2 w-6 rounded-full bg-[#0D9488]" />
      </div>

      {/* Greeting */}
      <h1 className="text-[22px] font-bold text-[#111827] text-right mb-8">
        {COPY.greeting(displayName)}
      </h1>

      {/* Create league card */}
      <button
        onClick={handleCreateLeague}
        className="w-full rounded-xl border-2 border-[#0D9488] bg-[#F0FDFA] p-5 text-right mb-4 active:opacity-80 transition-opacity"
      >
        <p className="text-[17px] font-bold text-[#0D9488]">{COPY.createTitle}</p>
        <p className="text-[15px] text-[#6B7280] mt-1">{COPY.createDesc}</p>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-[15px] text-[#9CA3AF]">{COPY.divider}</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* Join league */}
      <div className="flex gap-2 mb-2">
        <button
          onClick={handleJoin}
          disabled={joining}
          className="h-12 px-5 rounded-xl bg-[#0D9488] text-white text-[15px] font-medium disabled:opacity-40 active:opacity-80 transition-opacity shrink-0 flex items-center justify-center min-w-[72px]"
        >
          {joining ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : COPY.joinBtn}
        </button>
        <input
          type="text"
          value={joinCode}
          onChange={(e) => {
            setJoinCode(e.target.value.toUpperCase());
            setJoinError(false);
          }}
          placeholder={COPY.joinPlaceholder}
          maxLength={6}
          dir="ltr"
          className={`flex-1 h-12 rounded-xl border px-4 text-center text-[15px] bg-white outline-none focus:border-[#0D9488] transition-colors ${
            joinError ? "border-[#E24B4A]" : "border-[#E5E7EB]"
          }`}
        />
      </div>
      {joinError && (
        <p className="text-[13px] text-[#E24B4A] text-right mb-4">
          {COPY.joinError}
        </p>
      )}

      {/* Existing leagues */}
      {existingLeagues.length > 0 && (
        <div className="mt-6">
          <p className="text-[13px] font-medium text-[#6B7280] text-right mb-3">
            {COPY.myLeagues}
          </p>
          <div className="flex flex-col gap-2">
            {existingLeagues.map((membership, index) => (
              <div
                key={Array.isArray(membership.leagues) ? membership.leagues[0]?.id : membership.leagues.id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center justify-between"
              >
                <span className="text-[13px] text-[#6B7280]">
                  {COPY.leagueRank(index + 1)}
                </span>
                <span className="text-[15px] font-medium text-[#111827]">
                  {Array.isArray(membership.leagues) ? membership.leagues[0]?.name : membership.leagues.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
