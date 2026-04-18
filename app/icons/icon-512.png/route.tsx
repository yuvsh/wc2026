import { type NextRequest, NextResponse } from "next/server";

// Redirect legacy PWA icon path to the static JPEG in public/
export function GET(request: NextRequest): NextResponse {
  return NextResponse.redirect(new URL("/icons/wc26_app_icon.jpeg", request.url), 301);
}
