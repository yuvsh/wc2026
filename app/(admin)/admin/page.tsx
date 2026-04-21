import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminPanel from "@/components/AdminPanel";

const GLOBAL_LEAGUE_ID = "00000000-0000-0000-0000-000000000001";

export interface AdminMatch {
  id: string;
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  kickoff_at: string;
  stage: string;
  status: string;
  score_a: number | null;
  score_b: number | null;
  prev_score_a: number | null;
  prev_score_b: number | null;
}

export interface AdminLeague {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
  member_count: number;
}

export interface AdminUser {
  id: string;
  display_name: string;
  provider: string;
  email: string | null;
  created_at: string;
}

export default async function AdminPage(): Promise<React.ReactElement> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  const adminClient = createAdminClient();

  const [matchesResult, leaguesResult, memberCountsResult, publicUsersResult, authUsersResult] =
    await Promise.all([
      adminClient
        .from("matches")
        .select("id, team_a, team_b, team_a_code, team_b_code, kickoff_at, stage, status, score_a, score_b, prev_score_a, prev_score_b")
        .order("kickoff_at", { ascending: false }),
      adminClient
        .from("leagues")
        .select("id, name, invite_code, created_at")
        .neq("id", GLOBAL_LEAGUE_ID)
        .order("created_at", { ascending: false }),
      adminClient
        .from("league_members")
        .select("league_id")
        .neq("league_id", GLOBAL_LEAGUE_ID),
      adminClient
        .from("users")
        .select("id, display_name, provider, created_at")
        .order("created_at", { ascending: false }),
      adminClient.auth.admin.listUsers({ perPage: 1000 }),
    ]);

  if (matchesResult.error) {
    return (
      <div className="text-red-600 font-mono text-sm">
        Failed to load matches: {matchesResult.error.message}
      </div>
    );
  }

  // Build member count map
  const memberCountMap: Record<string, number> = {};
  for (const row of memberCountsResult.data ?? []) {
    memberCountMap[row.league_id] = (memberCountMap[row.league_id] ?? 0) + 1;
  }

  // Build email map from auth users
  const emailMap: Record<string, string> = {};
  for (const u of authUsersResult.data?.users ?? []) {
    if (u.email) emailMap[u.id] = u.email;
  }

  const leagues: AdminLeague[] = (leaguesResult.data ?? []).map((l) => ({
    id: l.id as string,
    name: l.name as string,
    invite_code: l.invite_code as string,
    created_at: l.created_at as string,
    member_count: memberCountMap[l.id as string] ?? 0,
  }));

  const users: AdminUser[] = (publicUsersResult.data ?? []).map((u) => ({
    id: u.id as string,
    display_name: u.display_name as string,
    provider: u.provider as string,
    email: emailMap[u.id as string] ?? null,
    created_at: u.created_at as string,
  }));

  return (
    <AdminPanel
      matches={(matchesResult.data ?? []) as AdminMatch[]}
      leagues={leagues}
      users={users}
    />
  );
}
