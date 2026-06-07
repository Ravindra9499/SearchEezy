import { createClient } from "@supabase/supabase-js";

import Link from "next/link";

import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } =
    await params;

  const normalizedSlug =
    slug.toLowerCase();

  const { data: jobs } =
    await supabase
      .from("jobs")
      .select("*");

  const filteredJobs =
    jobs?.filter(
      (job) =>
        job.company
          ?.toLowerCase()
          .replace(
            /\s+/g,
            "-"
          ) === normalizedSlug
    ) || [];

  const company =
    filteredJobs?.[0];

  if (!company) {
    return {
      title:
        "Company | SearchEezy",
    };
  }

  return {
    title:
      `${company.company} Careers & Jobs | SearchEezy`,

    description:
      company.companyDescription ||
      `Explore open jobs, hiring activity, and careers at ${company.company} on SearchEezy.`,

    keywords: [
      `${company.company} jobs`,
      `${company.company} careers`,
      `${company.company} hiring`,
      `${company.company} employment`,
      "SearchEezy company jobs",
    ],

    alternates: {
      canonical:
        `/company/${slug}`,
    },

    openGraph: {
      title:
        `${company.company} Careers & Jobs | SearchEezy`,

      description:
        company.companyDescription ||
        `Explore open jobs and careers at ${company.company}.`,

      url:
        `https://www.searcheezy.com/company/${slug}`,

      type:
        "website",
    },
  };
}

