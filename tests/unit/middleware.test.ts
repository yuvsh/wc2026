/**
 * Unit tests for Task 2 — middleware routing logic.
 *
 * Covers:
 * - Public paths bypass auth checks (login, auth/callback)
 * - Unauthenticated requests are redirected to /login
 * - Authenticated user at / with neighbourhood → /dashboard
 * - Authenticated user at / without neighbourhood → /onboarding/neighbourhood
 * - Authenticated user on non-root protected path passes through
 */

import { NextRequest, NextResponse } from "next/server";

// Mocks are hoisted — set up before the module under test is imported
jest.mock("@/lib/supabase/middleware", () => ({
  updateSession: jest.fn(),
}));
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

import { middleware } from "../../middleware";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const mockUpdateSession = jest.mocked(updateSession);
const mockCreateServerClient = jest.mocked(createServerClient);

function makeRequest(path: string): NextRequest {
  return new NextRequest(`http://localhost:3000${path}`);
}

function makeSupabaseClient(
  user: { id: string } | null,
  neighbourhoodId: string | null = null
): ReturnType<typeof createServerClient> {
  return {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user }, error: null }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest
            .fn()
            .mockResolvedValue({
              data: user ? { neighbourhood_id: neighbourhoodId } : null,
              error: null,
            }),
        }),
      }),
    }),
  } as unknown as ReturnType<typeof createServerClient>;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUpdateSession.mockResolvedValue(NextResponse.next());
});

describe("public paths — bypass auth check", () => {
  it.each([["/login"], ["/login?error=auth_failed"], ["/auth/callback"], ["/auth/callback?code=abc"]])(
    "allows %s through without creating a Supabase client",
    async (path) => {
      const res = await middleware(makeRequest(path));
      expect(mockCreateServerClient).not.toHaveBeenCalled();
      expect(res.status).not.toBe(307);
    }
  );
});

describe("unauthenticated user", () => {
  beforeEach(() => {
    mockCreateServerClient.mockReturnValue(makeSupabaseClient(null));
  });

  it("redirects /dashboard to /login", async () => {
    const res = await middleware(makeRequest("/dashboard"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("redirects / to /login", async () => {
    const res = await middleware(makeRequest("/"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/login");
  });

  it("redirects /profile to /login", async () => {
    const res = await middleware(makeRequest("/profile"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/login");
  });
});

describe("authenticated user — root redirect", () => {
  const testUser = { id: "user-123" };

  it("redirects to /dashboard when neighbourhood is set", async () => {
    mockCreateServerClient.mockReturnValue(
      makeSupabaseClient(testUser, "neighbourhood-abc")
    );

    const res = await middleware(makeRequest("/"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/dashboard"
    );
  });

  it("redirects to /onboarding/neighbourhood when neighbourhood_id is null", async () => {
    mockCreateServerClient.mockReturnValue(makeSupabaseClient(testUser, null));

    const res = await middleware(makeRequest("/"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/onboarding/neighbourhood"
    );
  });
});

describe("authenticated user — non-root protected path", () => {
  const testUser = { id: "user-123" };

  it("passes through /dashboard without redirect", async () => {
    mockCreateServerClient.mockReturnValue(
      makeSupabaseClient(testUser, "neighbourhood-abc")
    );

    const res = await middleware(makeRequest("/dashboard"));
    expect(res.status).not.toBe(307);
  });

  it("passes through /profile without redirect", async () => {
    mockCreateServerClient.mockReturnValue(
      makeSupabaseClient(testUser, "neighbourhood-abc")
    );

    const res = await middleware(makeRequest("/profile"));
    expect(res.status).not.toBe(307);
  });
});

describe("auth callback route", () => {
  it("always passes through /auth/callback without auth check", async () => {
    // Even if the supabase client would return an error, the callback is public
    mockCreateServerClient.mockReturnValue(makeSupabaseClient(null));

    const res = await middleware(makeRequest("/auth/callback?code=abc123"));
    expect(mockCreateServerClient).not.toHaveBeenCalled();
    expect(res.status).not.toBe(307);
  });
});
