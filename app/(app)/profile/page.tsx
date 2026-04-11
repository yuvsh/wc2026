"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";
import { getInitials } from "@/lib/utils/initials";
import Link from "next/link";

interface UserProfile {
  display_name: string;
  provider: string;
  neighbourhood_id: string | null;
  hood_locked: boolean;
}

interface Neighbourhood {
  id: string;
  name: string;
}

interface League {
  league_id: string;
  leagues: {
    name: string;
    invite_code: string;
  } | {
    name: string;
    invite_code: string;
  }[];
}

interface UserStats {
  totalPoints: number;
  bingoCount: number;
  rank: number | null;
}

const COPY = {
  title: "פרופיל",
  connectedWith: (provider: string) => `מחובר עם ${provider === "google" ? "Google" : "Apple"}`,
  statsRank: "דירוג",
  statsPoints: "נקודות",
  statsBingo: "בינגו",
  sectionSettings: "הגדרות",
  labelDisplayName: "שם תצוגה",
  labelNeighbourhood: "שכונה",
  labelNeighbourhoodLocked: "שכונה (נעול)",
  neighbourhoodNone: "לא נבחרה",
  neighbourhoodLocked: "לא ניתן לשנות לאחר תחילת הטורניר",
  sectionLeagues: "ליגות",
  inviteCode: "קוד הזמנה",
  joinOrCreate: "הצטרף או צור ליגה חדשה",
  noLeagues: "אינך חבר בליגה",
  save: "שמור",
  saving: "שומר...",
  cancel: "ביטול",
  savedToast: "השם עודכן ✓",
  errorToast: "שגיאה בשמירה, נסה שוב",
  copyToast: "קוד הועתק ✓",
  logout: "התנתק",
  version: (v: string) => `גרסה ${v}`,
};

const APP_VERSION = "0.1.0";

function StatCard({ value, label }: { value: string | number; label: string }): React.ReactElement {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 bg-[#F9FAFB] rounded-xl py-3 px-2">
      <span className="text-[22px] font-bold text-[#111827] tabular-nums">{value}</span>
      <span className="text-[11px] text-[#9CA3AF]">{label}</span>
    </div>
  );
}

