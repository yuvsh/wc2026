"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Neighbourhood {
  id: string;
  name: string;
  display_order: number;
}

const COPY = {
  title: "באיזו שכונה אתה גר?",
  subtitle: "תוכל לשנות זאת בפרופיל עד תחילת הטורניר",
  btnContinue: "המשך",
  btnSkip: "דלג, אבחר מאוחר יותר",
};

export default function NeighbourhoodPage(): React.ReactElement {
  const router = useRouter();
  const supabase = createClient();

  const [neighbourhoods, setNeighbourhoods] = useState<Neighbourhood[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("neighbourhoods")
      .select("*")
      .order("display_order")
      .then(({ data }) => {
        if (data) setNeighbourhoods(data);
        setLoading(false);
      });
  }, [supabase]);

  async function handleContinue(): Promise<void> {
    if (!selectedId) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("users")
        .update({ neighbourhood_id: selectedId })
        .eq("id", user.id);
    }

    router.push("/onboarding/league");
  }

  function handleSkip(): void {
    router.push("/onboarding/league");
  }

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
          {COPY.title}
        </h1>
        <p className="text-[15px] text-[#6B7280] mt-1">{COPY.subtitle}</p>
      </div>

      {/* Neighbourhood grid */}
      <div className="grid grid-cols-2 gap-3 mb-8 flex-1">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#0D9488] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : null}
        {neighbourhoods.map((hood) => {
          const isSelected = selectedId === hood.id;
          return (
            <button
              key={hood.id}
              onClick={() => setSelectedId(hood.id)}
              className={`relative rounded-xl p-4 text-right border transition-all ${
                isSelected
                  ? "bg-[#F0FDFA] border-[#0D9488]"
                  : "bg-white border-[#E5E7EB]"
              }`}
            >
              <span
                className={`text-[17px] font-medium ${
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
        <button
          onClick={handleContinue}
          disabled={!selectedId || saving}
          className="w-full h-12 rounded-xl bg-[#0D9488] text-white text-[15px] font-medium disabled:opacity-40 transition-opacity active:opacity-80 flex items-center justify-center"
        >
          {saving ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : COPY.btnContinue}
        </button>
        <button
          onClick={handleSkip}
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
