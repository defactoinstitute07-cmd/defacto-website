import { NextRequest, NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api-errors";
import { requireAdminUser } from "@/lib/auth-session";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const sessionUser = await requireAdminUser(request);
    await connectDB();

    const user = await User.findOne({
      _id: sessionUser.id,
      role: "admin",
      is_active: true,
    })
      .select("two_factor_enabled two_factor_enabled_at +two_factor_pending_secret +two_factor_backup_code_hashes")
      .lean();

    const response = NextResponse.json({
      enabled: Boolean(user?.two_factor_enabled),
      enabledAt: user?.two_factor_enabled_at ?? null,
      hasPendingSetup: Boolean(user?.two_factor_pending_secret),
      recoveryCodesRemaining: user?.two_factor_backup_code_hashes?.length ?? 0,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return handleRouteError(error, "Failed to load two-factor settings.");
  }
}
