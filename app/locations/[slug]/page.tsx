export const dynamic =
  "force-dynamic";

import type { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const locationContent: Record<
  string,
  {
    title: string;
    description: string;
    seoContent: string;
    keywords: string[];
    matchKeywords: string[];
    popularSearches: {
      label: string;
      href: string;
    }[];
  }
> = {
  texas: {
    title:
      "Texas Jobs",

    description:
      "Explore healthcare, software engineering, remote, staffing, and technology jobs across Texas on SearchEezy.",

    seoContent:
      "SearchEezy helps employers and job seekers connect across Texas including Dallas, Houston, Austin, San Antonio, and surrounding areas. Explore healthcare, technology, staffing, engineering, and remote career opportunities from leading employers actively hiring in Texas.",

    keywords: [
      "Texas jobs",
      "jobs in Texas",
      "healthcare jobs Texas",
      "software jobs Texas",
      "Dallas jobs",
      "Houston jobs",
    ],

    matchKeywords: [
      "texas",
      "tx",
      "dallas",
      "houston",
      "austin",
      "san antonio",
    ],

    popularSearches: [
      {
        label:
          "Healthcare Jobs",
        href:
          "/categories/healthcare",
      },

      {
        label:
          "Remote Jobs",
        href:
          "/categories/remote",
      },

      {
        label:
          "Software Engineering Jobs",
        href:
          "/categories/software-engineering",
      },
    ],
  },

  california: {
    title:
      "California Jobs",

    description:
      "Browse healthcare, technology, staffing, and remote jobs across California on SearchEezy.",

    seoContent:
      "Discover career opportunities across California including Los Angeles, San Francisco, San Diego, Sacramento, and surrounding regions. SearchEezy connects employers with top talent across healthcare, software engineering, remote work, and staffing industries.",

    keywords: [
      "California jobs",
      "jobs in California",
      "San Francisco jobs",
      "Los Angeles jobs",
      "healthcare jobs California",
    ],

    matchKeywords: [
      "california",
      "ca",
      "los angeles",
      "san francisco",
      "san diego",
      "sacramento",
    ],

    popularSearches: [
      {
        label:
          "Healthcare Careers",
        href:
          "/categories/healthcare",
      },

      {
        label:
          "Remote Careers",
        href:
          "/categories/remote",
      },

      {
        label:
          "Technology Jobs",
        href:
          "/categories/software-engineering",
      },
    ],
  },

  remote: {
    title:
      "Remote Jobs",

    description:
      "Find remote and work from home jobs across healthcare, software engineering, staffing, and professional services.",

    seoContent:
      "SearchEezy helps job seekers find remote and hybrid opportunities across software engineering, healthcare, staffing, recruiting, administration, customer support, and professional services. Explore flexible work from home opportunities from employers actively hiring remote talent.",

    keywords: [
      "remote jobs",
      "work from home jobs",
      "hybrid jobs",
      "virtual jobs",
    ],

    matchKeywords: [
      "remote",
      "work from home",
      "hybrid",
      "virtual",
    ],

    popularSearches: [
      {
        label:
          "Remote Software Jobs",
        href:
          "/categories/software-engineering",
      },

      {
        label:
          "Remote Healthcare Jobs",
        href:
          "/categories/healthcare",
      },

      {
        label:
          "All Remote Careers",
        href:
          "/categories/remote",
      },
    ],
  },

  florida: {
    title:
      "Florida Jobs",

    description:
      "Search healthcare, technology, staffing, and remote jobs across Florida on SearchEezy.",

    seoContent:
      "Explore Florida career opportunities including Miami, Orlando, Tampa, Jacksonville, and surrounding regions. SearchEezy connects employers with healthcare professionals, engineers, recruiters, remote talent, and skilled professionals across Florida.",

    keywords: [
      "Florida jobs",
      "jobs in Florida",
      "Miami jobs",
      "Orlando jobs",
      "healthcare jobs Florida",
    ],

    matchKeywords: [
      "florida",
      "fl",
      "miami",
      "orlando",
      "tampa",
      "jacksonville",
    ],

    popularSearches: [
      {
        label:
          "Healthcare Jobs",
        href:
          "/categories/healthcare",
      },

      {
        label:
          "Remote Jobs",
        href:
          "/categories/remote",
      },

      {
        label:
          "Software Jobs",
        href:
          "/categories/software-engineering",
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const location =
    locationContent[
      slug
    ];

  if (!location) {
    return {
      title:
        "SearchEezy Jobs",
    };
  }

  return {
    title:
      `${location.title} | SearchEezy`,

    description:
      location.description,

    keywords:
      location.keywords,

    alternates: {
      canonical:
        `/locations/${slug}`,
    },

    openGraph: {
      title:
        `${location.title} | SearchEezy`,

      description:
        location.description,

      url:
        `https://www.searcheezy.com/locations/${slug}`,

      type:
        "website",
    },
  };
}

export default async function LocationPage({
  params,
}: Props) {
  const {
    slug,
  } = await params;

  const location =
    locationContent[
      slug
    ];

  if (!location) {
    return (
      <div
        style={{
          padding:
            "60px",
          textAlign:
            "center",
        }}
      >
        Location not found
      </div>
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/jobs`,
    {
      cache:
        "no-store",
    }
  );

  const jobs =
    await res.json();

  const filteredJobs =
    jobs.filter(
      (job: any) => {
        const combined =
          `
          ${job.location || ""}
          ${job.description || ""}
          ${job.title || ""}
          `
            .toLowerCase();

        return location.matchKeywords.some(
          (
            keyword
          ) =>
            combined.includes(
              keyword.toLowerCase()
            )
        );
      }
    );

  return (
    <div
      style={{
        background:
          "#f5f7fb",
        minHeight:
          "100vh",
        padding:
          "50px 20px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
        }}
      >
        <a href="/">
          <button
            style={{
              background:
                "white",
              border:
                "1px solid #d1d5db",
              padding:
                "10px 16px",
              borderRadius:
                "10px",
              cursor:
                "pointer",
              marginBottom:
                "25px",
              fontWeight:
                "bold",
            }}
          >
            ← Back to Home
          </button>
        </a>

        {/* HERO */}

        <div
          style={{
            background:
              "linear-gradient(135deg, #111827, #1e40af)",
            borderRadius:
              "24px",
            padding:
              "50px 35px",
            color:
              "white",
            marginBottom:
              "35px",
          }}
        >
          <h1
            style={{
              fontSize:
                "42px",
              marginBottom:
                "20px",
            }}
          >
            {location.title}
          </h1>

          <p
            style={{
              fontSize:
                "18px",
              lineHeight:
                "1.8",
              color:
                "#dbeafe",
              maxWidth:
                "900px",
            }}
          >
            {
              location.description
            }
          </p>

          <div
            style={{
              marginTop:
                "24px",
              display:
                "inline-block",
              background:
                "rgba(255,255,255,0.15)",
              padding:
                "12px 18px",
              borderRadius:
                "14px",
              fontWeight:
                "bold",
              fontSize:
                "16px",
            }}
          >
            {
              filteredJobs.length
            }{" "}
            Jobs Available
          </div>
        </div>

        {/* SEO CONTENT */}

        <div
          style={{
            background:
              "white",
            borderRadius:
              "20px",
            padding:
              "30px",
            marginBottom:
              "35px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom:
                "18px",
              color:
                "#111827",
            }}
          >
            Explore{" "}
            {
              location.title
            }
          </h2>

          <p
            style={{
              color:
                "#4b5563",
              lineHeight:
                "1.9",
              fontSize:
                "16px",
            }}
          >
            {
              location.seoContent
            }
          </p>
        </div>

        {/* POPULAR SEARCHES */}

        <div
          style={{
            background:
              "white",
            borderRadius:
              "20px",
            padding:
              "30px",
            marginBottom:
              "35px",
            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom:
                "20px",
              color:
                "#111827",
            }}
          >
            Popular Searches
          </h2>

          <div
            style={{
              display:
                "flex",
              gap: "14px",
              flexWrap:
                "wrap",
            }}
          >
            {location.popularSearches.map(
              (
                item
              ) => (
                <a
                  key={
                    item.label
                  }
                  href={
                    item.href
                  }
                  style={{
                    textDecoration:
                      "none",
                    background:
                      "#eff6ff",
                    color:
                      "#1d4ed8",
                    padding:
                      "12px 18px",
                    borderRadius:
                      "999px",
                    fontWeight:
                      "bold",
                    fontSize:
                      "14px",
                  }}
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* JOB GRID */}

        {filteredJobs.length ===
        0 ? (
          <div
            style={{
              background:
                "white",
              padding:
                "40px",
              borderRadius:
                "20px",
              textAlign:
                "center",
            }}
          >
            No jobs found for this location yet.
          </div>
        ) : (
          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap:
                "22px",
            }}
          >
            {filteredJobs.map(
              (job: any) => (
                <a
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  style={{
                    textDecoration:
                      "none",
                    color:
                      "inherit",
                    display:
                      "block",
                  }}
                >
                  <div
                    style={{
                      background:
                        "white",
                      borderRadius:
                        "20px",
                      padding:
                        "24px",
                      boxShadow:
                        "0 4px 18px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h2
                      style={{
                        marginBottom:
                          "12px",
                        color:
                          "#111827",
                      }}
                    >
                      {job.title}
                    </h2>

                    <p
                      style={{
                        color:
                          "#2563eb",
                        fontWeight:
                          "bold",
                        marginBottom:
                          "10px",
                      }}
                    >
                      {job.company}
                    </p>

                    <p
                      style={{
                        color:
                          "#6b7280",
                      }}
                    >
                      📍 {job.location}
                    </p>
                  </div>
                </a>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}