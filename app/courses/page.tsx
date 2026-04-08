import type { Metadata } from "next";
import CoursesSection from "../../components/CoursesSection";
import { buildMetadata } from "../../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Courses | Foundation, Board & Competitive Exam Preparation",
  description:
    "Explore Defacto Institute courses for CBSE, ICSE, science streams, board exams, and competitive exam preparation.",
  path: "/courses",
  keywords: ["Defacto Institute courses", "CBSE courses", "ICSE courses", "science coaching"],
});

export default function CoursesPage() {
  return <CoursesSection headingAs="h1" />;
}
