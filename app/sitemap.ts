import type { MetadataRoute } from "next";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {

  const baseUrl =
    "https://www.searcheezy.com";

  let jobs = [];

  try {
    const res = await fetch(
      `${baseUrl}/api/jobs`,
      {
        cache:
          "no-store",
      }
    );

    jobs =
      await res.json();
  } catch (error) {
    console.error(
      "Failed to fetch jobs for sitemap",
      error
    );
  }

  const jobUrls =
    jobs.map(
      (job: any) => ({
        url:
          `${baseUrl}/jobs/${job.id}`,

        lastModified:
          new Date(),

        changeFrequency:
          "daily" as const,

        priority: 0.9,
      })
    );

  return [
    {
      url: baseUrl,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority: 1,
    },

    {
      url:
        `${baseUrl}/login`,

      lastModified:
        new Date(),

      changeFrequency:
        "monthly",

      priority: 0.5,
    },

    {
      url:
        `${baseUrl}/signup`,

      lastModified:
        new Date(),

      changeFrequency:
        "monthly",

      priority: 0.5,
    },

    {
      url:
        `${baseUrl}/applicant-login`,

      lastModified:
        new Date(),

      changeFrequency:
        "monthly",

      priority: 0.5,
    },

    {
      url:
        `${baseUrl}/applicant-signup`,

      lastModified:
        new Date(),

      changeFrequency:
        "monthly",

      priority: 0.5,
    },

    ...jobUrls,
  ];
}