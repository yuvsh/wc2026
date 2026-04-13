import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/tournament"];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Allow public paths through without auth check
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return response;
  }

  // Check auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in — redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in and hitting root — redirect based on neighbourhood
  if (pathname === "/") {
    const { data: profile } = await supabase
      .from("users")
      .select("neighbourhood_id")
      .eq("id", user.id)
      .single();

    if (!profile?.neighbourhood_id) {
      return NextResponse.redirect(new URL("/onboarding/neighbourhood", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
