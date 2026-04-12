import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Poll live match results and update the DB.
// Calls run-scoring for each newly finished match.
// Schedule: every 10 minutes via Supabase cron.
//
// TODO: Replace placeholder API with real provider before launch.
// Recommended: api-football.com (RapidAPI) — set API_FOOTBALL_KEY in Supabase secrets.
// Endpoint: GET https://v3.football.api-sports.io/fixtures?date=YYYY-MM-DD&league=1&season=2026
// Status mapping: FT → finished, PST → postponed, CANC → cancelled, 1H/2H/HT → live

interface ApiFixture {
  fixture: {
    id: number;
    status: { short: string };
    date: string;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
}

const STATUS_MAP: Record<string, string> = {
  FT: "finished",
  AET: "finished", // after extra time
  PEN: "finished", // after penalties
  PST: "postponed",
  CANC: "cancelled",
  "1H": "live",
  "2H": "live",
  HT: "live",
  ET: "live",
};

async function fetchTodayFixtures(): Promise<ApiFixture[]> {
  const apiKey = Deno.env.get("API_FOOTBALL_KEY");

  if (!apiKey) {
    // TODO: Replace this placeholder with a real API call.
    // Return empty array until API key is configured.
    console.warn("API_FOOTBALL_KEY not set — skipping live result polling");
    return [];
  }

  const today = new Date().toISOString().split("T")[0];
  const url = `https://v3.football.api-sports.io/fixtures?date=${today}&league=1&season=2026`;

  const res = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey,
    },
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status}`);
  }

  const json = await res.json();
  return json.response ?? [];
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let fixtures: ApiFixture[];
  try {
    fixtures = await fetchTodayFixtures();
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }

  if (fixtures.length === 0) {
    return new Response(JSON.stringify({ updated: 0 }), { status: 200 });
  }

  let updatedCount = 0;
  const finishedMatchIds: string[] = [];

  for (const fixture of fixtures) {
    const apiId = fixture.fixture.id;
    const apiStatus = fixture.fixture.status.short;
    const dbStatus = STATUS_MAP[apiStatus] ?? null;

    if (!dbStatus) continue;

    // Find our match by api_football_id
    const { data: match } = await supabase
      .from("matches")
      .select("id, status")
      .eq("api_football_id", apiId)
      .maybeSingle();

    if (!match) continue;

    const wasFinished = match.status === "finished";

    if (dbStatus === "finished") {
      const { error } = await supabase
        .from("matches")
        .update({
          status: "finished",
          score_a: fixture.goals.home,
          score_b: fixture.goals.away,
        })
        .eq("id", match.id);

      if (!error) {
        updatedCount++;
        if (!wasFinished) finishedMatchIds.push(match.id);
      }
    } else if (dbStatus === "postponed") {
      await supabase
        .from("matches")
        .update({ status: "postponed", kickoff_at: fixture.fixture.date })
        .eq("id", match.id);
      updatedCount++;
    } else if (dbStatus === "cancelled") {
      await supabase
        .from("matches")
        .update({ status: "cancelled" })
        .eq("id", match.id);
      updatedCount++;
    } else if (dbStatus === "live") {
      await supabase
        .from("matches")
        .update({
          status: "live",
          score_a: fixture.goals.home,
          score_b: fixture.goals.away,
        })
        .eq("id", match.id);
      updatedCount++;
    }
  }

  // Trigger scoring for each newly finished match
  const scoringResults = await Promise.allSettled(
    finishedMatchIds.map((matchId) =>
      fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/run-scoring`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({ match_id: matchId }),
      })
    )
  );

  const scoringErrors = scoringResults.filter((r) => r.status === "rejected").length;

  return new Response(
    JSON.stringify({ updated: updatedCount, scored: finishedMatchIds.length, scoringErrors }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
