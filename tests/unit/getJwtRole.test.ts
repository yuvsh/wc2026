/**
 * Unit tests for the getJwtRole() logic used by the run-scoring edge function.
 * Duplicates the pure function from supabase/functions/run-scoring/index.ts.
 * If the function changes, update these tests to match.
 */

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64");
  return `${header}.${body}.fakesignature`;
}

function getJwtRole(authHeader: string | null): string | null {
  try {
    const token = authHeader?.replace("Bearer ", "") ?? "";
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

describe("getJwtRole", () => {
  it("returns 'service_role' for a service_role JWT", () => {
    const token = makeJwt({ role: "service_role", sub: "service" });
    expect(getJwtRole(`Bearer ${token}`)).toBe("service_role");
  });

  it("returns 'anon' for an anon JWT", () => {
    const token = makeJwt({ role: "anon" });
    expect(getJwtRole(`Bearer ${token}`)).toBe("anon");
  });

  it("returns 'authenticated' for a user JWT", () => {
    const token = makeJwt({ role: "authenticated", sub: "user-uuid" });
    expect(getJwtRole(`Bearer ${token}`)).toBe("authenticated");
  });

  it("returns null for a null auth header", () => {
    expect(getJwtRole(null)).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(getJwtRole("")).toBeNull();
  });

  it("returns null for a malformed token (not 3 parts)", () => {
    expect(getJwtRole("Bearer notavalidjwt")).toBeNull();
  });

  it("returns null when payload has no role field", () => {
    const token = makeJwt({ sub: "user-uuid" });
    expect(getJwtRole(`Bearer ${token}`)).toBeNull();
  });

  it("returns null when role is not a string", () => {
    const token = makeJwt({ role: 42 });
    expect(getJwtRole(`Bearer ${token}`)).toBeNull();
  });

  it("strips Bearer prefix correctly", () => {
    const token = makeJwt({ role: "service_role" });
    expect(getJwtRole(`Bearer ${token}`)).toBe("service_role");
  });
});
