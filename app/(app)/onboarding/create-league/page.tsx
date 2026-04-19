"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateInviteCode } from "@/lib/utils/inviteCode";

const COPY = {
  pageTitle: "צור ליגה",
  leagueNameLabel: "שם הליגה",
  leagueNamePlaceholder: "למשל: ליגת רביבים 2026",
  createBtn: "צור ליגה",
  errorDuplicateName: "השם הזה כבר תפוס — נסה שם אחר",
  errorGeneric: "משהו השתבש, נסה שוב",
  inviteTitle: "הליגה שלך מוכנה!",
  inviteSubtitle: "שתף את הקוד עם החברים",
  codeLabel: "קוד הזמנה",
  btnWhatsapp: "שתף בוואטסאפ",
  btnCopy: "העתק קוד",
  btnCopied: "הועתק!",
  btnStart: "התחל לנחש",
  whatsappMsg: (code: string) =>
    `היי! הצטרף לליגת הניחושים שלי ל-World Cup 2026 🌍⚽ קוד כניסה: ${code}`,
};

export default function CreateLeaguePage(): React.ReactElement {
  const router = useRouter();
  const supabase = createClient();

  const [leagueName, setLeagueName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate(): Promise<void> {
    if (!leagueName.trim()) return;
    setCreating(true);
    setCreateError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setCreating(false); return; }

    const code = generateInviteCode();

    const { data: league, error } = await supabase
      .from("leagues")
      .insert({ name: leagueName.trim(), invite_code: code, created_by: user.id })
      .select("id")
      .single();

    if (error || !league) {
      // Postgres unique violation code is "23505"
      const isDuplicate = error?.code === "23505";
      setCreateError(isDuplicate ? COPY.errorDuplicateName : COPY.errorGeneric);
      setCreating(false);
      return;
    }

    await supabase
      .from("league_members")
      .insert({ league_id: league.id, user_id: user.id });

    setInviteCode(code);
    setCreating(false);
  }

  async function handleCopy(): Promise<void> {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsapp(): void {
    if (!inviteCode) return;
    const msg = encodeURIComponent(COPY.whatsappMsg(inviteCode));
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  }

  if (inviteCode) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center px-4 pb-8" dir="rtl">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-[22px] font-bold text-[#111827]">
              {COPY.inviteTitle}
            </h1>
            <p className="text-[15px] text-[#6B7280] mt-1">
              {COPY.inviteSubtitle}
            </p>
          </div>

          {/* Code display */}
          <div className="w-full bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col items-center gap-2">
            <p className="text-[13px] text-[#9CA3AF]">{COPY.codeLabel}</p>
            <p className="text-[40px] font-bold text-[#0D9488] tracking-[0.2em] font-mono">
              {inviteCode}
            </p>
          </div>

          {/* Share buttons */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleWhatsapp}
              className="w-full h-12 rounded-xl bg-[#25D366] text-white text-[15px] font-medium flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
            >
              <WhatsappIcon />
              {COPY.btnWhatsapp}
            </button>

            <button
              onClick={handleCopy}
              className="w-full h-12 rounded-xl bg-[#F3F4F6] text-[#111827] text-[15px] font-medium active:opacity-80 transition-opacity"
            >
              {copied ? COPY.btnCopied : COPY.btnCopy}
            </button>
          </div>

          {/* Start button */}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full h-12 rounded-xl bg-[#0D9488] text-white text-[15px] font-medium active:opacity-80 transition-opacity"
          >
            {COPY.btnStart}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col px-4 pt-12 pb-8" dir="rtl">
      <button
        onClick={() => router.back()}
        aria-label="חזור"
        className="self-end text-[#0D9488] text-[17px] font-medium mb-4 min-h-[44px] flex items-center"
      >
        →
      </button>
      <h1 className="text-[22px] font-bold text-[#111827] text-right mb-8">
        {COPY.pageTitle}
      </h1>

      <div className="flex flex-col gap-2 mb-8">
        <label className="text-[13px] font-medium text-[#6B7280] text-right">
          {COPY.leagueNameLabel}
        </label>
        <input
          type="text"
          value={leagueName}
          onChange={(e) => { setLeagueName(e.target.value); setCreateError(null); }}
          placeholder={COPY.leagueNamePlaceholder}
          aria-describedby={createError ? "league-name-error" : undefined}
          className={`h-12 rounded-xl border px-4 text-right text-[15px] bg-white outline-none transition-colors ${
            createError ? "border-[#DC2626] focus:border-[#DC2626]" : "border-[#E5E7EB] focus:border-[#0D9488]"
          }`}
        />
        {createError && (
          <p id="league-name-error" className="text-[13px] text-[#DC2626] text-right">
            {createError}
          </p>
        )}
      </div>

      <button
        onClick={handleCreate}
        disabled={!leagueName.trim() || creating}
        className="w-full h-12 rounded-xl bg-[#0D9488] text-white text-[15px] font-medium disabled:opacity-40 active:opacity-80 transition-opacity flex items-center justify-center"
      >
        {creating ? (
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : COPY.createBtn}
      </button>
    </main>
  );
}

function WhatsappIcon(): React.ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 1.5C5.3 1.5 1.5 5.3 1.5 10c0 1.5.4 2.9 1.1 4.2L1.5 18.5l4.4-1.1c1.2.7 2.6 1.1 4.1 1.1 4.7 0 8.5-3.8 8.5-8.5S14.7 1.5 10 1.5z"
        stroke="white"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M7.5 6.5c-.2-.5-.4-.5-.6-.5-.2 0-.3 0-.5.1-.2 0-.5.2-.7.5-.2.3-.8 1-.8 2.4s.9 2.8 1 3c.1.1 1.6 2.6 4 3.5 1.9.7 2.3.6 2.7.5.4 0 1.3-.5 1.5-1s.2-1 .1-1c-.1-.1-.3-.2-.6-.3-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.2-.2.3-.6.8-.8.9-.1.1-.3.1-.6 0-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.5-1.9-.1-.3 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4 0-.1-.4-1.1-.6-1.8z"
        fill="white"
      />
    </svg>
  );
}
