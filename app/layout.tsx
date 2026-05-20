import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import GoogleAnalytics from "./components/GoogleAnalytics";

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: [
      "latin",
    ],
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin",
    ],
  });

export const metadata: Metadata =
  {
    metadataBase:
      new URL(
        "https://www.searcheezy.com"
      ),

    title: {
      default:
        "SearchEezy - Modern Hiring Platform",

      template:
        "%s | SearchEezy",
    },

    description:
      "SearchEezy is a modern job board and hiring platform helping employers connect with top talent and helping applicants discover meaningful careers.",

    keywords: [
      "jobs",
      "job board",
      "hiring",
      "careers",
      "employment",
      "tech jobs",
      "remote jobs",
      "SearchEezy",
      "job portal",
      "recruitment",
    ],

    authors: [
      {
        name:
          "SearchEezy",
      },
    ],

    creator:
      "SearchEezy",

    publisher:
      "SearchEezy",

    robots: {
      index: true,

      follow: true,

      googleBot: {
        index: true,

        follow: true,

        "max-video-preview":
          -1,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,
      },
    },

    openGraph: {
      type: "website",

      locale:
        "en_US",

      url:
        "https://www.searcheezy.com",

      siteName:
        "SearchEezy",

      title:
        "SearchEezy - Modern Hiring Platform",

      description:
        "Find jobs, hire talent, and grow careers with SearchEezy.",
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        "SearchEezy - Modern Hiring Platform",

      description:
        "Find jobs and hire talent with SearchEezy.",
    },

    alternates: {
      canonical:
        "https://www.searcheezy.com",
    },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />

        {children}
      </body>
    </html>
  );
}