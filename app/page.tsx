export const dynamic =
  "force-dynamic";

import HomeClient from "./components/HomeClient";

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