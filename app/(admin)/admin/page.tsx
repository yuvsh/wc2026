import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminScoreManager from "@/components/AdminScoreManager";

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

export default async function AdminPage(): Promise<React.ReactElement> {
  // Auth guard — must be logged in as the admin email
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  // Fetch all matches using service-role client (bypasses RLS)
  const adminClient = createAdminClient();
  const { data: matches, error: matchesError } = await adminClient
    .from("matches")
    .select("id, team_a, team_b, team_a_code, team_b_code, kickoff_at, stage, status, score_a, score_b, prev_score_a, prev_score_b")
    .order("kickoff_at", { ascending: false });

  if (matchesError) {
    return (
      <div className="text-red-600 font-mono text-sm">
        Failed to load matches: {matchesError.message}
      </div>
    );
  }

  return (
    <AdminScoreManager matches={(matches ?? []) as AdminMatch[]} />
  );
}
