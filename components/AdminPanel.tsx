"use client";

import { useState } from "react";
import AdminScoreManager from "@/components/AdminScoreManager";
import AdminLeagueManager from "@/components/AdminLeagueManager";
import AdminUserManager from "@/components/AdminUserManager";
import type { AdminMatch, AdminLeague, AdminUser } from "@/app/(admin)/admin/page";

type Tab = "scores" | "leagues" | "users";

interface AdminPanelProps {
  matches: AdminMatch[];
  leagues: AdminLeague[];
  users: AdminUser[];
}

export default function AdminPanel({ matches, leagues, users }: AdminPanelProps): React.ReactElement {
  const [tab, setTab] = useState<Tab>("scores");

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(["scores", "leagues", "users"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "scores" ? "Scores" : t === "leagues" ? `Leagues (${leagues.length})` : `Users (${users.length})`}
          </button>
        ))}
      </div>

      {tab === "scores" && <AdminScoreManager matches={matches} />}
      {tab === "leagues" && <AdminLeagueManager initialLeagues={leagues} />}
      {tab === "users" && <AdminUserManager initialUsers={users} />}
    </div>
  );
}
