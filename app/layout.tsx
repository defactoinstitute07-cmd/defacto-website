import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getOrganizationSchema, getWebsiteSchema, siteConfig } from "../lib/seo";

const globalStructuredData = [getOrganizationSchema(), getWebsiteSchema()];

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Defacto Institute | Coaching Classes in Bhaniawala, Dehradun",
    template: "%s | Defacto Institute",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Defacto Institute",
    "coaching institute in Bhaniawala",
    "Dehradun coaching classes",
    "board exam preparation",
    "foundation classes",
    "JEE coaching",
    "NEET coaching",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: "Defacto Institute | Coaching Classes in Bhaniawala, Dehradun",
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    images: [
      {
        url: `${siteConfig.url}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Defacto Institute | Coaching Classes in Bhaniawala, Dehradun",
    description: siteConfig.description,
    images: [`${siteConfig.url}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="w-full overflow-x-hidden">
      <body className="min-h-screen w-full bg-stone-50 text-slate-900 antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalStructuredData),
          }}
        />
        <div className="flex min-h-screen flex-col w-full">
          <Header />
          <main className="w-full flex-1 mx-auto max-w-full pt-[calc(env(safe-area-inset-top)+72px)] sm:pt-[calc(env(safe-area-inset-top)+78px)] lg:pt-[calc(env(safe-area-inset-top)+84px)] sm:max-w-[1500px]">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
