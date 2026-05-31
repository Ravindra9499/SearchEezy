"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "../lib/supabase";

export default function MyJobsPage() {
  const router =
    useRouter();

  const [jobs, setJobs] =
    useState<any[]>([]);

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    shortlistedCount,
    setShortlistedCount,
  ] = useState(0);

  const [
    candidateDatabaseCount,
    setCandidateDatabaseCount,
  ] = useState(0);

  const [
    recentApplicants,
    setRecentApplicants,
  ] = useState<any[]>([]);

  useEffect(() => {
    getUserAndJobs();
  }, []);

  const getUserAndJobs =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push("/login");

        return;
      }

      setUser(user);

      // JOBS

      const res = await fetch(
        `/api/jobs?userEmail=${user.email}`,
        {
          cache:
            "no-store",
        }
      );

      const myJobs =
        await res.json();

      const jobsWithCounts =
        await Promise.all(
          myJobs.map(
            async (
              job: any
            ) => {
              const appRes =
                await fetch(
                  `/api/applications?jobId=${job.id}&employerEmail=${user.email}`,
                  {
                    cache:
                      "no-store",
                  }
                );

              const applications =
                await appRes.json();

              const safeApplicantCount =
                Array.isArray(
                  applications
                )
                  ? applications.length
                  : 0;

              return {
                ...job,

                applicantCount:
                  safeApplicantCount,
              };
            }
          )
        );

      setJobs(
        jobsWithCounts
      );

      // SHORTLIST COUNT

      const {
        data:
          shortlistedData,
      } =
        await supabase
          .from(
            "shortlisted_candidates"
          )
          .select("id")
          .eq(
            "recruiterEmail",
            user.email
          );

      setShortlistedCount(
        shortlistedData?.length ||
          0
      );

      // CANDIDATE DATABASE COUNT

      const {
        data:
          candidateProfiles,
      } =
        await supabase
          .from(
            "candidate_profiles"
          )
          .select("id");

      setCandidateDatabaseCount(
        candidateProfiles?.length ||
          0
      );

      // RECENT APPLICANTS

      const {
        data:
          recentApplications,
      } =
        await supabase
          .from(
            "applications"
          )
          .select(
            "id, name, created_at, jobTitle"
          )
          .eq(
            "employerEmail",
            user.email
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          )
          .limit(5);

      setRecentApplicants(
        recentApplications ||
          []
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

  const totalApplicants =
    jobs.reduce(
      (
        total,
        job
      ) =>
        total +
        Number(
          job.applicantCount || 0
        ),
      0
    );

  const topPerformingJobs =
    [...jobs]
      .sort(
        (
          a,
          b
        ) =>
          Number(
            b.applicantCount || 0
          ) -
          Number(
            a.applicantCount || 0
          )
      )
      .slice(0, 5);

  if (loading) {
    return (
      <div
        style={{
          padding:
            "40px",

          textAlign:
            "center",
        }}
      >
        Loading...
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

        padding:
          "40px 20px",

        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth:
            "1400px",

          margin:
            "0 auto",
        }}
      >
        {/* TOP BAR */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "30px",

            flexWrap:
              "wrap",

            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,

                fontSize:
                  "38px",

                color:
                  "#111827",
              }}
            >
              Employer Dashboard
            </h1>

            <p
              style={{
                color:
                  "#6b7280",

                marginTop:
                  "8px",
              }}
            >
              Recruiter business visibility and hiring workflows.
            </p>
          </div>

          <div
            style={{
              display:
                "flex",

              gap: "12px",

              flexWrap:
                "wrap",
            }}
          >
            <a href="/resume-search">
              <button
                style={{
                  background:
                    "#16a34a",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "12px 18px",

                  borderRadius:
                    "12px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                Resume Search
              </button>
            </a>

            <a href="/shortlisted-candidates">
              <button
                style={{
                  background:
                    "#f59e0b",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "12px 18px",

                  borderRadius:
                    "12px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                Shortlisted Candidates
              </button>
            </a>

            <a href="/">
              <button
                style={{
                  background:
                    "white",

                  border:
                    "1px solid #d1d5db",

                  padding:
                    "12px 18px",

                  borderRadius:
                    "12px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                Back Home
              </button>
            </a>

            <a href="/post-job">
              <button
                style={{
                  background:
                    "#1c4ed8",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "12px 18px",

                  borderRadius:
                    "12px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                + Post New Job
              </button>
            </a>
          </div>
        </div>

        {/* USER */}

        <div
          style={{
            background:
              "white",

            padding:
              "20px",

            borderRadius:
              "18px",

            marginBottom:
              "25px",

            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <p
            style={{
              margin: 0,

              color:
                "#374151",
            }}
          >
            Logged in as:
            {" "}
            <strong>
              {user?.email}
            </strong>
          </p>
        </div>

        {/* ANALYTICS */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",

            gap: "20px",

            marginBottom:
              "35px",
          }}
        >
          <div
            style={{
              background:
                "white",

              padding:
                "28px",

              borderRadius:
                "20px",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                color:
                  "#6b7280",

                marginBottom:
                  "10px",
              }}
            >
              Total Jobs
            </p>

            <h2
              style={{
                margin: 0,

                fontSize:
                  "38px",

                color:
                  "#1c4ed8",
              }}
            >
              {jobs.length}
            </h2>
          </div>

          <div
            style={{
              background:
                "white",

              padding:
                "28px",

              borderRadius:
                "20px",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                color:
                  "#6b7280",

                marginBottom:
                  "10px",
              }}
            >
              Total Applicants
            </p>

            <h2
              style={{
                margin: 0,

                fontSize:
                  "38px",

                color:
                  "#16a34a",
              }}
            >
              {
                totalApplicants
              }
            </h2>
          </div>

          <div
            style={{
              background:
                "white",

              padding:
                "28px",

              borderRadius:
                "20px",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                color:
                  "#6b7280",

                marginBottom:
                  "10px",
              }}
            >
              Shortlisted Candidates
            </p>

            <h2
              style={{
                margin: 0,

                fontSize:
                  "38px",

                color:
                  "#f59e0b",
              }}
            >
              {
                shortlistedCount
              }
            </h2>
          </div>

          <div
            style={{
              background:
                "white",

              padding:
                "28px",

              borderRadius:
                "20px",

                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <p
                style={{
                  color:
                    "#6b7280",

                  marginBottom:
                    "10px",
                }}
              >
                Candidate Database
              </p>

              <h2
                style={{
                  margin: 0,

                  fontSize:
                    "38px",

                  color:
                    "#7c3aed",
                }}
              >
                {
                  candidateDatabaseCount
                }
              </h2>
            </div>
          </div>

        {/* RECENT APPLICANTS */}

        <div
          style={{
            background:
              "white",

            borderRadius:
              "22px",

            padding:
              "28px",

            marginBottom:
              "35px",

            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
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
                "20px",

              flexWrap:
                "wrap",

              gap: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,

                  color:
                    "#111827",
                }}
              >
                Recent Applicants
              </h2>

              <p
                style={{
                  color:
                    "#6b7280",

                  marginTop:
                    "6px",
                }}
              >
                Latest candidate activity across your jobs.
              </p>
            </div>

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
              {
                recentApplicants.length
              } Recent
            </div>
          </div>

          {recentApplicants.length ===
          0 ? (
            <div
              style={{
                color:
                  "#6b7280",
              }}
            >
              No recent applicants yet.
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",

                gap: "16px",
              }}
            >
              {recentApplicants.map(
                (
                  applicant
                ) => (
                  <div
                    key={
                      applicant.id
                    }
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      flexWrap:
                        "wrap",

                      gap: "12px",

                      background:
                        "#f9fafb",

                      padding:
                        "18px",

                      borderRadius:
                        "16px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight:
                            "bold",

                          color:
                            "#111827",

                          marginBottom:
                            "5px",
                        }}
                      >
                        {
                          applicant.name
                        }
                      </div>

                      <div
                        style={{
                          color:
                            "#6b7280",

                          fontSize:
                            "14px",
                        }}
                      >
                        Applied to{" "}
                        <strong>
                          {
                            applicant.jobTitle
                          }
                        </strong>
                      </div>
                    </div>

                    <div
                      style={{
                        background:
                          "#dcfce7",

                        color:
                          "#166534",

                        padding:
                          "8px 14px",

                        borderRadius:
                          "999px",

                        fontWeight:
                          "bold",

                        fontSize:
                          "13px",
                      }}
                    >
                      New Applicant
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* TOP PERFORMING JOBS */}

        <div
          style={{
            background:
              "white",

            borderRadius:
              "22px",

            padding:
              "28px",

            marginBottom:
              "35px",

            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
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
                "20px",

              flexWrap:
                "wrap",

              gap: "12px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,

                  color:
                    "#111827",
                }}
              >
                Top Performing Jobs
              </h2>

              <p
                style={{
                  color:
                    "#6b7280",

                  marginTop:
                    "6px",
                }}
              >
                Jobs attracting the highest applicant activity.
              </p>
            </div>

            <div
              style={{
                background:
                  "#fef3c7",

                color:
                  "#92400e",

                padding:
                  "8px 14px",

                borderRadius:
                  "999px",

                fontWeight:
                  "bold",
              }}
            >
              Top Insights
            </div>
          </div>

          {topPerformingJobs.length ===
          0 ? (
            <div
              style={{
                color:
                  "#6b7280",
              }}
            >
              No job analytics available yet.
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",

                gap: "16px",
              }}
            >
              {topPerformingJobs.map(
                (
                  job,
                  index
                ) => (
                  <div
                    key={job.id}
                    style={{
                      display:
                        "flex",

                      justifyContent:
                        "space-between",

                      alignItems:
                        "center",

                      flexWrap:
                        "wrap",

                      gap: "14px",

                      background:
                        "#f9fafb",

                      padding:
                        "18px",

                      borderRadius:
                        "16px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          width:
                            "42px",

                          height:
                            "42px",

                          borderRadius:
                            "12px",

                          background:
                            "#dbeafe",

                          display:
                            "flex",

                          justifyContent:
                            "center",

                          alignItems:
                            "center",

                          fontWeight:
                            "bold",

                          color:
                            "#1d4ed8",
                        }}
                      >
                        #{index + 1}
                      </div>

                      <div>
                        <div
                          style={{
                            fontWeight:
                              "bold",

                            color:
                              "#111827",

                            marginBottom:
                              "5px",
                          }}
                        >
                          {job.title}
                        </div>

                        <div
                          style={{
                            color:
                              "#6b7280",

                            fontSize:
                              "14px",
                          }}
                        >
                          {job.company}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background:
                          "#dcfce7",

                        color:
                          "#166534",

                        padding:
                          "10px 16px",

                        borderRadius:
                          "999px",

                        fontWeight:
                          "bold",
                      }}
                    >
                      👥 {job.applicantCount} Applicants
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

          {/* EMPTY */}

          {jobs.length === 0 ? (
            <div
              style={{
                background:
                  "white",

                padding:
                  "50px",

                borderRadius:
                  "22px",

                textAlign:
                  "center",

                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "15px",
                }}
              >
                No Jobs Posted
              </h2>

              <p
                style={{
                  color:
                    "#6b7280",

                  marginBottom:
                    "25px",
                }}
              >
                Start posting jobs to attract applicants.
              </p>

              <a href="/post-job">
                <button
                  style={{
                    background:
                      "#1c4ed8",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "14px 22px",

                    borderRadius:
                      "12px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  Post Your First Job
                </button>
              </a>
            </div>
          ) : (
            <div
              style={{
                display:
                  "grid",

                gap: "24px",
              }}
            >
              {jobs.map(
                (job) => (
                  <div
                    key={job.id}
                    style={{
                      background:
                        "white",

                      padding:
                        "30px",

                      borderRadius:
                        "22px",

                      boxShadow:
                        "0 4px 20px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "flex-start",

                        flexWrap:
                          "wrap",

                        gap: "20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: "12px",

                            marginBottom:
                              "14px",
                          }}
                        >
                          <div
                            style={{
                              width:
                                "55px",

                              height:
                                "55px",

                              borderRadius:
                                "14px",

                              background:
                                "#dbeafe",

                              display:
                                "flex",

                              justifyContent:
                                "center",

                              alignItems:
                                "center",

                              fontWeight:
                                "bold",

                              fontSize:
                                "22px",

                              color:
                                "#1c4ed8",
                            }}
                          >
                            {job.company?.charAt(
                              0
                            )}
                          </div>

                          <div>
                            <h2
                              style={{
                                margin: 0,

                                color:
                                  "#111827",

                                fontSize:
                                  "28px",
                              }}
                            >
                              {
                                job.title
                              }
                            </h2>

                            <p
                              style={{
                                margin:
                                  "4px 0 0 0",

                                color:
                                  "#6b7280",
                              }}
                            >
                              {
                                job.company
                              }
                            </p>
                          </div>
                        </div>

                        <div
                          style={{
                            display:
                              "flex",

                            gap: "14px",

                            flexWrap:
                              "wrap",

                            marginTop:
                              "15px",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "#f3f4f6",

                              padding:
                                "8px 14px",

                              borderRadius:
                                "999px",
                            }}
                          >
                            📍{" "}
                            {
                              job.location
                            }
                          </div>

                          <div
                            style={{
                              background:
                                "#dcfce7",

                              color:
                                "#166534",

                              padding:
                                "8px 14px",

                              borderRadius:
                                "999px",

                              fontWeight:
                                "bold",
                            }}
                          >
                            👥{" "}
                            {
                              job.applicantCount
                            } Applicants
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          background:
                            "#dbeafe",

                          color:
                            "#1c4ed8",

                          padding:
                            "10px 16px",

                          borderRadius:
                            "999px",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Active
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div
                      style={{
                        display:
                          "flex",

                        gap: "12px",

                        flexWrap:
                          "wrap",

                        marginTop:
                          "28px",
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
                              "12px 18px",

                            borderRadius:
                              "12px",

                            cursor:
                              "pointer",

                            fontWeight:
                              "bold",
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
                              "#16a34a",

                            color:
                              "white",

                            border:
                              "none",

                            padding:
                              "12px 18px",

                            borderRadius:
                              "12px",

                            cursor:
                              "pointer",

                            fontWeight:
                              "bold",
                          }}
                        >
                          View Applicants
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
                            "#ef4444",

                          color:
                            "white",

                          border:
                            "none",

                          padding:
                            "12px 18px",

                          borderRadius:
                            "12px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Delete Job
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  }