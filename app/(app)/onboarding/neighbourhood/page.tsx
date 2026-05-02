"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Neighbourhood {
  id: string;
  name: string;
  display_order: number;
  icon_url: string | null;
}

const COPY = {
  // onboarding mode
  titleOnboarding: "באיזו שכונה אתה גר?",
  subtitleOnboarding: "תוכל לשנות זאת בפרופיל עד תחילת הטורניר",
  btnContinue: "המשך",
  btnSkip: "דלג — אבחר אחר כך",
  // profile/edit mode
  titleEdit: "שנה שכונה",
  btnSave: "שמור",
  btnBack: "ביטול",
  // shared
  errorLoad: "שגיאה בטעינת השכונות",
  errorSave: "משהו השתבש, נסה שוב",
  btnRetry: "נסה שוב",
};

// Only allow redirects to known internal paths to prevent open redirect attacks
const ALLOWED_REDIRECTS = ["/profile", "/onboarding/league"] as const;
type AllowedRedirect = (typeof ALLOWED_REDIRECTS)[number];

function isSafeRedirect(value: string | null): value is AllowedRedirect {
  return ALLOWED_REDIRECTS.includes(value as AllowedRedirect);
}

export default function NeighbourhoodPage(): React.ReactElement {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NeighbourhoodPageContent />
    </Suspense>
  );
}

function NeighbourhoodPageContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect");
  const redirectTo: AllowedRedirect = isSafeRedirect(rawRedirect) ? rawRedirect : "/onboarding/league";
  const isEditMode = redirectTo === "/profile";

  const supabase = useMemo(() => createClient(), []);

  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);

  function fetchData(): void {
    setLoading(true);
    setLoadError(false);

    Promise.all([
      supabase.from("neighbourhoods").select("*").order("display_order"),
      supabase.auth.getUser(),
    ]).then(async ([hoodsResult, authResult]) => {
      if (hoodsResult.error) {
        setLoadError(true);
        setLoading(false);
        return;
      }
      if (hoodsResult.data) setNeighbourhoods(hoodsResult.data);

      // Pre-select the user's current neighbourhood if they have one
      const user = authResult.data.user;
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("neighbourhood_id")
          .eq("id", user.id)
          .single();
        if (userData?.neighbourhood_id) {
          setSelectedId(userData.neighbourhood_id);
        }
      }

      setLoading(false);
    });
  }

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  async function handleSave(): Promise<void> {
    if (!selectedId) return;
    setSaving(true);
    setSaveError(false);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setSaveError(true);
        return;
      }
      const { error: updateError } = await supabase
        .from("users")
        .update({ neighbourhood_id: selectedId })
        .eq("id", user.id);

      if (updateError) {
        setSaveError(true);
        return;
      }
      router.push(redirectTo);
    } finally {
      setSaving(false);
    }
  }

  function handleSkipOrBack(): void {
    router.push(redirectTo);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-[15px] text-[#6B7280]">{COPY.errorLoad}</p>
        <button
          onClick={fetchData}
          aria-label="נסה לטעון מחדש"
          className="text-[15px] text-[#0D9488] underline min-h-[44px] px-4 flex items-center"
        >
          {COPY.btnRetry}
        </button>
      </div>
    );
  }

  // ── Edit mode (coming from profile) ───────────────────────────────────────
  if (isEditMode) {
    return (
      <div className="flex-1 flex flex-col">
        {/* App-style header */}
        <div className="bg-white border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleSkipOrBack}
            aria-label="חזור לפרופיל"
            className="text-[15px] text-[#0D9488] min-h-[44px] flex items-center"
          >
            {COPY.btnBack}
          </button>
          <h1 className="text-[17px] font-bold text-[#111827]">{COPY.titleEdit}</h1>
          {/* spacer to center the title */}
          <div className="w-[52px]" />
        </div>

        {/* Grid */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {neighbourhoods.map((hood) => {
              const isSelected = selectedId === hood.id;
              return (
                <button
                  key={hood.id}
                  onClick={() => setSelectedId(hood.id)}
                  aria-label={`בחר שכונה: ${hood.name}`}
                  aria-pressed={isSelected}
                  className={`relative rounded-xl p-4 min-h-[44px] text-right border transition-all flex flex-col items-center justify-center gap-3 ${
                    isSelected
                      ? "bg-[#F0FDFA] border-[#0D9488]"
                      : "bg-white border-[#E5E7EB]"
                  }`}
                >
                  {hood.icon_url && (
                    <Image
                      src={hood.icon_url}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14"
                    />
                  )}
                  <span
                    className={`text-[17px] font-medium text-center leading-snug ${
                      isSelected ? "text-[#0D9488]" : "text-[#111827]"
                    }`}
                  >
                    {hood.name}
                  </span>
                  {isSelected && (
                    <span className="absolute top-3 left-3 text-[#0D9488]">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky save button */}
        <div className="px-4 pb-6 pt-3 bg-white border-t border-[#E5E7EB]">
          {saveError && (
            <p className="text-[14px] text-[#DC2626] text-center mb-3">{COPY.errorSave}</p>
          )}
          <button
            onClick={handleSave}
            disabled={!selectedId || saving}
            className="w-full h-12 rounded-xl bg-[#0D9488] text-white text-[15px] font-medium disabled:opacity-40 transition-opacity active:opacity-80 flex items-center justify-center"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : COPY.btnSave}
          </button>
        </div>
      </div>
    );
  }

  // ── Onboarding mode ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col px-4 pt-12 pb-8">
      {/* Step dots */}
      <div className="flex justify-center gap-2 mb-8">
        <div className="h-2 w-2 rounded-full bg-[#D1D5DB]" />
        <div className="h-2 w-6 rounded-full bg-[#0D9488]" />
        <div className="h-2 w-2 rounded-full bg-[#D1D5DB]" />
      </div>

      {/* Title */}
      <div className="mb-6 text-right">
        <h1 className="text-[22px] font-bold text-[#111827] leading-snug">
          {COPY.titleOnboarding}
        </h1>
        <p className="text-[15px] text-[#6B7280] mt-1">{COPY.subtitleOnboarding}</p>
      </div>

      {/* Neighbourhood grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 flex-1">
        {neighbourhoods.map((hood) => {
          const isSelected = selectedId === hood.id;
          return (
            <button
              key={hood.id}
              onClick={() => setSelectedId(hood.id)}
              aria-label={`בחר שכונה: ${hood.name}`}
              aria-pressed={isSelected}
              className={`relative rounded-xl p-4 min-h-[44px] text-right border transition-all flex flex-col items-center justify-center gap-3 ${
                isSelected
                  ? "bg-[#F0FDFA] border-[#0D9488]"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              {hood.icon_url && (
                <Image
                  src={hood.icon_url}
                  alt=""
                  width={56}
                  height={56}
                  className="h-14 w-14"
                />
              )}
              <span
                className={`text-[17px] font-medium text-center leading-snug ${
                  isSelected ? "text-[#0D9488]" : "text-[#111827]"
                }`}
              >
                {hood.name}
              </span>
              {isSelected && (
                <span className="absolute top-3 left-3 text-[#0D9488]">
                  <CheckIcon />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4">
        {saveError && (
          <p className="text-[14px] text-[#DC2626]">{COPY.errorSave}</p>
        )}
        <button
          onClick={handleSave}
          disabled={!selectedId || saving}
          className="w-full h-12 rounded-xl bg-[#0D9488] text-white text-[15px] font-medium disabled:opacity-40 transition-opacity active:opacity-80 flex items-center justify-center"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : COPY.btnContinue}
        </button>
        <button
          onClick={handleSkipOrBack}
          aria-label="דלג על בחירת שכונה"
          className="text-[15px] text-[#6B7280] underline min-h-[44px] px-4 flex items-center"
        >
          {COPY.btnSkip}
        </button>
      </div>
    </main>
  );
}

function CheckIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
