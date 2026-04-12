import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import FloatingActions from "../components/FloatingActions";
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
    "best coaching institute in bhaniyawala",
    "best coaching classes in bhaniyawala",
    "best foundation classes in bhaniyawala",
    "best classes for 8th to 10th in bhaniyawala",
    "best classes for 10th to 12th in bhaniyawala",
    "best classes for 11th to 12th in bhaniyawala",
    "best classes for 9th to 10th in bhaniyawala",
    "best classes for 10th CBSE in bhaniyawala",
    "best classes for 10th ICSE in bhaniyawala",
    "best classes for 10th State Board in bhaniyawala",
    "best classes for 11th CBSE in bhaniyawala",
    "best classes for 11th ICSE in bhaniyawala",
    "best classes for 11th State Board in bhaniyawala",
    "best classes for 12th CBSE in bhaniyawala",
    "best classes for 12th ICSE in bhaniyawala",
    "best classes for 12th State Board in bhaniyawala",
    "best board exam preparation in bhaniyawala",
    "best competitive exam coaching in bhaniyawala",
    "bhaniyawala coaching classes",
    "board exam preparation",
    "foundation classes",
  ],
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>

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
        <FloatingActions />
        <Analytics />
      </body>
    </html>
  );
}
