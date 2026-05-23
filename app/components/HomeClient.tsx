"use client";

import {
  useEffect,
  useState,
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

  const [savedJobs, setSavedJobs] =
    useState<number[]>([]);

  const [
    searchTitle,
    setSearchTitle,
  ] = useState("");

  const [
    searchLocation,
    setSearchLocation,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

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
            "applicant"
          ) {
            const {
              data: savedData,
            } =
              await supabase
                .from(
                  "saved_jobs"
                )
                .select(
                  "jobId"
                )
                .eq(
                  "userEmail",
                  user.email
                );

            if (
              savedData
            ) {
              setSavedJobs(
                savedData.map(
                  (
                    item
                  ) =>
                    item.jobId
                )
              );
            }
          }

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
          } else {
            setDisplayJobs(jobs);
          }
        } else {
          setDisplayJobs(jobs);
        }

        setLoading(false);
      };

    getUser();
  }, [jobs]);

  const toggleSaveJob =
    async (
      jobId: number,
      e: any
    ) => {
      e.stopPropagation();

      if (!user) {
        alert(
          "Please login as applicant"
        );

        return;
      }

      const alreadySaved =
        savedJobs.includes(
          jobId
        );

      if (
        alreadySaved
      ) {
        await supabase
          .from(
            "saved_jobs"
          )
          .delete()
          .eq(
            "userEmail",
            user.email
          )
          .eq(
            "jobId",
            jobId
          );

        setSavedJobs(
          savedJobs.filter(
            (id) =>
              id !==
              jobId
          )
        );
      } else {
        await supabase
          .from(
            "saved_jobs"
          )
          .insert([
            {
              userEmail:
                user.email,
              jobId,
            },
          ]);

        setSavedJobs([
          ...savedJobs,
          jobId,
        ]);
      }
    };

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

  const categories = [
    "All",

    ...Array.from(
      new Set(
        displayJobs
          .map(
            (job) =>
              job.category
          )
          .filter(Boolean)
      )
    ),
  ];

  const filteredJobs =
    displayJobs.filter(
      (job) => {
        const searchValue =
          searchTitle.toLowerCase();

        const matchesTitle =
          job.title
            ?.toLowerCase()
            .includes(
              searchValue
            ) ||
          job.company
            ?.toLowerCase()
            .includes(
              searchValue
            );

        const matchesLocation =
          job.location
            ?.toLowerCase()
            .includes(
              searchLocation.toLowerCase()
            );

        const matchesCategory =
          selectedCategory ===
            "All" ||
          job.category ===
            selectedCategory;

        return (
          matchesTitle &&
          matchesLocation &&
          matchesCategory
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
              <div
                style={{
                  marginBottom:
                    "8px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "10px",
                  flexWrap:
                    "wrap",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize:
                      "14px",
                  }}
                >
                  {user.email}
                </p>

                {role && (
                  <div
                    style={{
                      background:
                        role ===
                        "employer"
                          ? "#dbeafe"
                          : "#dcfce7",
                      color:
                        role ===
                        "employer"
                          ? "#1d4ed8"
                          : "#15803d",
                      padding:
                        "4px 10px",
                      borderRadius:
                        "999px",
                      fontSize:
                        "12px",
                      fontWeight:
                        "bold",
                      textTransform:
                        "capitalize",
                    }}
                  >
                    {role}
                  </div>
                )}
              </div>

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
                gap: "10px",
                flexWrap:
                  "wrap",
              }}
            >
              <a href="/signup">
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
                  Employer Signup
                </button>
              </a>

              <a href="/login">
                <button
                  style={{
                    background:
                      "#2563eb",
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

              <a href="/applicant-signup">
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
                  Applicant Signup
                </button>
              </a>

              <a href="/applicant-login">
                <button
                  style={{
                    background:
                      "#059669",
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
                  Applicant Login
                </button>
              </a>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "30px auto",
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
          }}
        >
          <div
            style={{
              display:
                "flex",
              gap: "15px",
              flexWrap:
                "wrap",
              marginBottom:
                "20px",
            }}
          >
            <input
              placeholder="Search jobs, skills, companies..."
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
              placeholder="Search by location"
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
          </div>

          <div
            style={{
              marginBottom:
                "18px",
              color:
                "#6b7280",
              fontWeight:
                "bold",
            }}
          >
            {filteredJobs.length}
            {" "}
            jobs found
          </div>

          <div
            style={{
              display:
                "flex",
              gap: "10px",
              flexWrap:
                "wrap",
            }}
          >
            {categories.map(
              (category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                  style={{
                    background:
                      selectedCategory ===
                      category
                        ? "#1c4ed8"
                        : "white",
                    color:
                      selectedCategory ===
                      category
                        ? "white"
                        : "#1c4ed8",
                    border:
                      "1px solid #1c4ed8",
                    padding:
                      "10px 16px",
                    borderRadius:
                      "999px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "bold",
                  }}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>
      </div>

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
          <div
            style={{
              textAlign:
                "center",
              padding:
                "60px",
            }}
          >
            Loading jobs...
          </div>
        ) : filteredJobs.length ===
          0 ? (
          <div
            style={{
              background:
                "white",
              padding:
                "50px",
              borderRadius:
                "20px",
              textAlign:
                "center",
            }}
          >
            <h2>No jobs found</h2>

            <p>
              Try different search
              filters.
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
                      alignItems:
                        "center",
                      gap: "15px",
                      marginBottom:
                        "15px",
                    }}
                  >
                    {job.companyLogo && (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        style={{
                          width: "55px",
                          height:
                            "55px",
                          objectFit:
                            "contain",
                          borderRadius:
                            "12px",
                          background:
                            "white",
                          border:
                            "1px solid #e5e7eb",
                          padding:
                            "6px",
                        }}
                      />
                    )}

                    <div>
                      <h2
                        style={{
                          margin: 0,
                        }}
                      >
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
                          marginTop:
                            "8px",
                        }}
                      >
                        <a
                          href={`/company/${job.company
                            .toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            )}`}
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          style={{
                            textDecoration:
                              "none",
                            color:
                              "#1d4ed8",
                            fontWeight:
                              "bold",
                          }}
                        >
                          {job.company}
                        </a>

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
                    </div>
                  </div>

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

                  {job.category && (
                    <a
                      href={`/jobs/category/${job.category
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        )}`}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                      style={{
                        textDecoration:
                          "none",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "inline-block",
                          background:
                            "#eff6ff",
                          color:
                            "#1d4ed8",
                          padding:
                            "6px 12px",
                          borderRadius:
                            "20px",
                          fontSize:
                            "13px",
                          fontWeight:
                            "bold",
                          marginTop:
                            "10px",
                        }}
                      >
                        {
                          job.category
                        }
                      </div>
                    </a>
                  )}

                  {role ===
                    "applicant" && (
                    <button
                      onClick={(e) =>
                        toggleSaveJob(
                          job.id,
                          e
                        )
                      }
                      style={{
                        marginTop:
                          "18px",
                        background:
                          savedJobs.includes(
                            job.id
                          )
                            ? "#fee2e2"
                            : "#eff6ff",
                        color:
                          savedJobs.includes(
                            job.id
                          )
                            ? "#dc2626"
                            : "#1d4ed8",
                        border:
                          "none",
                        padding:
                          "10px 14px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                      }}
                    >
                      {savedJobs.includes(
                        job.id
                      )
                        ? "❤️ Saved"
                        : "🤍 Save Job"}
                    </button>
                  )}

                  {job.salaryMin &&
                    job.salaryMax && (
                      <p
                        style={{
                          marginTop:
                            "20px",
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
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}