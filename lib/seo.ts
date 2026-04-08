import type { Metadata } from "next";

export const siteConfig = {
  name: "Defacto Institute",
  shortName: "Defacto Institute",
  description:
    "Defacto Institute in Bhaniawala offers foundation courses, board exam preparation, competitive exam mentoring, and student-focused academic support.",
  url:
    (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",
  themeColor: "#020617",
  phone: "+91 81919 30475",
  email: "defactoinstitute07@gmail.com",
  address: {
    streetAddress: "De Facto Institute Rd, Bhania Wala",
    addressLocality: "Dehradun",
    addressRegion: "Uttarakhand",
    postalCode: "248140",
    addressCountry: "IN",
  },
} as const;

const defaultKeywords = [
  "Defacto Institute",
  "Defacto Institute Bhaniawala",
  "coaching institute in Dehradun",
  "tuition classes in Bhaniawala",
  "CBSE coaching",
  "ICSE coaching",
  "JEE preparation",
  "NEET preparation",
  "foundation classes",
  "board exam coaching",
];

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${siteConfig.url}/`).toString();
}

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = "/icon.svg",
  type = "website",
}: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    areaServed: "Dehradun, Uttarakhand",
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en-IN",
  };
}
