export const dynamic =
  "force-dynamic";

import type { Metadata } from "next";

import HomeClient from "./components/HomeClient";

export const metadata: Metadata = {
  title:
    "SearchEezy - Modern Job Board & Hiring Platform",

  description:
    "SearchEezy is a modern hiring platform where employers connect with top talent and applicants discover meaningful career opportunities.",

  keywords: [
    "jobs",
    "job board",
    "hiring platform",
    "careers",
    "employment",
    "remote jobs",
    "software jobs",
    "tech jobs",
    "SearchEezy",
    "job portal",
  ],

  openGraph: {
    title:
      "SearchEezy - Modern Hiring Platform",

    description:
      "Find jobs, hire talent, and grow careers with SearchEezy.",

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
      "SearchEezy - Modern Hiring Platform",

    description:
      "Find jobs and hire talent with SearchEezy.",
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