export default async function CompanyPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const normalizedSlug =
    slug.toLowerCase();

  // GET COMPANY JOBS

  const { data: jobs } =
    await supabase
      .from("jobs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  const filteredJobs =
    jobs?.filter(
      (job) =>
        job.company
          ?.toLowerCase()
          .replace(
            /\s+/g,
            "-"
          ) === normalizedSlug
    ) || [];

  const company =
    filteredJobs?.[0];

  if (!company) {
    return (
      <div
        style={{
          padding: "50px",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <h1>
          Company not found
        </h1>

        <Link href="/">
          <button
            style={{
              marginTop: "20px",
              padding:
                "12px 18px",
              background:
                "#1d4ed8",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  const totalJobs =
    filteredJobs.length;

  const featuredJobs =
    filteredJobs.filter(
      (job) =>
        job.featured
    ).length;

  const categories =
    Array.from(
      new Set(
        filteredJobs
          .map(
            (job) =>
              job.category
          )
          .filter(Boolean)
      )
    );

  return (
    <div
      style={{
        background:
          "#f5f7fb",
        minHeight:
          "100vh",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background:
            "white",
          padding:
            "40px 20px",
          borderBottom:
            "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth:
              "1100px",
            margin: "0 auto",
          }}
        >
          <Link href="/">
            <button
              style={{
                marginBottom:
                  "25px",
                padding:
                  "10px 16px",
                background:
                  "#1d4ed8",
                color: "white",
                border: "none",
                borderRadius:
                  "10px",
                cursor: "pointer",
                fontWeight:
                  "bold",
              }}
            >
              ← Back to Home
            </button>
          </Link>

          <div
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "25px",
              flexWrap:
                "wrap",
            }}
          >
            {/* LOGO */}

            {company.companyLogo && (
              <img
                src={
                  company.companyLogo
                }
                alt={
                  company.company
                }
                style={{
                  width: "100px",
                  height:
                    "100px",
                  objectFit:
                    "contain",
                  background:
                    "white",
                  border:
                    "1px solid #e5e7eb",
                  borderRadius:
                    "18px",
                  padding:
                    "10px",
                }}
              />
            )}

            {/* COMPANY INFO */}

            <div>
              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "12px",
                  flexWrap:
                    "wrap",
                }}
              >
                <h1
                  style={{
                    margin: 0,
                    fontSize:
                      "42px",
                    color:
                      "#111827",
                  }}
                >
                  {company.company}
                </h1>

                {company.verified && (
                  <div
                    style={{
                      background:
                        "#dcfce7",
                      color:
                        "#15803d",
                      padding:
                        "6px 14px",
                      borderRadius:
                        "999px",
                      fontSize:
                        "13px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    ✔ Verified Employer
                  </div>
                )}
              </div>

              {/* WEBSITE */}

              {company.companyWebsite && (
                <div
                  style={{
                    marginTop:
                      "14px",
                  }}
                >
                  <a
                    href={
                      company.companyWebsite
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color:
                        "#2563eb",
                      fontWeight:
                        "bold",
                      textDecoration:
                        "none",
                    }}
                  >
                    🌐 Visit Website
                  </a>
                </div>
              )}

              {/* COMPANY STATS */}

              <div
                style={{
                  display:
                    "flex",
                  gap: "14px",
                  flexWrap:
                    "wrap",
                  marginTop:
                    "20px",
                }}
              >
                <div
                  style={{
                    background:
                      "#eff6ff",
                    color:
                      "#1d4ed8",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "999px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {totalJobs} Open Jobs
                </div>

                <div
                  style={{
                    background:
                      "#fef3c7",
                    color:
                      "#92400e",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "999px",
                    fontWeight:
                      "bold",
                  }}
                >
                  {featuredJobs} Featured Jobs
                </div>

                {categories.length >
                  0 && (
                  <div
                    style={{
                      background:
                        "#ecfeff",
                      color:
                        "#0f766e",
                      padding:
                        "10px 16px",
                      borderRadius:
                        "999px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {
                      categories.length
                    }{" "}
                    Categories
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}

              {company.companyDescription && (
                <div
                  style={{
                    marginTop:
                      "24px",
                    maxWidth:
                      "850px",
                    color:
                      "#374151",
                    lineHeight:
                      "1.8",
                    fontSize:
                      "16px",
                  }}
                >
                  {
                    company.companyDescription
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO CONTENT */}

      <div
        style={{
          maxWidth:
            "1100px",
          margin:
            "35px auto 0",
          padding:
            "0 20px",
        }}
      >
        <div
          style={{
            background:
              "white",
            borderRadius:
              "22px",
            padding:
              "32px",
            marginBottom:
              "30px",
            boxShadow:
              "0 4px 16px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              color:
                "#111827",
              marginBottom:
                "18px",
            }}
          >
            Careers at {company.company}
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
            Explore career opportunities at{" "}
            {company.company}. SearchEezy helps employers connect
            with professionals across healthcare, software engineering,
            staffing, remote work, allied health, and technology industries.
            Browse open positions, hiring activity, featured jobs,
            and employer information all in one place.
          </p>
        </div>

        {/* RELATED CATEGORIES */}

        {categories.length >
          0 && (
          <div
            style={{
              background:
                "white",
              borderRadius:
                "22px",
              padding:
                "32px",
              marginBottom:
                "35px",
              boxShadow:
                "0 4px 16px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                color:
                  "#111827",
                marginBottom:
                  "20px",
              }}
            >
              Explore Job Categories
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
              {categories.map(
                (
                  category
                ) => (
                  <Link
                    key={
                      category
                    }
                    href={`/categories/${category
                      .toLowerCase()
                      .replace(
                        /\s+/g,
                        "-"
                      )}`}
                    style={{
                      textDecoration:
                        "none",
                    }}
                  >
                    <div
                      style={{
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
                      }}
                    >
                      {
                        category
                      }
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* OPEN JOBS */}

      <div
        style={{
          maxWidth:
            "1100px",
          margin:
            "0 auto 40px",
          padding:
            "0 20px",
        }}
      >
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "25px",
            flexWrap:
              "wrap",
            gap: "10px",
          }}
        >
          <h2
            style={{
              margin: 0,
              color:
                "#1d4ed8",
            }}
          >
            Open Jobs
          </h2>

          <div
            style={{
              background:
                "#eff6ff",
              color:
                "#1d4ed8",
              padding:
                "8px 14px",
              borderRadius:
                "999px",
              fontWeight:
                "bold",
            }}
          >
            {filteredJobs?.length || 0} Jobs
          </div>
        </div>

        {/* JOB LIST */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredJobs?.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              style={{
                textDecoration:
                  "none",
              }}
            >
              <div
                style={{
                  background:
                    "white",
                  padding:
                    "24px",
                  borderRadius:
                    "18px",
                  border:
                    "1px solid #e5e7eb",
                  boxShadow:
                    "0 4px 16px rgba(0,0,0,0.05)",
                  height:
                    "100%",
                }}
              >
                {job.featured && (
                  <div
                    style={{
                      display:
                        "inline-block",
                      background:
                        "#f59e0b",
                      color:
                        "white",
                      padding:
                        "5px 12px",
                      borderRadius:
                        "999px",
                      fontSize:
                        "12px",
                      fontWeight:
                        "bold",
                      marginBottom:
                        "14px",
                    }}
                  >
                    ⭐ Featured
                  </div>
                )}

                <h3
                  style={{
                    marginTop: 0,
                    color:
                      "#111827",
                  }}
                >
                  {job.title}
                </h3>

                <p
                  style={{
                    color:
                      "#6b7280",
                  }}
                >
                  📍 {job.location}
                </p>

                {job.jobType && (
                  <p
                    style={{
                      color:
                        "#6b7280",
                    }}
                  >
                    💼 {job.jobType}
                  </p>
                )}

                {job.salaryMin &&
                  job.salaryMax && (
                    <p
                      style={{
                        color:
                          "#16a34a",
                        fontWeight:
                          "bold",
                      }}
                    >
                      💰{" "}
                      {job.currency ===
                      "INR"
                        ? "₹"
                        : "$"}
                      {Number(
                        job.salaryMin
                      ).toLocaleString()}
                      {" - "}
                      {job.currency ===
                      "INR"
                        ? "₹"
                        : "$"}
                      {Number(
                        job.salaryMax
                      ).toLocaleString()}
                    </p>
                  )}

                {job.category && (
                  <div
                    style={{
                      display:
                        "inline-block",
                      marginTop:
                        "10px",
                      background:
                        "#eff6ff",
                      color:
                        "#1d4ed8",
                      padding:
                        "6px 12px",
                      borderRadius:
                        "999px",
                      fontWeight:
                        "bold",
                      fontSize:
                        "12px",
                    }}
                  >
                    {job.category}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}