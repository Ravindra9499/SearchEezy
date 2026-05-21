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

  return (
    <div
      style={{
        maxWidth:
          "1200px",

        margin:
          "40px auto",

        padding:
          "20px",
      }}
    >
      <Link href="/">
        <button
          style={{
            marginBottom:
              "20px",

            padding:
              "10px 16px",

            border:
              "none",

            background:
              "#1c4ed8",

            color:
              "white",

            borderRadius:
              "8px",

            cursor:
              "pointer",
          }}
        >
          ← Back Home
        </button>
      </Link>

      <h1
        style={{
          fontSize:
            "36px",

          marginBottom:
            "30px",

          color:
            "#1c4ed8",
        }}
      >
        {category} Jobs
      </h1>

      {!jobs ||
      jobs.length === 0 ? (
        <p>
          No jobs found in
          this category.
        </p>
      ) : (
        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",

            gap: "20px",
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
                      "1px solid #ddd",

                    borderRadius:
                      "14px",

                    padding:
                      "24px",

                    boxShadow:
                      "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <h2
                    style={{
                      color:
                        "#111827",
                    }}
                  >
                    {job.title}
                  </h2>

                  <p>
                    {job.company}
                  </p>

                  <p>
                    📍{" "}
                    {job.location}
                  </p>

                  {job.jobType && (
                    <p>
                      💼{" "}
                      {job.jobType}
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
                        {job.salaryMin}
                        {" - "}
                        {
                          job.salaryMax
                        }
                      </p>
                    )}
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}