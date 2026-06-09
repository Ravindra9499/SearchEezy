export const dynamic =
  "force-dynamic";

import type { Metadata } from "next";

type Props = {
  params: Promise<{
    category: string;
    location: string;
  }>;
};

const categoryMap: Record<
  string,
  {
    title: string;
    keywords: string[];
    matchKeywords: string[];
  }
> = {
  healthcare: {
    title:
      "Healthcare Jobs",

    keywords: [
      "healthcare jobs",
      "medical jobs",
      "nursing jobs",
    ],

    matchKeywords: [
      "healthcare",
      "medical",
      "nurse",
      "therapist",
      "radiology",
      "pharmacist",
      "technologist",
    ],
  },

  "software-engineering": {
    title:
      "Software Engineering Jobs",

    keywords: [
      "software jobs",
      "developer jobs",
      "engineering jobs",
    ],

    matchKeywords: [
      "software",
      "developer",
      "engineer",
      "react",
      "next.js",
      "javascript",
      "typescript",
    ],
  },

  remote: {
    title:
      "Remote Jobs",

    keywords: [
      "remote jobs",
      "work from home jobs",
    ],

    matchKeywords: [
      "remote",
      "work from home",
      "hybrid",
    ],
  },
};

const locationMap: Record<
  string,
  {
    title: string;
    matchKeywords: string[];
  }
> = {
  dallas: {
    title:
      "Dallas",

    matchKeywords: [
      "dallas",
      "texas",
      "tx",
    ],
  },

  houston: {
    title:
      "Houston",

    matchKeywords: [
      "houston",
      "texas",
      "tx",
    ],
  },

  austin: {
    title:
      "Austin",

    matchKeywords: [
      "austin",
      "texas",
      "tx",
    ],
  },

  texas: {
    title:
      "Texas",

    matchKeywords: [
      "texas",
      "tx",
    ],
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    category,
    location,
  } = await params;

  const categoryData =
    categoryMap[
      category
    ];

  const locationData =
    locationMap[
      location
    ];

  if (
    !categoryData ||
    !locationData
  ) {
    return {
      title:
        "SearchEezy Jobs",
    };
  }

  return {
    title:
      `${locationData.title} ${categoryData.title} | SearchEezy`,

    description:
      `Explore ${categoryData.title.toLowerCase()} in ${locationData.title} on SearchEezy.`,

    keywords: [
      ...categoryData.keywords,
      `${locationData.title} jobs`,
    ],
  };
}

export default async function CategoryLocationPage({
  params,
}: Props) {
  const {
    category,
    location,
  } = await params;

  const categoryData =
    categoryMap[
      category
    ];

  const locationData =
    locationMap[
      location
    ];

  if (
    !categoryData ||
    !locationData
  ) {
    return (
      <div
        style={{
          padding:
            "60px",
          textAlign:
            "center",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        Page not found
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
          ${job.title || ""}
          ${job.description || ""}
          ${job.location || ""}
          ${job.category || ""}
          `
            .toLowerCase();

        const matchesCategory =
          categoryData.matchKeywords.some(
            (
              keyword
            ) =>
              combined.includes(
                keyword.toLowerCase()
              )
          );

        const matchesLocation =
          locationData.matchKeywords.some(
            (
              keyword
            ) =>
              combined.includes(
                keyword.toLowerCase()
              )
          );

        return (
          matchesCategory &&
          matchesLocation
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
              lineHeight:
                "1.2",
            }}
          >
            {locationData.title}{" "}
            {
              categoryData.title
            }
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
            Explore{" "}
            {
              categoryData.title.toLowerCase()
            }{" "}
            in{" "}
            {
              locationData.title
            }{" "}
            with SearchEezy. Discover opportunities from employers actively hiring across healthcare, staffing, remote work, and software engineering industries.
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

        {filteredJobs.length ===
        0 ? (
          <div
            style={{
              background:
                "white",
              borderRadius:
                "20px",
              padding:
                "40px",
              textAlign:
                "center",
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.05)",
            }}
          >
            No matching jobs found yet.
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
