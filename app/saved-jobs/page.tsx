"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function SavedJobsPage() {
  const [jobs, setJobs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchSavedJobs =
      async () => {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setLoading(false);

          return;
        }

        const {
          data: savedJobs,
        } =
          await supabase
            .from(
              "saved_jobs"
            )
            .select("*")
            .eq(
              "userEmail",
              user.email
            );

        if (
          savedJobs &&
          savedJobs.length >
            0
        ) {
          const jobIds =
            savedJobs.map(
              (item) =>
                item.jobId
            );

          const {
            data: jobsData,
          } =
            await supabase
              .from("jobs")
              .select("*")
              .in(
                "id",
                jobIds
              );

          setJobs(
            jobsData || []
          );
        }

        setLoading(false);
      };

    fetchSavedJobs();
  }, []);

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
          "40px",
      }}
    >
      <a
        href="/"
        style={{
          textDecoration:
            "none",
        }}
      >
        <button
          style={{
            background:
              "#1d4ed8",
            color:
              "white",
            border:
              "none",
            padding:
              "12px 18px",
            borderRadius:
              "10px",
            cursor:
              "pointer",
            marginBottom:
              "30px",
            fontWeight:
              "bold",
          }}
        >
          ← Back Home
        </button>
      </a>

      <h1
        style={{
          color:
            "#1d4ed8",
          fontSize:
            "42px",
          marginBottom:
            "10px",
        }}
      >
        Saved Jobs
      </h1>

      <p
        style={{
          color:
            "#6b7280",
          marginBottom:
            "40px",
        }}
      >
        Jobs you bookmarked
        for later.
      </p>

      {loading ? (
        <div>
          Loading...
        </div>
      ) : jobs.length ===
        0 ? (
        <div
          style={{
            background:
              "white",
            padding:
              "40px",
            borderRadius:
              "18px",
          }}
        >
          <h2>
            No saved jobs
          </h2>

          <p>
            Save jobs from
            homepage to see
            them here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "22px",
          }}
        >
          {jobs.map(
            (job) => (
              <div
                key={job.id}
                onClick={() =>
                  (window.location.href =
                    `/jobs/${job.id}`)
                }
                style={{
                  background:
                    "white",
                  borderRadius:
                    "18px",
                  padding:
                    "28px",
                  cursor:
                    "pointer",
                  boxShadow:
                    "0 4px 18px rgba(0,0,0,0.05)",
                }}
              >
                {job.companyLogo && (
                  <img
                    src={
                      job.companyLogo
                    }
                    alt={
                      job.company
                    }
                    style={{
                      width:
                        "55px",
                      height:
                        "55px",
                      objectFit:
                        "contain",
                      marginBottom:
                        "15px",
                    }}
                  />
                )}

                <h2>
                  {job.title}
                </h2>

                <div
                  style={{
                    display:
                      "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    flexWrap:
                      "wrap",
                    marginBottom:
                      "12px",
                  }}
                >
                  <strong
                    style={{
                      color:
                        "#1d4ed8",
                    }}
                  >
                    {
                      job.company
                    }
                  </strong>

                  {job.verified && (
                    <div
                      style={{
                        background:
                          "#dcfce7",
                        color:
                          "#15803d",
                        padding:
                          "4px 10px",
                        borderRadius:
                          "999px",
                        fontSize:
                          "11px",
                        fontWeight:
                          "bold",
                      }}
                    >
                      ✔ Verified
                    </div>
                  )}
                </div>

                <p>
                  📍{" "}
                  {job.location}
                </p>

                <p>
                  💼{" "}
                  {job.jobType}
                </p>

                {job.salaryMin &&
                  job.salaryMax && (
                    <p
                      style={{
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
                      ).toLocaleString()}
                      {" - "}
                      {getCurrencySymbol(
                        job.currency
                      )}
                      {Number(
                        job.salaryMax
                      ).toLocaleString()}
                    </p>
                  )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}