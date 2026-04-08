import {
  createSupabasePublicClient,
  isSupabaseConfigured,
} from "./supabase/server";
import { getLocalSiteContent } from "./local-content-store";

export type SiteContent = {
  heroImageUrl: string;
  aboutImageUrl: string;
  ownerImageUrl: string;
};

export const defaultSiteContent: SiteContent = {
  heroImageUrl:
    "https://images.jdmagicbox.com/v2/comp/dehradun/b3/9999px135.x135.220811215051.g5b3/catalogue/de-facto-institute-bhaniawala-dehradun-tutorials-w5p2phvls7.jpg",
  aboutImageUrl:
    "https://images.jdmagicbox.com/v2/comp/dehradun/b3/9999px135.x135.220811215051.g5b3/catalogue/de-facto-institute-bhaniawala-dehradun-tutorials-w5p2phvls7.jpg",
  ownerImageUrl: "",
};

type SiteContentRow = {
  key: string;
  value: string;
};

export async function getPublicSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) {
    return getLocalSiteContent();
  }

  try {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .in("key", Object.keys(defaultSiteContent));

    if (error || !data) {
      return getLocalSiteContent();
    }

    const content = { ...defaultSiteContent };

    for (const row of data as SiteContentRow[]) {
      if (row.key in content && typeof row.value === "string") {
        content[row.key as keyof SiteContent] = row.value;
      }
    }

    return content;
  } catch {
    return getLocalSiteContent();
  }
}
