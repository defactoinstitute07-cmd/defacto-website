import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "../../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Gallery | Defacto Institute Life & Events",
  description:
    "Explore Defacto Institute's gallery featuring student trips, institute events, social initiatives, and campus life moments.",
  path: "/gallery",
  keywords: ["Defacto Institute gallery", "student trips", "institute events", "campus life"],
});

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return children;
}
