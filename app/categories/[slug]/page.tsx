export const dynamic =
  "force-dynamic";

import type { Metadata } from "next";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const categoryContent: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
    matchKeywords: string[];
  }
> = {
  healthcare: {
    title:
      "Healthcare Jobs",

    description:
      "Explore healthcare careers including nursing, allied health, therapy, radiology, imaging, and healthcare staffing jobs on SearchEezy.",

    keywords: [
      "healthcare jobs",
      "nursing jobs",
      "allied health jobs",
      "therapist jobs",
      "radiology jobs",
    ],

    matchKeywords: [
      "healthcare",
      "therapist",
      "physical therapist",
      "nurse",
      "rn",
      "lpn",
      "radiology",
      "x-ray",
      "echo",
      "vascular",
      "pharmacist",
      "clinician",
      "technologist",
      "medical",
    ],
  },

  "software-engineering": {
    title:
      "Software Engineering Jobs",

    description:
      "Find frontend, backend, full stack, cloud, DevOps, and remote software engineering jobs.",

    keywords: [
      "software engineer jobs",
      "developer jobs",
      "frontend jobs",
      "backend jobs",
    ],

    matchKeywords: [
      "software",
      "developer",
      "engineer",
      "frontend",
      "backend",
      "react",
      "next.js",
      "javascript",
      "typescript",
      "devops",
      "cloud",
    ],
  },

  construction: {
    title:
      "Construction Jobs",

    description:
      "Search construction management and skilled trade careers.",

    keywords: [
      "construction jobs",
      "field engineer jobs",
    ],

    matchKeywords: [
      "construction",
      "civil",
      "site engineer",
      "project manager",
      "builder",
      "contractor",
    ],
  },

  manufacturing: {
    title:
      "Manufacturing Jobs",

    description:
      "Explore manufacturing engineering and industrial careers.",

    keywords: [
      "manufacturing jobs",
      "industrial jobs",
    ],

    matchKeywords: [
      "manufacturing",
      "production",
      "factory",
      "industrial",
      "operations",
      "warehouse",
    ],
  },

  remote: {
    title:
      "Remote Jobs",

    description:
      "Find remote and work from home opportunities.",

    keywords: [
      "remote jobs",
      "work from home jobs",
    ],

    matchKeywords: [
      "remote",
      "work from home",
      "hybrid",
      "virtual",
    ],
  },
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const category =
    categoryContent[
      slug
    ];

  if (!category) {
    return {
      title:
        "SearchEezy Jobs",
    };
  }

  return {
    title:
      `${category.title} | SearchEezy`,

    description:
      category.description,

    keywords:
      category.keywords,

    alternates: {
      canonical:
        `/categories/${slug}`,
    },

    openGraph: {
      title:
        `${category.title} | SearchEezy`,

      description:
        category.description,

      url:
        `https://www.searcheezy.com/categories/${slug}`,

      type:
        "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: Props) {
  const {
    slug,
  } = await params;

  const category =
    categoryContent[
      slug
    ];

  if (!category) {
    return (
      <div
        style={{
          padding:
            "60px",
          textAlign:
            "center",
        }}
      >
        Category not found
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
          ${job.category || ""}
          ${job.jobType || ""}
          `
            .toLowerCase();

        return category.matchKeywords.some(
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

        <div
          style={{
            background:
              "linear-gradient(135deg, #111827, #1e3a8a)",
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
            {category.title}
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
            {category.description}
          </p>
        </div>

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
            No jobs found in this category yet.
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