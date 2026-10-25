import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
// import { Analytics } from "./components/analytics";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Volkan Bozkurt | volkan0x.pro",
    template: "%s | Volkan Bozkurt",
  },
  description:
    "Volkan Bozkurt - software engineer and product designer. Portfolio, projects and experience.",
  applicationName: "Volkan Bozkurt",
  authors: [{ name: "Volkan Bozkurt", url: "https://volkan0x.pro" }],
  creator: "Volkan Bozkurt",
  keywords: ["Volkan Bozkurt", "volkan0x", "volkan0x.pro", "portfolio", "software engineer"],
  alternates: { canonical: "/" },
  metadataBase: new URL("https://volkan0x.pro"),
  openGraph: {
    title: "Volkan Bozkurt",
    description:
      "Volkan Bozkurt - software engineer and product designer. Portfolio, projects and experience.",
    url: "https://volkan0x.pro",
    siteName: "Volkan Bozkurt",
    images: [
      {
        url: "",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
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
  twitter: {
    title: "Volkan Bozkurt",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/favicon.png",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Volkan Bozkurt",
              alternateName: "volkan0x",
              url: "https://volkan0x.pro",
              jobTitle: "Software Engineer",
            }),
          }}
        />
      </head>
      <body
        className={`bg-black ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