function SettingsRow({
  label,
  value,
  onTap,
  disabled,
  disabledHint,
}: {
  label: string;
  value: string;
  onTap?: () => void;
  disabled?: boolean;
  disabledHint?: string;
}): React.ReactElement {
  return (
    <button
      onClick={onTap}
      disabled={disabled || !onTap}
      title={disabledHint}
      aria-label={`${label}: ${value}`}
      className="w-full flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#F3F4F6] last:border-b-0 disabled:opacity-60 text-right"
    >
      <span className={`text-[15px] ${disabled ? "text-[#9CA3AF]" : "text-[#0D9488]"}`}>
        {!disabled && onTap ? "›" : ""}
      </span>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[15px] text-[#111827]">{value}</span>
        <span className="text-[12px] text-[#9CA3AF]">{label}</span>
      </div>
    </button>
  );
}

export default function ProfilePage(): React.ReactElement {
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [neighbourhood, setNeighbourhood] = useState<Neighbourhood | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalPoints: 0, bingoCount: 0, rank: null });
  const [loading, setLoading] = useState(true);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    async function load(): Promise<void> {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileResult, leaguesResult, predictionsResult] = await Promise.all([
        supabase
          .from("users")
          .select("display_name, provider, neighbourhood_id, hood_locked")
          .eq("id", user.id)
          .single(),
        supabase
          .from("league_members")
          .select("league_id, leagues(name, invite_code)")
          .eq("user_id", user.id),
        supabase
          .from("predictions")
          .select("points_awarded")
          .eq("user_id", user.id)
          .not("points_awarded", "is", null),
      ]);

      if (profileResult.error) {
        console.error("Failed to load profile:", profileResult.error);
      } else if (profileResult.data) {
        setProfile(profileResult.data);
        setNameInput(profileResult.data.display_name);

        // Load neighbourhood name if set
        if (profileResult.data.neighbourhood_id) {
          const { data: hoodData, error: hoodError } = await supabase
            .from("neighbourhoods")
            .select("id, name")
            .eq("id", profileResult.data.neighbourhood_id)
            .single();
          if (hoodError) {
            console.error("Failed to load neighbourhood:", hoodError);
          } else if (hoodData) {
            setNeighbourhood(hoodData);
          }
        }
      }

      if (leaguesResult.error) {
        console.error("Failed to load leagues:", leaguesResult.error);
      } else if (leaguesResult.data) {
        setLeagues(leaguesResult.data as League[]);

        // Compute rank from first league
        if (leaguesResult.data.length > 0) {
          const firstLeagueId = leaguesResult.data[0].league_id;
          const { data: members, error: membersError } = await supabase
            .from("league_members")
            .select("user_id, total_points")
            .eq("league_id", firstLeagueId)
            .order("total_points", { ascending: false });

          if (membersError) {
            console.error("Failed to load league members:", membersError);
          } else if (members) {
            const pos = members.findIndex((m) => m.user_id === user.id) + 1;
            setStats((prev) => ({ ...prev, rank: pos > 0 ? pos : null }));
          }
        }
      }

      if (predictionsResult.error) {
        console.error("Failed to load predictions:", predictionsResult.error);
      } else if (predictionsResult.data) {
        const totalPoints = predictionsResult.data.reduce(
          (sum, p) => sum + (p.points_awarded ?? 0),
          0
        );
        const bingoCount = predictionsResult.data.filter((p) => p.points_awarded === 3).length;
        setStats((prev) => ({ ...prev, totalPoints, bingoCount }));
      }

      setLoading(false);
    }

    load();
  }, [supabase]);

  async function handleSaveName(): Promise<void> {
    const trimmed = nameInput.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({ display_name: trimmed })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.error("Failed to update display name:", error);
      showToast(COPY.errorToast);
    } else {
      setProfile((prev) => prev ? { ...prev, display_name: trimmed } : prev);
      setEditingName(false);
      showToast(COPY.savedToast);
    }
  }

  function getLeague(entry: League): { name: string; invite_code: string } | null {
    const l = Array.isArray(entry.leagues) ? entry.leagues[0] : entry.leagues;
    return l ?? null;
  }

  async function copyInviteCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      showToast(COPY.copyToast);
    } catch {
      showToast(code);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.display_name ?? "";

  return (
    <div className="flex flex-col min-h-full pb-6" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 text-right">
        <h1 className="text-[17px] font-bold text-[#111827]">{COPY.title}</h1>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-2 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="w-16 h-16 rounded-full bg-[#0D9488] flex items-center justify-center text-white text-[22px] font-bold">
          {getInitials(displayName)}
        </div>
        <p className="text-[17px] font-bold text-[#111827]">{displayName}</p>
        {profile && (
          <p className="text-[13px] text-[#9CA3AF]">{COPY.connectedWith(profile.provider)}</p>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-4 py-4">
        <StatCard value={stats.rank ?? "—"} label={COPY.statsRank} />
        <StatCard value={stats.totalPoints} label={COPY.statsPoints} />
        <StatCard value={stats.bingoCount} label={COPY.statsBingo} />
      </div>

      {/* Settings section */}
      <div className="mx-4 mb-4">
        <p className="text-[13px] font-medium text-[#6B7280] mb-2 text-right">{COPY.sectionSettings}</p>
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          {/* Display name row — inline edit */}
          {editingName ? (
            <div className="px-4 py-3 flex items-center gap-3 border-b border-[#F3F4F6]">
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingName(false); setNameInput(profile?.display_name ?? ""); }}
                  aria-label="בטל עריכת שם"
                  className="text-[14px] text-[#6B7280] px-3 py-1.5 rounded-lg border border-[#E5E7EB] min-h-[44px]"
                >
                  {COPY.cancel}
                </button>
                <button
                  onClick={handleSaveName}
                  disabled={saving || !nameInput.trim()}
                  aria-label="שמור שם תצוגה"
                  className="text-[14px] text-white bg-[#0D9488] px-3 py-1.5 rounded-lg disabled:opacity-40 min-h-[44px]"
                >
                  {saving ? COPY.saving : COPY.save}
                </button>
              </div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                dir="rtl"
                aria-label="שם תצוגה"
                className="flex-1 text-[15px] text-[#111827] text-right bg-transparent border-b border-[#0D9488] focus:outline-none py-1"
              />
            </div>
          ) : (
            <SettingsRow
              label={COPY.labelDisplayName}
              value={displayName}
              onTap={() => setEditingName(true)}
            />
          )}

          {/* Neighbourhood row */}
          <SettingsRow
            label={profile?.hood_locked ? COPY.labelNeighbourhoodLocked : COPY.labelNeighbourhood}
            value={neighbourhood?.name ?? COPY.neighbourhoodNone}
            onTap={profile?.hood_locked ? undefined : () => { window.location.href = "/onboarding/neighbourhood"; }}
            disabled={profile?.hood_locked}
            disabledHint={profile?.hood_locked ? COPY.neighbourhoodLocked : undefined}
          />
        </div>
      </div>

      {/* Leagues section */}
      <div className="mx-4 mb-4">
        <p className="text-[13px] font-medium text-[#6B7280] mb-2 text-right">{COPY.sectionLeagues}</p>
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          {leagues.length === 0 ? (
            <p className="text-[14px] text-[#9CA3AF] px-4 py-3 text-right">{COPY.noLeagues}</p>
          ) : (
            leagues.map((entry) => {
              const league = getLeague(entry);
              if (!league) return null;
              return (
                <div
                  key={entry.league_id}
                  className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6] last:border-b-0"
                >
                  <button
                    onClick={() => copyInviteCode(league.invite_code)}
                    aria-label={`העתק קוד הזמנה: ${league.invite_code}`}
                    className="text-[13px] text-[#0D9488] font-mono bg-[#F0FDFA] px-2 py-1 rounded-lg min-h-[44px] flex items-center"
                  >
                    {league.invite_code}
                  </button>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[15px] font-medium text-[#111827]">{league.name}</span>
                    <span className="text-[12px] text-[#9CA3AF]">{COPY.inviteCode}</span>
                  </div>
                </div>
              );
            })
          )}
          <Link
            href="/onboarding/league"
            aria-label="הצטרף או צור ליגה חדשה"
            className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#F3F4F6] text-[14px] text-[#0D9488] font-medium"
          >
            {COPY.joinOrCreate}
            <span>›</span>
          </Link>
        </div>
      </div>

      {/* Logout + version */}
      <div className="mx-4 mt-auto flex flex-col gap-3">
        <form action={logout}>
          <button
            type="submit"
            aria-label="התנתק מהחשבון"
            className="w-full py-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-[15px] font-bold min-h-[44px]"
          >
            {COPY.logout}
          </button>
        </form>
        <p className="text-center text-[12px] text-[#9CA3AF]">{COPY.version(APP_VERSION)}</p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[14px] font-medium px-4 py-2 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
