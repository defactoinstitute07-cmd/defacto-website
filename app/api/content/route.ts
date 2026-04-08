import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, ValidationError } from "../../../lib/api-errors";
import { requireAdminUser } from "../../../lib/auth-session";
import { saveLocalSiteContent } from "../../../lib/local-content-store";
import { assertTrustedOrigin } from "../../../lib/security";
import { defaultSiteContent, getPublicSiteContent } from "../../../lib/site-content";
import {
  createSupabaseServiceClient,
  isSupabaseConfigured,
} from "../../../lib/supabase/server";
import { parseJsonObject, readManagedImageUrl } from "../../../lib/validation";

export async function GET() {
  try {
    const content = await getPublicSiteContent();
    return NextResponse.json({ content });
  } catch (error) {
    return handleRouteError(error, "Failed to load website content.");
  }
}

export async function PUT(request: NextRequest) {
  try {
    assertTrustedOrigin(request);
    const user = await requireAdminUser(request);
    const body = await parseJsonObject(request);
    const rawContent = body.content;

    if (!rawContent || typeof rawContent !== "object" || Array.isArray(rawContent)) {
      throw new ValidationError("Missing content payload.");
    }

    const partialContent: Partial<Record<keyof typeof defaultSiteContent, string>> = {};

    for (const key of Object.keys(defaultSiteContent) as Array<keyof typeof defaultSiteContent>) {
      if (key in rawContent) {
        partialContent[key] = readManagedImageUrl(
          (rawContent as Record<string, unknown>)[key],
          key,
          true,
        );
      }
    }

    if (!Object.keys(partialContent).length) {
      throw new ValidationError("No valid content fields provided.");
    }

    if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await saveLocalSiteContent(partialContent);
      revalidatePath("/");
      return NextResponse.json({ ok: true, storage: "local" });
    }

    const rows = Object.entries(partialContent).map(([key, value]) => ({
      key,
      value,
      updated_by: user.id,
    }));

    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });

    if (error) {
      const lowerMessage = error.message.toLowerCase();
      if (lowerMessage.includes("site_content") || error.code === "42P01") {
        await saveLocalSiteContent(partialContent);
        revalidatePath("/");
        return NextResponse.json({ ok: true, storage: "local" });
      }

      throw new Error(`Failed to update content: ${error.message}`);
    }

    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError(error, "Failed to update website content.");
  }
}
