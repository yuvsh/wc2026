"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/actions/auth";
import { getInitials } from "@/lib/utils/initials";
import Link from "next/link";

interface UserProfile {
  display_name: string;
  avatar_url: string | null;
  provider: string;
  neighbourhood_id: string | null;
  hood_locked: boolean;
}

interface Neighbourhood {
  id: string;
  name: string;
}

interface LeagueEntry {
  league_id: string;
  name: string;
  invite_code: string;
  created_by: string | null;
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
  labelNeighbourhoodLocked: "שכונה",
  neighbourhoodNone: "לא נבחרה",
  neighbourhoodLocked: "הטורניר התחיל — לא ניתן לשנות",
  sectionLeagues: "ליגות",
  globalLeagueBadge: "כל המשתתפים",
  globalLeagueSublabel: "כולם משחקים",
  inviteCode: "קוד הזמנה",
  joinOrCreate: "הצטרף לליגה או צור אחת",
  noLeagues: "עדיין לא בליגה",
  deleteLeague: "מחק ליגה",
  deleteConfirm: "בטוח? הפעולה לא ניתנת לביטול",
  deleteYes: "כן, מחק",
  deleteNo: "ביטול",
  deleteToast: "הליגה נמחקה",
  save: "שמור",
  saving: "שומר...",
  cancel: "ביטול",
  savedToast: "השם עודכן ✓",
  errorToast: "משהו השתבש, נסה שוב",
  copyToast: "קוד הועתק ✓",
  logout: "התנתק",
  version: (v: string) => `גרסה ${v}`,
};

const GLOBAL_LEAGUE_ID = "00000000-0000-0000-0000-000000000001";
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
      <span aria-hidden="true" className={`text-[15px] ${disabled ? "text-[#9CA3AF]" : "text-[#0D9488]"}`}>
        {!disabled && onTap ? "‹" : ""}
      </span>
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[15px] text-[#111827]">{value}</span>
        <span className="text-[12px] text-[#9CA3AF]">{label}</span>
      </div>
    </button>
  );
}

