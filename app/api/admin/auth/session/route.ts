import { NextRequest, NextResponse } from "next/server";
import { handleRouteError } from "@/lib/api-errors";
import { getAdminUserFromRequest } from "@/lib/auth-session";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const [user, adminCount] = await Promise.all([
      getAdminUserFromRequest(request),
      User.countDocuments({ role: "admin" }),
    ]);

    const response = NextResponse.json({
      authenticated: Boolean(user),
      user,
      canRegister: adminCount === 0,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    return handleRouteError(error, "Failed to load admin session.");
  }
}
