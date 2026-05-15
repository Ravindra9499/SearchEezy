"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "../lib/supabase";

export default function MyJobsPage() {
  const router = useRouter();

  const [jobs, setJobs] =
    useState<any[]>([]);

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    getUserAndJobs();
  }, []);

  const getUserAndJobs =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      // Redirect if not logged in
      if (!user) {
        router.push("/login");

        return;
      }

      setUser(user);

      // Fetch ONLY employer jobs
      const res = await fetch(
        `/api/jobs?userEmail=${user.email}`,
        {
          cache:
            "no-store",
        }
      );

      const myJobs =
        await res.json();

      // Add applicant counts
      const jobsWithCounts =
        await Promise.all(
          myJobs.map(
            async (
              job: any
            ) => {
              const appRes =
                await fetch(
                  `/api/applications?jobId=${job.id}`,
                  {
                    cache:
                      "no-store",
                  }
                );

              const applications =
                await appRes.json();

              return {
                ...job,

                applicantCount:
                  applications.length,
              };
            }
          )
        );

      setJobs(
        jobsWithCounts
      );

      setLoading(false);
    };

  const deleteJob =
    async (id: string) => {
      const confirmDelete =
        confirm(
          "Delete this job?"
        );

      if (!confirmDelete)
        return;

      // DEBUG LOG

      console.log(
        "Deleting ID:",
        id,
        typeof id
      );

      const res = await fetch(
        "/api/jobs",
        {
          method:
            "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
          }),
        }
      );

      if (res.ok) {
        setJobs(
          jobs.filter(
            (job) =>
              String(
                job.id
              ) !== String(id)
          )
        );
      } else {
        alert(
          "Failed to delete job"
        );
      }
    };

  if (loading) {
    return (
      <p
        style={{
          padding: "20px",
        }}
      >
        Loading...
      </p>
    );
  }

  return (
    <div
      style={{
        background:
          "#f3f2f1",

        minHeight:
          "100vh",

        padding:
          "20px",
      }}
    >
      <div
        style={{
          maxWidth:
            "900px",

          margin:
            "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "20px",
          }}
        >
          <h1
            style={{
              color:
                "#1c4ed8",
            }}
          >
            My Jobs
          </h1>

          <button
            onClick={() => {
              window.location.href =
                "/";
            }}
            style={{
              background:
                "#1c4ed8",

              color:
                "white",

              border:
                "none",

              padding:
                "10px 15px",

              borderRadius:
                "5px",

              cursor:
                "pointer",
            }}
          >
            Back to Home
          </button>
        </div>

        {/* User */}

        <p
          style={{
            marginBottom:
              "20px",
          }}
        >
          Logged in as:
          {" "}
          {user?.email}
        </p>

        {/* No Jobs */}

        {jobs.length === 0 ? (
          <p>
            You have not
            posted any jobs
            yet.
          </p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background:
                  "white",

                padding:
                  "15px",

                borderRadius:
                  "10px",

                marginBottom:
                  "15px",

                border:
                  "1px solid #ddd",
              }}
            >
              <h2
                style={{
                  color:
                    "#1c4ed8",

                  marginBottom:
                    "5px",
                }}
              >
                {job.title}
              </h2>

              <p>
                <strong>
                  {
                    job.company
                  }
                </strong>
              </p>

              <p>
                📍{" "}
                {
                  job.location
                }
              </p>

              <p
                style={{
                  marginTop:
                    "10px",

                  fontWeight:
                    "bold",
                }}
              >
                Applicants:
                {" "}
                {
                  job.applicantCount
                }
              </p>

              {/* Actions */}

              <div
                style={{
                  display:
                    "flex",

                  gap: "10px",

                  marginTop:
                    "10px",

                  flexWrap:
                    "wrap",
                }}
              >
                <a
                  href={`/edit-job/${job.id}`}
                >
                  <button
                    style={{
                      background:
                        "#1c4ed8",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "8px 12px",

                      borderRadius:
                        "5px",

                      cursor:
                        "pointer",
                    }}
                  >
                    Edit Job
                  </button>
                </a>

                <a
                  href={`/applications/${job.id}`}
                >
                  <button
                    style={{
                      background:
                        "green",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "8px 12px",

                      borderRadius:
                        "5px",

                      cursor:
                        "pointer",
                    }}
                  >
                    View
                    Applicants
                  </button>
                </a>

                <button
                  onClick={() =>
                    deleteJob(
                      job.id
                    )
                  }
                  style={{
                    background:
                      "red",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "8px 12px",

                    borderRadius:
                      "5px",

                    cursor:
                      "pointer",
                  }}
                >
                  Delete Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}