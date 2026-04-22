export interface GroupStandingRow {
  id: string;
  group_name: string;
  team_name: string;
  team_code: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  qualified: boolean;
}

export interface KnockoutMatch {
  id: string;
  stage: "r32" | "r16" | "qf" | "sf" | "final";
  team_a: string;
  team_b: string;
  team_a_code: string;
  team_b_code: string;
  score_a: number | null;
  score_b: number | null;
  kickoff_at: string;
  status: "scheduled" | "live" | "finished" | "postponed" | "cancelled";
}