export default function ProfilePage(): React.ReactElement {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [neighbourhood, setNeighbourhood] = useState<Neighbourhood | null>(null);
  const [leagues, setLeagues] = useState<LeagueEntry[]>([]);
  const [stats, setStats] = useState<UserStats>({ totalPoints: 0, bingoCount: 0, rank: null });
  const [loading, setLoading] = useState(true);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    async function load(): Promise<void> {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) { setLoading(false); return; }
      setUserId(user.id);

      const [profileResult, membershipsResult, predictionsResult] = await Promise.all([
        supabase
          .from("users")
          .select("display_name, avatar_url, provider, neighbourhood_id, hood_locked")
          .eq("id", user.id)
          .single(),
        // Two-step league load: memberships first, then league details separately
        // (avoid nested joins — RLS on both tables silently returns null for nested rows)
        supabase
          .from("league_members")
          .select("league_id")
          .eq("user_id", user.id),
        supabase
          .from("predictions")
          .select("points_awarded")
          .eq("user_id", user.id)
          .not("points_awarded", "is", null),
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
        setNameInput(profileResult.data.display_name);

        if (profileResult.data.neighbourhood_id) {
          const { data: hoodData } = await supabase
            .from("neighbourhoods")
            .select("id, name")
            .eq("id", profileResult.data.neighbourhood_id)
            .single();
          if (hoodData) setNeighbourhood(hoodData);
        }
      }

      if (membershipsResult.data && membershipsResult.data.length > 0) {
        const leagueIds = membershipsResult.data.map((m) => m.league_id);

        const { data: leagueRows, error: leagueError } = await supabase
          .from("leagues")
          .select("id, name, invite_code, created_by")
          .in("id", leagueIds);

        if (leagueError) {
          // League load failed — user still sees the rest of the profile
        } else if (leagueRows && leagueRows.length > 0) {
          const entries: LeagueEntry[] = leagueRows.map((row) => ({
            league_id: row.id as string,
            name: row.name as string,
            invite_code: row.invite_code as string,
            created_by: row.created_by as string | null,
          }));
          setLeagues(entries);

          // Rank: use first non-global league for ranking context; fall back to global
          const rankLeagueId = entries.find((e) => e.league_id !== GLOBAL_LEAGUE_ID)?.league_id
            ?? entries[0].league_id;
          const { data: members, error: rankError } = await supabase
            .from("league_members")
            .select("user_id, total_points")
            .eq("league_id", rankLeagueId)
            .order("total_points", { ascending: false });

          if (!rankError && members) {
            const pos = members.findIndex((m) => m.user_id === user.id) + 1;
            setStats((prev) => ({ ...prev, rank: pos > 0 ? pos : null }));
          }
        }
      }

      if (predictionsResult.data) {
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

  async function handleLogout(): Promise<void> {
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      // NEXT_REDIRECT is not a real error — Next.js uses it internally to trigger redirects
      if (err instanceof Error && "digest" in err && typeof (err as { digest?: string }).digest === "string" && (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")) {
        throw err;
      }
      setLoggingOut(false);
    }
  }

  async function handleSaveName(): Promise<void> {
    const trimmed = nameInput.trim();
    if (!trimmed || saving || !userId) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ display_name: trimmed })
        .eq("id", userId);

      if (error) {
        showToast(COPY.errorToast);
      } else {
        setProfile((prev) => prev ? { ...prev, display_name: trimmed } : prev);
        setEditingName(false);
        showToast(COPY.savedToast);
      }
    } finally {
      setSaving(false);
    }
  }

  async function copyInviteCode(code: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      showToast(COPY.copyToast);
    } catch {
      showToast(code);
    }
  }

  async function handleDeleteLeague(leagueId: string): Promise<void> {
    setDeleting(true);
    const { error } = await supabase.from("leagues").delete().eq("id", leagueId);
    setDeleting(false);
    setConfirmDeleteId(null);
    if (error) {
      showToast(COPY.errorToast);
    } else {
      setLeagues((prev) => prev.filter((l) => l.league_id !== leagueId));
      showToast(COPY.deleteToast);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.display_name ?? "";

  return (
    <div className="flex-1 flex flex-col pb-6" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 text-right">
        <h1 className="text-[17px] font-bold text-[#111827]">{COPY.title}</h1>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-2 py-6 bg-white border-b border-[#E5E7EB]">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-[#0D9488] flex items-center justify-center text-white text-[22px] font-bold">
            {getInitials(displayName)}
          </div>
        )}
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
                  onClick={handleSaveName}
                  disabled={saving || !nameInput.trim()}
                  aria-label="שמור שם תצוגה"
                  className="text-[14px] text-white bg-[#0D9488] px-3 py-1.5 rounded-lg disabled:opacity-40 min-h-[44px]"
                >
                  {saving ? COPY.saving : COPY.save}
                </button>
                <button
                  onClick={() => { setEditingName(false); setNameInput(profile?.display_name ?? ""); }}
                  aria-label="בטל עריכת שם"
                  className="text-[14px] text-[#6B7280] px-3 py-1.5 rounded-lg border border-[#E5E7EB] min-h-[44px]"
                >
                  {COPY.cancel}
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
            onTap={profile?.hood_locked ? undefined : () => router.push("/onboarding/neighbourhood?redirect=/profile")}
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
              const isGlobal = entry.league_id === GLOBAL_LEAGUE_ID;
              const isOwner = entry.created_by === userId;
              const isConfirming = confirmDeleteId === entry.league_id;

              return (
                <div
                  key={entry.league_id}
                  className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6] last:border-b-0 gap-3"
                >
                  {/* Left side: invite code / badge / delete confirm */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isConfirming ? (
                      <>
                        <button
                          onClick={() => handleDeleteLeague(entry.league_id)}
                          disabled={deleting}
                          aria-label="אשר מחיקת ליגה"
                          className="text-[13px] text-white bg-[#DC2626] px-3 py-1.5 rounded-lg min-h-[44px] flex items-center disabled:opacity-50"
                        >
                          {deleting ? (
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : COPY.deleteYes}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          aria-label="בטל מחיקת ליגה"
                          className="text-[13px] text-[#6B7280] px-3 py-1.5 rounded-lg border border-[#E5E7EB] min-h-[44px] flex items-center"
                        >
                          {COPY.deleteNo}
                        </button>
                      </>
                    ) : isGlobal ? (
                      <span className="text-[12px] text-[#0D9488] bg-[#F0FDFA] px-2 py-1 rounded-full">
                        {COPY.globalLeagueBadge}
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => copyInviteCode(entry.invite_code)}
                          aria-label={`העתק קוד הזמנה: ${entry.invite_code}`}
                          className="text-[13px] text-[#0D9488] font-mono bg-[#F0FDFA] px-2 py-1 rounded-lg min-h-[44px] flex items-center"
                        >
                          {entry.invite_code}
                        </button>
                        {isOwner && (
                          <button
                            onClick={() => setConfirmDeleteId(entry.league_id)}
                            aria-label={`מחק ליגה: ${entry.name}`}
                            className="text-[#DC2626] min-h-[44px] min-w-[44px] flex items-center justify-center"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right side: name + sublabel */}
                  <div className="flex flex-col items-end gap-0.5 flex-1">
                    <span className="text-[15px] font-medium text-[#111827]">{entry.name}</span>
                    {isConfirming ? (
                      <span className="text-[12px] text-[#DC2626]">{COPY.deleteConfirm}</span>
                    ) : (
                      <span className="text-[12px] text-[#9CA3AF]">
                        {isGlobal ? COPY.globalLeagueSublabel : COPY.inviteCode}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <Link
            href="/onboarding/league"
            aria-label="הצטרף או צור ליגה חדשה"
            className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#E5E7EB] text-[14px] text-[#0D9488] font-medium"
          >
            {COPY.joinOrCreate}
            <span aria-hidden="true">‹</span>
          </Link>
        </div>
      </div>

      {/* Logout + version */}
      <div className="mx-4 mt-auto flex flex-col gap-3">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="התנתק מהחשבון"
          className="w-full py-3 rounded-xl bg-[#FEE2E2] text-[#DC2626] text-[15px] font-bold min-h-[44px] flex items-center justify-center disabled:opacity-60"
        >
          {loggingOut ? (
            <div className="w-5 h-5 border-2 border-[#FCA5A5] border-t-[#DC2626] rounded-full animate-spin" />
          ) : COPY.logout}
        </button>
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

function TrashIcon(): React.ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 4.5h12M7.5 4.5V3h3v1.5M14.25 4.5l-.75 10.5H4.5L3.75 4.5M7.5 8.25v4.5M10.5 8.25v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
