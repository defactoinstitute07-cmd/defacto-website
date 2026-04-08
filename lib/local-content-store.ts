import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultSiteContent, type SiteContent } from "./site-content";

const localStorePath = path.join(process.cwd(), "data", "site-content.json");

type LocalPayload = {
  content: SiteContent;
};

async function ensureLocalStoreExists() {
  try {
    await fs.access(localStorePath);
  } catch {
    await fs.mkdir(path.dirname(localStorePath), { recursive: true });
    const initialPayload: LocalPayload = { content: defaultSiteContent };
    await fs.writeFile(localStorePath, JSON.stringify(initialPayload, null, 2), "utf-8");
  }
}

export async function getLocalSiteContent(): Promise<SiteContent> {
  await ensureLocalStoreExists();

  try {
    const raw = await fs.readFile(localStorePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<LocalPayload>;
    if (!parsed.content || typeof parsed.content !== "object") {
      return defaultSiteContent;
    }

    return { ...defaultSiteContent, ...parsed.content };
  } catch {
    return defaultSiteContent;
  }
}

export async function saveLocalSiteContent(
  partialContent: Partial<Record<keyof SiteContent, string>>,
): Promise<SiteContent> {
  const current = await getLocalSiteContent();
  const next: SiteContent = {
    ...current,
    ...partialContent,
  };

  const payload: LocalPayload = { content: next };
  await fs.writeFile(localStorePath, JSON.stringify(payload, null, 2), "utf-8");

  return next;
}
