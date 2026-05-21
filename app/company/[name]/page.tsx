import Link from "next/link";

import { supabase } from "../../lib/supabase";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props) {
  const resolvedParams =
    await params;

  const company =
    resolvedParams.name
      .replace(/-/g, " ");

  return {
    title: `${company} Jobs | SearchEezy`,

    description: `Explore jobs and company information for ${company} on SearchEezy.`,
  };
}

export default async function CompanyPage({
  params,
}: Props) {
  const resolvedParams =
    await params;

  const company =
    resolvedParams.name
      .replace(/-/g, " ");

  const { data: jobs } =
    await supabase
      .from("jobs")
      .select("*")
      .ilike(
        "company",
        company
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
            }}
          >
            ← Back Home
          </button>
        </Link>

        <div
          style={{
            background:
              "white",

            padding:
              "35px",

            borderRadius:
              "20px",

            marginBottom:
              "30px",

            boxShadow:
              "0 4px 18px rgba(0,0,0,0.05)",
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
            {company}
          </h1>

          <p
            style={{
              color:
                "#6b7280",

              fontSize:
                "18px",
            }}
          >
            Explore open jobs and
            opportunities at{" "}
            {company}.
          </p>
        </div>

        <h2
          style={{
            marginBottom:
              "25px",

            color:
              "#111827",
          }}
        >
          Open Positions
        </h2>

        {!jobs ||
        jobs.length === 0 ? (
          <div
            style={{
              background:
                "white",

              padding:
                "40px",

              borderRadius:
                "18px",

              textAlign:
                "center",
            }}
          >
            <h3>
              No jobs available
            </h3>

            <p>
              This company has no
              active openings yet.
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

                      borderRadius:
                        "20px",

                      padding:
                        "28px",

                      boxShadow:
                        "0 4px 18px rgba(0,0,0,0.05)",

                      border:
                        "1px solid #e5e7eb",

                      height:
                        "100%",
                    }}
                  >
                    <h3
                      style={{
                        color:
                          "#111827",

                        marginBottom:
                          "10px",
                      }}
                    >
                      {job.title}
                    </h3>

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

                    {job.category && (
                      <div
                        style={{
                          display:
                            "inline-block",

                          marginTop:
                            "14px",

                          background:
                            "#dbeafe",

                          color:
                            "#1d4ed8",

                          padding:
                            "6px 12px",

                          borderRadius:
                            "999px",

                          fontWeight:
                            "bold",

                          fontSize:
                            "13px",
                        }}
                      >
                        {
                          job.category
                        }
                      </div>
                    )}

                    {job.salaryMin &&
                      job.salaryMax && (
                        <p
                          style={{
                            marginTop:
                              "18px",

                            color:
                              "#16a34a",

                            fontWeight:
                              "bold",

                            fontSize:
                              "18px",
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