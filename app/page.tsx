export const dynamic =
  "force-dynamic";

import type { Metadata } from "next";

import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title:
    "SearchEezy | Healthcare, Tech & Remote Jobs Hiring Platform",

  description:
    "SearchEezy is a modern hiring platform connecting employers with top talent across healthcare, software engineering, remote work, staffing, allied health, and technology careers.",

  keywords: [
    "jobs",
    "job board",
    "hiring platform",
    "careers",
    "employment",
    "remote jobs",
    "software jobs",
    "software engineer jobs",
    "healthcare jobs",
    "travel healthcare jobs",
    "staffing jobs",
    "allied health jobs",
    "tech jobs",
    "remote hiring",
    "healthcare staffing",
    "SearchEezy",
    "job portal",
    "recruitment platform",
  ],

  metadataBase: new URL(
    "https://www.searcheezy.com"
  ),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "SearchEezy | Healthcare, Tech & Remote Jobs",

    description:
      "Find healthcare, software engineering, remote, staffing, and technology jobs while employers hire top talent through SearchEezy.",

    url:
      "https://www.searcheezy.com",

    siteName:
      "SearchEezy",

    type: "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "SearchEezy | Modern Hiring Platform",

    description:
      "Search healthcare, software engineering, remote, and staffing jobs with SearchEezy.",
  },
};

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`,
    {
      cache: "no-store",
    }
  );

  const jobs =
    await res.json();

  return (
    <HomeClient jobs={jobs} />
  );
}
