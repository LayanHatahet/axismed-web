import { NextRequest, NextResponse } from "next/server";

/** Content APIs: GET is public (the live site reads them); mutations are admin-only. */
const CONTENT_WRITE = [
  "/api/courses", "/api/events", "/api/media", "/api/partners",
  "/api/gallery", "/api/content", "/api/settings",
  "/api/concierge-settings", "/api/upload",
];

/** Lead collections (contain personal data): only POST is public (form/chat submissions);
 *  reading the list and any edit/delete are admin-only. */
const LEAD_COLLECTIONS = ["/api/contact", "/api/registrations", "/api/concierge-leads"];

function isAdmin(req: NextRequest): boolean {
  return Boolean(req.cookies.get("admin_auth")?.value);
}

function underAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  // 1. Admin pages — redirect to login when not authenticated.
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !pathname.startsWith("/api/admin/auth")
  ) {
    if (!isAdmin(req)) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // 2. Admin-only API namespace (seed, etc.) — everything except the auth route.
  if (pathname.startsWith("/api/admin/") && !pathname.startsWith("/api/admin/auth")) {
    if (!isAdmin(req)) return unauthorized();
  }

  // 3. Content write APIs — GET stays public, mutations require admin.
  if (isMutation && underAny(pathname, CONTENT_WRITE)) {
    if (!isAdmin(req)) return unauthorized();
  }

  // 4. Lead collections — POST is public (inbound form/chat); everything else is admin-only.
  if (underAny(pathname, LEAD_COLLECTIONS) && method !== "POST") {
    if (!isAdmin(req)) return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
