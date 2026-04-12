"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PlayerList from "@/components/PlayerList";
import { useCountdown } from "@/hooks/useCountdown";

interface Player {
  id: string;
  name: string;
  country: string;
  country_code: string;
}

const COPY = {
  title: "מלך השערים",
  subtitle: "בחר את מלך השערים שלך לפני תחילת הטורניר",
  lockLabel: "נועל בעוד",
  lockedTitle: "הבחירה נעולה",
  lockedSubtitle: "הטורניר התחיל — לא ניתן לשנות בחירה",
  confirmButton: "אשר בחירה",
  changeButton: "שנה בחירה",
  saving: "שומר...",
  savedToast: "הבחירה נשמרה ✓",
  errorToast: "שגיאה בשמירה, נסה שוב",
  noSelection: "בחר שחקן מהרשימה",
  back: "→",
};

function LockCountdown({ kickoffAt }: { kickoffAt: Date }): React.ReactElement {
  const { display, isLocked } = useCountdown(kickoffAt);

  if (isLocked) {
    return (
      <span className="text-[13px] text-[#EF9F27] font-medium">
        {COPY.lockedTitle}
      </span>
    );
  }

  return (
    <span className="text-[13px] text-[#6B7280]">
      {COPY.lockLabel}{" "}
      <span className="font-bold text-[#111827] tabular-nums">{display}</span>
    </span>
  );
}

export default function GoldenBootPage(): React.ReactElement {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [firstKickoff, setFirstKickoff] = useState<Date | null>(null);
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    async function load(): Promise<void> {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) { setLoading(false); return; }

      const [playersResult, firstMatchResult, existingResult] = await Promise.all([
        supabase
          .from("players")
          .select("id, name, country, country_code")
          .order("display_order", { ascending: true }),
        supabase
          .from("matches")
          .select("kickoff_at")
          .not("status", "eq", "cancelled")
          .order("kickoff_at", { ascending: true })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("golden_boot_predictions")
          .select("player_id")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      if (playersResult.data) setPlayers(playersResult.data);

      if (firstMatchResult.data) {
        const kickoff = new Date(firstMatchResult.data.kickoff_at);
        const lockTime = new Date(kickoff.getTime() - 5 * 60 * 1000);
        setFirstKickoff(kickoff);
        setLocked(new Date() >= lockTime);
      }

      if (existingResult.data?.player_id) {
        setSavedId(existingResult.data.player_id);
        setSelectedId(existingResult.data.player_id);
      }

      setLoading(false);
    }

    load();
  }, [supabase]);

  // Re-check lock every 30s
  useEffect(() => {
    if (!firstKickoff) return;
    const interval = setInterval(() => {
      const lockTime = new Date(firstKickoff.getTime() - 5 * 60 * 1000);
      setLocked(new Date() >= lockTime);
    }, 30000);
    return () => clearInterval(interval);
  }, [firstKickoff]);

  async function handleConfirm(): Promise<void> {
    if (!selectedId || saving || locked) return;

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("golden_boot_predictions")
      .upsert(
        { user_id: user.id, player_id: selectedId },
        { onConflict: "user_id" }
      );

    setSaving(false);

    if (error) {
      showToast(COPY.errorToast);
    } else {
      setSavedId(selectedId);
      showToast(COPY.savedToast);
    }
  }

  const selectedPlayer = players.find((p) => p.id === selectedId);
  const hasUnsavedChange = selectedId !== savedId;

  return (
    <div className="flex-1 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          aria-label="חזור"
          className="text-[#0D9488] text-[17px] font-medium min-w-[44px] min-h-[44px] flex items-center"
        >
          {COPY.back}
        </button>
        <h1 className="text-[17px] font-bold text-[#111827]">{COPY.title}</h1>
        <div className="min-w-[44px]" />
      </div>

      {/* Lock status bar */}
      {!loading && firstKickoff && (
        <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-2 flex justify-end">
          <LockCountdown kickoffAt={firstKickoff} />
        </div>
      )}

      {/* Subtitle */}
      <div className="px-4 py-3">
        <p className="text-[13px] text-[#6B7280] text-right">
          {locked ? COPY.lockedSubtitle : COPY.subtitle}
        </p>
      </div>

      {/* Player list */}
      <div className="flex-1 px-4 pb-32 overflow-y-auto">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <PlayerList
            players={players}
            selectedId={selectedId}
            locked={locked}
            onSelect={setSelectedId}
          />
        )}
      </div>

      {/* Confirm bar */}
      {!locked && !loading && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <div className="flex-1 text-right">
              {selectedPlayer ? (
                <p className="text-[15px] font-medium text-[#111827] truncate">
                  {selectedPlayer.name}
                </p>
              ) : (
                <p className="text-[15px] text-[#9CA3AF]">{COPY.noSelection}</p>
              )}
            </div>
            <button
              onClick={handleConfirm}
              disabled={!selectedId || saving || !hasUnsavedChange}
              aria-label="אשר בחירת מלך השערים"
              className="shrink-0 px-6 py-2.5 rounded-xl bg-[#EF9F27] text-white text-[15px] font-bold disabled:opacity-40 transition-opacity min-h-[44px]"
            >
              {saving ? COPY.saving : savedId && !hasUnsavedChange ? COPY.changeButton : COPY.confirmButton}
            </button>
          </div>
        </div>
      )}

      {/* Locked confirm bar — read only */}
      {locked && savedId && !loading && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#FFFBEB] border-t border-[#FDE68A] px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 justify-end">
            <span className="text-[11px] text-[#EF9F27] font-medium px-2 py-1 bg-[#FDE68A] rounded-full">
              נעול
            </span>
            {selectedPlayer && (
              <p className="text-[15px] font-medium text-[#111827]">{selectedPlayer.name}</p>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[14px] font-medium px-4 py-2 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
