import { NextRequest } from "next/server";
import { handleRouteError } from "@/lib/api-errors";
import { clearAuthenticatedResponse, revokeAdminSession } from "@/lib/auth-session";
import { assertTrustedOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    await revokeAdminSession(request);
    return clearAuthenticatedResponse();
  } catch (error) {
    return handleRouteError(error, "Failed to sign out.");
  }
}
