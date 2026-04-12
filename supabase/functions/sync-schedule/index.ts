import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Sync the full WC 2026 match schedule from API-Football.
// Upserts only static match metadata (teams, kickoff time, stage).
// Status and scores are managed exclusively by poll-results.
// Schedule: every 60 minutes via Supabase cron.
// Run manually once after deploy to populate all 104 matches.
//
// TODO: Requires API_FOOTBALL_KEY secret set in Supabase dashboard.
// Endpoint: GET https://v3.football.api-sports.io/fixtures?season=2026&league=1
// NOTE: Confirm WC 2026 league ID before launch — league=1 is UEFA Champions League.
//       The correct FIFA World Cup league ID must be verified against the API-Football docs.

interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string };
  };
  teams: {
    home: { name: string; code: string };
    away: { name: string; code: string };
  };
  league: {
    round: string;
  };
}

function roundToStage(round: string): string {
  const r = round.toLowerCase();
  if (r.includes("group")) return "group";
  if (r.includes("round of 32")) return "r32";
  if (r.includes("round of 16")) return "r16";
  if (r.includes("quarter")) return "qf";
  if (r.includes("semi")) return "sf";
  if (r.includes("final")) return "final";
  // Log unmapped rounds so they are visible rather than silently miscategorised
  console.warn(`Unknown round name, defaulting to "group": ${round}`);
  return "group";
}

// ISO 3166-1 alpha-2 codes are not always returned by API-Football.
// This maps team names to codes for flag display.
// TODO: Expand this map with the full WC 2026 participant list.
const TEAM_CODE_MAP: Record<string, string> = {
  "USA": "us",
  "Mexico": "mx",
  "Canada": "ca",
  "Brazil": "br",
  "Argentina": "ar",
  "France": "fr",
  "England": "gb-eng",
  "Germany": "de",
  "Spain": "es",
  "Portugal": "pt",
  "Netherlands": "nl",
  "Italy": "it",
  "Belgium": "be",
  "Croatia": "hr",
  "Morocco": "ma",
  "Senegal": "sn",
  "Japan": "jp",
  "South Korea": "kr",
  "Australia": "au",
  "Saudi Arabia": "sa",
  "Iran": "ir",
  "Uruguay": "uy",
  "Colombia": "co",
  "Ecuador": "ec",
  "Chile": "cl",
  "Peru": "pe",
  "Nigeria": "ng",
  "Cameroon": "cm",
  "Ghana": "gh",
  "Tunisia": "tn",
  "Egypt": "eg",
  "Algeria": "dz",
  "Serbia": "rs",
  "Switzerland": "ch",
  "Denmark": "dk",
  "Poland": "pl",
  "Ukraine": "ua",
  "Turkey": "tr",
  "Austria": "at",
  "Hungary": "hu",
  "Czech Republic": "cz",
  "Romania": "ro",
  "Slovakia": "sk",
  "Qatar": "qa",
  "New Zealand": "nz",
  "Israel": "il",
};

Deno.serve(async (req): Promise<Response> => {
  const authHeader = req.headers.get("Authorization");
  const expectedAuth = `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`;
  if (authHeader !== expectedAuth) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const apiKey = Deno.env.get("API_FOOTBALL_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API_FOOTBALL_KEY not configured" }),
      { status: 500 }
    );
  }

  const url = "https://v3.football.api-sports.io/fixtures?season=2026&league=1";
  let res: globalThis.Response;
  try {
    res = await fetch(url, {
      headers: { "x-apisports-key": apiKey },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Network error fetching API-Football: ${String(err)}` }),
      { status: 500 }
    );
  }

  if (!res.ok) {
    return new Response(
      JSON.stringify({ error: `API-Football error: ${res.status}` }),
      { status: 500 }
    );
  }

  const json = await res.json();
  const fixtures: ApiFixture[] = json.response ?? [];

  if (fixtures.length === 0) {
    return new Response(JSON.stringify({ upserted: 0 }), { status: 200 });
  }

  // Only upsert static schedule metadata — never include status or scores here.
  // Status and scores are owned by poll-results to prevent this hourly sync
  // from reverting live/finished matches back to "scheduled".
  const rows = fixtures.map((f) => ({
    api_football_id: f.fixture.id,
    team_a: f.teams.home.name,
    team_b: f.teams.away.name,
    team_a_code: TEAM_CODE_MAP[f.teams.home.name] ?? f.teams.home.code?.toLowerCase() ?? "un",
    team_b_code: TEAM_CODE_MAP[f.teams.away.name] ?? f.teams.away.code?.toLowerCase() ?? "un",
    kickoff_at: f.fixture.date,
    stage: roundToStage(f.league.round),
  }));

  const { error, count } = await supabase
    .from("matches")
    .upsert(rows, { onConflict: "api_football_id", count: "exact" });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ upserted: count }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
