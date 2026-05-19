"use client";

import {
  useState,
  useEffect,
} from "react";

import { supabase } from "../lib/supabase";

export default function HomeClient({
  jobs,
}: {
  jobs: any[];
}) {
  const [user, setUser] =
    useState<any>(null);

  const [role, setRole] =
    useState("");

  const [displayJobs, setDisplayJobs] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    searchTitle,
    setSearchTitle,
  ] = useState("");

  const [
    searchLocation,
    setSearchLocation,
  ] = useState("");

  useEffect(() => {
    const getUser =
      async () => {
        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        setUser(user);

        if (user?.id) {
          const res =
            await fetch(
              `/api/profile?userId=${user.id}`
            );

          const profile =
            await res.json();

          setRole(
            profile.role
          );

          if (
            profile.role ===
            "employer"
          ) {
            const jobsRes =
              await fetch(
                `/api/jobs?userEmail=${user.email}`,
                {
                  cache:
                    "no-store",
                }
              );

            const employerJobs =
              await jobsRes.json();

            setDisplayJobs(
              employerJobs
            );

            setLoading(false);
          } else {
            setDisplayJobs(jobs);

            setLoading(false);
          }
        } else {
          setDisplayJobs(jobs);

          setLoading(false);
        }
      };

    getUser();
  }, [jobs]);

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

  const filteredJobs =
    displayJobs.filter(
      (job) => {
        return (
          job.title
            ?.toLowerCase()
            .includes(
              searchTitle.toLowerCase()
            ) &&
          job.location
            ?.toLowerCase()
            .includes(
              searchLocation.toLowerCase()
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
            "18px 40px",

          borderBottom:
            "1px solid #e5e7eb",

          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          position:
            "sticky",

          top: 0,

          zIndex: 100,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,

              color:
                "#1c4ed8",

              fontSize:
                "30px",

              fontWeight:
                "bold",
            }}
          >
            SearchEezy
          </h1>

          <p
            style={{
              margin: 0,

              color:
                "gray",

              fontSize:
                "14px",
            }}
          >
            Modern Hiring Platform
          </p>
        </div>

        <div>
          {user ? (
            <div>
              <p
                style={{
                  marginBottom:
                    "6px",

                  fontSize:
                    "14px",
                }}
              >
                {user.email}
              </p>

              <div
                style={{
                  display:
                    "flex",

                  gap: "10px",

                  flexWrap:
                    "wrap",
                }}
              >
                {role ===
                  "employer" && (
                  <>
                    <a href="/post-job">
                      <button
                        style={{
                          background:
                            "#16a34a",

                          color:
                            "white",

                          border:
                            "none",

                          padding:
                            "10px 16px",

                          borderRadius:
                            "8px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Post Job
                      </button>
                    </a>

                    <a href="/my-jobs">
                      <button
                        style={{
                          background:
                            "#1c4ed8",

                          color:
                            "white",

                          border:
                            "none",

                          padding:
                            "10px 16px",

                          borderRadius:
                            "8px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
                      >
                        My Jobs
                      </button>
                    </a>
                  </>
                )}

                {role ===
                  "applicant" && (
                  <a href="/my-applications">
                    <button
                      style={{
                        background:
                          "#16a34a",

                        color:
                          "white",

                        border:
                          "none",

                        padding:
                          "10px 16px",

                        borderRadius:
                          "8px",

                        cursor:
                          "pointer",

                        fontWeight:
                          "bold",
                      }}
                    >
                      My Applications
                    </button>
                  </a>
                )}

                <button
                  onClick={async () => {
                    await supabase.auth.signOut();

                    window.location.reload();
                  }}
                  style={{
                    background:
                      "#ef4444",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "8px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display:
                  "flex",

                gap: "12px",

                flexWrap:
                  "wrap",
              }}
            >
              <a href="/login">
                <button
                  style={{
                    background:
                      "#1c4ed8",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "8px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  Employer Login
                </button>
              </a>

              <a href="/signup">
                <button
                  style={{
                    background:
                      "#16a34a",

                    color:
                      "white",

                    border:
                      "none",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "8px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  Employer Signup
                </button>
              </a>

              <a href="/applicant-login">
                <button
                  style={{
                    background:
                      "white",

                    color:
                      "#1c4ed8",

                    border:
                      "1px solid #1c4ed8",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "8px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  Applicant Login
                </button>
              </a>

              <a href="/applicant-signup">
                <button
                  style={{
                    background:
                      "white",

                    color:
                      "#16a34a",

                    border:
                      "1px solid #16a34a",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "8px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  Applicant Signup
                </button>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* HERO */}

      <div
        style={{
          maxWidth:
            "1200px",

          margin:
            "50px auto 30px",

          padding:
            "0 20px",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(to right, #1c4ed8, #2563eb)",

            borderRadius:
              "24px",

            padding:
              "60px 40px",

            color:
              "white",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              fontSize:
                "48px",

              marginBottom:
                "15px",

              fontWeight:
                "bold",
            }}
          >
            Find Your Next Opportunity
          </h1>

          <p
            style={{
              fontSize:
                "20px",

              opacity: 0.95,

              maxWidth:
                "700px",

              lineHeight:
                "1.7",
            }}
          >
            SearchEezy helps
            employers connect
            with top talent and
            helps candidates
            discover meaningful
            careers.
          </p>
        </div>
      </div>

      {/* SEARCH */}

      <div
        style={{
          maxWidth:
            "1200px",

          margin:
            "0 auto 30px",

          padding:
            "0 20px",
        }}
      >
        <div
          style={{
            background:
              "white",

            padding:
              "25px",

            borderRadius:
              "20px",

            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",

            display:
              "flex",

            gap: "15px",

            flexWrap:
              "wrap",
          }}
        >
          <input
            placeholder="Job title or keyword"
            value={searchTitle}
            onChange={(e) =>
              setSearchTitle(
                e.target.value
              )
            }
            style={{
              flex: 1,

              minWidth:
                "250px",

              padding:
                "15px",

              borderRadius:
                "10px",

              border:
                "1px solid #ddd",

              fontSize:
                "16px",
            }}
          />

          <input
            placeholder="Location"
            value={
              searchLocation
            }
            onChange={(e) =>
              setSearchLocation(
                e.target.value
              )
            }
            style={{
              flex: 1,

              minWidth:
                "250px",

              padding:
                "15px",

              borderRadius:
                "10px",

              border:
                "1px solid #ddd",

              fontSize:
                "16px",
            }}
          />

          <button
            style={{
              background:
                "#1c4ed8",

              color:
                "white",

              border:
                "none",

              padding:
                "15px 24px",

              borderRadius:
                "10px",

              cursor:
                "pointer",

              fontWeight:
                "bold",

              fontSize:
                "16px",
            }}
          >
            Search Jobs
          </button>
        </div>
      </div>

      {/* JOB LIST */}

      <div
        style={{
          maxWidth:
            "1200px",

          margin:
            "0 auto",

          padding:
            "0 20px 50px",
        }}
      >
        {loading ? (
          <p
            style={{
              color:
                "gray",
            }}
          >
            Loading jobs...
          </p>
        ) : filteredJobs.length ===
          0 ? (
          <p
            style={{
              color:
                "gray",
            }}
          >
            No jobs found.
          </p>
        ) : null}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",

            gap: "22px",
          }}
        >
          {filteredJobs.map(
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

                  border:
                    "1px solid #edf2f7",
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
                      "18px",
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

                      color:
                        "#1c4ed8",

                      fontSize:
                        "22px",
                    }}
                  >
                    {job.company?.charAt(
                      0
                    )}
                  </div>

                  <div
                    style={{
                      background:
                        "#dcfce7",

                      color:
                        "#166534",

                      padding:
                        "6px 12px",

                      borderRadius:
                        "20px",

                      fontSize:
                        "13px",

                      fontWeight:
                        "bold",
                    }}
                  >
                    Active
                  </div>
                </div>

                <h2
                  style={{
                    marginBottom:
                      "10px",

                    fontSize:
                      "24px",

                    color:
                      "#111827",
                  }}
                >
                  {job.title}
                </h2>

                <p
                  style={{
                    marginBottom:
                      "18px",

                    color:
                      "#4b5563",

                    fontWeight:
                      "bold",
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
                      "#6b7280",

                    marginBottom:
                      "20px",
                  }}
                >
                  <p>
                    📍 {job.location}
                  </p>

                  {job.jobType && (
                    <p>
                      💼{" "}
                      {job.jobType}
                    </p>
                  )}
                </div>

                {job.salaryMin &&
                  job.salaryMax && (
                    <div
                      style={{
                        marginTop:
                          "20px",

                        paddingTop:
                          "18px",

                        borderTop:
                          "1px solid #eee",
                      }}
                    >
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
                        {" "}
                        {
                          job.salaryType
                        }
                      </p>
                    </div>
                  )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}