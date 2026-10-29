import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
// import { Analytics } from "./components/analytics";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Volkan Bozkurt | Software Engineer & Product Designer",
    template: "%s | Volkan Bozkurt",
  },
  description:
    "The official portfolio of Volkan Bozkurt, a software engineer and product designer. Explore projects, experience, and professional work.",
  applicationName: "Volkan Bozkurt",
  authors: [{ name: "Volkan Bozkurt", url: "https://volkan0x.pro" }],
  creator: "Volkan Bozkurt",
  keywords: [
    "Volkan Bozkurt",
    "volkan0x",
    "software engineer",
    "product designer",
    "portfolio",
  ],
  metadataBase: new URL("https://volkan0x.pro"),
  openGraph: {
    title: "Volkan Bozkurt | Software Engineer & Product Designer",
    description:
      "The official portfolio of Volkan Bozkurt, a software engineer and product designer. Explore projects, experience, and professional work.",
    url: "https://volkan0x.pro",
    siteName: "Volkan Bozkurt",
    images: [
      {
        url: "/og.png",
        width: 1362,
        height: 482,
        alt: "Volkan Bozkurt portfolio",
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
    title: "Volkan Bozkurt | Software Engineer & Product Designer",
    description:
      "The official portfolio of Volkan Bozkurt, a software engineer and product designer.",
    images: ["/og.png"],
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
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://volkan0x.pro/#person",
                  name: "Volkan Bozkurt",
                  alternateName: "volkan0x",
                  url: "https://volkan0x.pro/",
                  jobTitle: "Software Engineer and Product Designer",
                  sameAs: ["https://github.com/volkan0x"],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://volkan0x.pro/#website",
                  name: "Volkan Bozkurt",
                  url: "https://volkan0x.pro/",
                  description:
                    "The official portfolio of Volkan Bozkurt, a software engineer and product designer.",
                  publisher: { "@id": "https://volkan0x.pro/#person" },
                },
              ],
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
