import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "../../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Defacto Institute | Admissions & Counselling",
  description:
    "Contact Defacto Institute for admissions, counselling sessions, batch details, and academic guidance in Bhaniawala, Dehradun.",
  path: "/contact",
  keywords: ["contact Defacto Institute", "admission enquiry", "counselling session"],
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
