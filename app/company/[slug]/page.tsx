import { createClient } from "@supabase/supabase-js";

import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CompanyPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const companyName = slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

  // GET COMPANY JOBS

  const { data: jobs } =
    await supabase
      .from("jobs")
      .select("*")
      .eq("company", companyName)
      .order("created_at", {
        ascending: false,
      });

  const company = jobs?.[0];

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

              {/* DESCRIPTION */}

              {company.companyDescription && (
                <div
                  style={{
                    marginTop:
                      "20px",
                    maxWidth:
                      "850px",
                    color:
                      "#374151",
                    lineHeight:
                      "1.7",
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

      {/* OPEN JOBS */}

      <div
        style={{
          maxWidth:
            "1100px",
          margin:
            "40px auto",
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
            {jobs?.length || 0} Jobs
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
          {jobs?.map((job) => (
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