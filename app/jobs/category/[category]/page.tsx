import Link from "next/link";

import { supabase } from "../../../lib/supabase";

type Props = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props) {
  const resolvedParams =
    await params;

  const category =
    resolvedParams.category
      .replace(/-/g, " ");

  return {
    title: `${category} Jobs | SearchEezy`,

    description: `Browse latest ${category} jobs on SearchEezy.`,
  };
}

export default async function CategoryJobsPage({
  params,
}: Props) {
  const resolvedParams =
    await params;

  const category =
    resolvedParams.category
      .replace(/-/g, " ");

  const { data: jobs } =
    await supabase
      .from("jobs")
      .select("*")
      .ilike(
        "category",
        category
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      );

  const getCurrencySymbol =
    (
      currency: string
    ) => {
      switch (
        currency
      ) {
        case "USD":
          return "$";

        case "INR":
          return "₹";

        case "EUR":
          return "€";

        case "GBP":
          return "£";

        default:
          return "$";
      }
    };

  return (
    <div
      style={{
        background:
          "#f5f7fb",

        minHeight:
          "100vh",

        padding:
          "40px 20px",
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
        <Link href="/">
          <button
            style={{
              marginBottom:
                "25px",

              padding:
                "12px 18px",

              border:
                "none",

              background:
                "#1d4ed8",

              color:
                "white",

              borderRadius:
                "10px",

              cursor:
                "pointer",

              fontWeight:
                "bold",

              fontSize:
                "14px",
            }}
          >
            ← Back Home
          </button>
        </Link>

        <div
          style={{
            marginBottom:
              "35px",
          }}
        >
          <h1
            style={{
              fontSize:
                "42px",

              color:
                "#1d4ed8",

              marginBottom:
                "10px",

              textTransform:
                "capitalize",
            }}
          >
            {category} Jobs
          </h1>

          <p
            style={{
              color:
                "#6b7280",

              fontSize:
                "18px",
            }}
          >
            Explore latest{" "}
            {category} opportunities
            on SearchEezy.
          </p>
        </div>

        {!jobs ||
        jobs.length === 0 ? (
          <div
            style={{
              background:
                "white",

              padding:
                "40px",

              borderRadius:
                "16px",

              textAlign:
                "center",

              border:
                "1px solid #e5e7eb",
            }}
          >
            <h2>
              No jobs found
            </h2>

            <p>
              Try checking back
              later for new
              openings.
            </p>
          </div>
        ) : (
          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(340px, 1fr))",

              gap: "24px",
            }}
          >
            {jobs.map(
              (job: any) => (
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

                      border:
                        "1px solid #e5e7eb",

                      borderRadius:
                        "20px",

                      padding:
                        "28px",

                      boxShadow:
                        "0 4px 18px rgba(0,0,0,0.05)",

                      transition:
                        "all 0.2s ease",

                      cursor:
                        "pointer",

                      height:
                        "100%",
                    }}
                  >
                    <h2
                      style={{
                        color:
                          "#111827",

                        marginBottom:
                          "10px",

                        fontSize:
                          "24px",
                      }}
                    >
                      {job.title}
                    </h2>

                    <p
                      style={{
                        color:
                          "#374151",

                        fontSize:
                          "18px",

                        marginBottom:
                          "14px",
                      }}
                    >
                      {job.company}
                    </p>

                    <div
                      style={{
                        display:
                          "flex",

                        flexDirection:
                          "column",

                        gap: "10px",

                        color:
                          "#4b5563",

                        marginBottom:
                          "20px",
                      }}
                    >
                      <p>
                        📍{" "}
                        {job.location}
                      </p>

                      {job.jobType && (
                        <p>
                          💼{" "}
                          {
                            job.jobType
                          }
                        </p>
                      )}
                    </div>

                    {job.category && (
                      <div
                        style={{
                          display:
                            "inline-block",

                          background:
                            "#dbeafe",

                          color:
                            "#1d4ed8",

                          padding:
                            "8px 14px",

                          borderRadius:
                            "999px",

                          fontWeight:
                            "bold",

                          fontSize:
                            "13px",

                          marginBottom:
                            "20px",
                        }}
                      >
                        {
                          job.category
                        }
                      </div>
                    )}

                    {job.salaryMin &&
                      job.salaryMax && (
                        <div>
                          <p
                            style={{
                              color:
                                "#16a34a",

                              fontWeight:
                                "bold",

                              fontSize:
                                "20px",
                            }}
                          >
                            💰{" "}
                            {getCurrencySymbol(
                              job.currency
                            )}
                            {Number(
                              job.salaryMin
                            ).toLocaleString(
                              "en-US"
                            )}
                            {" - "}
                            {getCurrencySymbol(
                              job.currency
                            )}
                            {Number(
                              job.salaryMax
                            ).toLocaleString(
                              "en-US"
                            )}
                          </p>
                        </div>
                      )}
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}