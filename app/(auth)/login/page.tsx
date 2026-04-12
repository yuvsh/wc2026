"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const COPY = {
  appName: "Mundial",
  tagline: "נחש · תחרה · תנצח",
  btnGoogle: "המשך עם Google",
  terms: "בהתחברות אתה מסכים ל",
  termsLink: "תנאי השימוש",
  and: " ו",
  privacyLink: "מדיניות הפרטיות",
};

export default function LoginPage(): React.ReactElement {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle(): Promise<void> {
    setLoading(true);
    // setTimeout yields to the browser so it paints the spinner
    // before the OAuth redirect begins (microtasks alone don't guarantee a paint)
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Top teal accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#0D9488]" />

      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center">
            <FootballIcon />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-[26px] font-bold text-[#111827] leading-none">
              {COPY.appName}
            </h1>
            <p className="text-[15px] text-[#6B7280]">{COPY.tagline}</p>
          </div>
        </div>

        {/* Auth buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            aria-label={COPY.btnGoogle}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-[#D1D5DB] bg-white text-[#111827] text-[15px] font-medium active:opacity-80 transition-opacity disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#D1D5DB] border-t-[#111827] rounded-full animate-spin" />
            ) : (
              <>
                <GoogleIcon />
                {COPY.btnGoogle}
              </>
            )}
          </button>

        </div>

        {/* Terms */}
        <p className="text-[13px] text-[#9CA3AF] text-center leading-relaxed">
          {COPY.terms}
          <a href="/terms" className="font-medium text-[#6B7280] underline">
            {COPY.termsLink}
          </a>
          {COPY.and}
          <a href="/privacy" className="font-medium text-[#6B7280] underline">
            {COPY.privacyLink}
          </a>
        </p>
      </div>
    </main>
  );
}

function FootballIcon(): React.ReactElement {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" stroke="white" strokeWidth="1.5" />
      <polygon points="16,6 19,11 24,11 20.5,14.5 22,19.5 16,16.5 10,19.5 11.5,14.5 8,11 13,11" stroke="white" strokeWidth="1.2" fill="none" />
      <line x1="16" y1="3" x2="16" y2="6" stroke="white" strokeWidth="1.5" />
      <line x1="16" y1="26" x2="16" y2="29" stroke="white" strokeWidth="1.5" />
      <line x1="3" y1="16" x2="6" y2="16" stroke="white" strokeWidth="1.5" />
      <line x1="26" y1="16" x2="29" y2="16" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

function GoogleIcon(): React.ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.75 3-4.33 3-7.31z" fill="#4285F4" />
      <path d="M10 20c2.7 0 4.97-.9 6.62-2.43l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.1H1.07v2.6A10 10 0 0010 20z" fill="#34A853" />
      <path d="M4.41 11.92A6.02 6.02 0 014.1 10c0-.67.11-1.32.31-1.92V5.48H1.07A10 10 0 000 10c0 1.61.38 3.13 1.07 4.48l3.34-2.56z" fill="#FBBC05" />
      <path d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86A9.96 9.96 0 0010 0 10 10 0 001.07 5.48l3.34 2.6C5.2 5.73 7.4 3.98 10 3.98z" fill="#EA4335" />
    </svg>
  );
}

