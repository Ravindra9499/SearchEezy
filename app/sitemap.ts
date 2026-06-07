import type { MetadataRoute } from "next";

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {

  const baseUrl =
    "https://www.searcheezy.com";

  let jobs: any[] = [];

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

  // JOB URLS

  const jobUrls =
    jobs.map(
      (job: any) => ({
        url:
          `${baseUrl}/jobs/${job.id}`,

        lastModified:
          new Date(
            job.created_at ||
              Date.now()
          ),

        changeFrequency:
          "daily" as const,

        priority: 0.9,
      })
    );

  // COMPANY URLS

  const companySlugs =
    Array.from(
      new Set(
        jobs
          .map(
            (job: any) =>
              job.company
                ?.toLowerCase()
                .replace(
                  /\s+/g,
                  "-"
                )
          )
          .filter(Boolean)
      )
    );

  const companyUrls =
    companySlugs.map(
      (slug: any) => ({
        url:
          `${baseUrl}/company/${slug}`,

        lastModified:
          new Date(),

        changeFrequency:
          "weekly" as const,

        priority: 0.8,
      })
    );

  // CATEGORY URLS

  const categoryUrls = [
    "healthcare",
    "software-engineering",
    "remote",
    "construction",
    "manufacturing",
  ].map(
    (category) => ({
      url:
        `${baseUrl}/categories/${category}`,

      lastModified:
        new Date(),

      changeFrequency:
        "daily" as const,

      priority: 0.9,
    })
  );

  // LOCATION URLS

  const locationUrls = [
    "texas",
    "california",
    "florida",
    "remote",
  ].map(
    (location) => ({
      url:
        `${baseUrl}/locations/${location}`,

      lastModified:
        new Date(),

      changeFrequency:
        "daily" as const,

      priority: 0.8,
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

    // CATEGORY PAGES

    ...categoryUrls,

    // LOCATION PAGES

    ...locationUrls,

    // COMPANY PAGES

    ...companyUrls,

    // JOB PAGES

    ...jobUrls,
  ];
}