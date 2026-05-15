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

        // Fetch profile role

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
        }
      };

    getUser();
  }, []);

  const filteredJobs =
    jobs.filter((job) => {
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
    });

  return (
    <div
      style={{
        background:
          "#f3f2f1",

        minHeight:
          "100vh",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background:
            "white",

          padding:
            "15px 30px",

          borderBottom:
            "1px solid #ddd",

          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",
        }}
      >
        <h2
          style={{
            margin: 0,

            color:
              "#1c4ed8",

            fontWeight:
              "bold",
          }}
        >
          SearchEezy Jobs
        </h2>

        <div>
          {user ? (
            <div>
              <p
                style={{
                  marginBottom:
                    "10px",
                }}
              >
                Logged in as:
                {" "}
                {user.email}
              </p>

              <p
                style={{
                  color:
                    "gray",

                  marginBottom:
                    "10px",
                }}
              >
                Role: {role}
              </p>

              <div
                style={{
                  display:
                    "flex",

                  gap: "10px",
                }}
              >
                {/* Employer UI */}

                {role ===
                  "employer" && (
                  <a href="/my-jobs">
                    <button
                      style={{
                        padding:
                          "6px 10px",

                        background:
                          "#1c4ed8",

                        color:
                          "white",

                        border:
                          "none",

                        borderRadius:
                          "5px",

                        cursor:
                          "pointer",
                      }}
                    >
                      My Jobs
                    </button>
                  </a>
                )}

                {/* Applicant UI */}

                {role ===
                  "applicant" && (
                  <button
                    style={{
                      padding:
                        "6px 10px",

                      background:
                        "#16a34a",

                      color:
                        "white",

                      border:
                        "none",

                      borderRadius:
                        "5px",
                    }}
                  >
                    Applicant
                  </button>
                )}

                <button
                  onClick={async () => {
                    await supabase.auth.signOut();

                    window.location.reload();
                  }}
                  style={{
                    padding:
                      "6px 10px",

                    background:
                      "red",

                    color:
                      "white",

                    border:
                      "none",

                    borderRadius:
                      "5px",

                    cursor:
                      "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <a
                href="/login"
                style={{
                  marginRight:
                    "10px",
                }}
              >
                Employer Login
              </a>

              <a
                href="/applicant-login"
                style={{
                  marginRight:
                    "10px",
                }}
              >
                Applicant Login
              </a>

              <a href="/signup">
                Employer Signup
              </a>
            </>
          )}
        </div>
      </div>

      {/* SEARCH BAR */}

      <div
        style={{
          background:
            "white",

          padding:
            "20px",

          borderBottom:
            "1px solid #ddd",
        }}
      >
        <div
          style={{
            maxWidth:
              "900px",

            margin:
              "0 auto",

            display:
              "flex",

            gap: "10px",
          }}
        >
          <input
            placeholder="Job title, keywords"
            value={searchTitle}
            onChange={(e) =>
              setSearchTitle(
                e.target.value
              )
            }
            style={{
              flex: 1,

              padding:
                "10px",
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

              padding:
                "10px",
            }}
          />

          <button
            style={{
              background:
                "#1c4ed8",

              color:
                "white",

              padding:
                "10px 20px",

              border:
                "none",

              borderRadius:
                "5px",

              fontWeight:
                "bold",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div
        style={{
          display:
            "flex",

          maxWidth:
            "1100px",

          margin:
            "20px auto",
        }}
      >
        {/* JOB LIST */}

        <div
          style={{
            flex: 1,
          }}
        >
          {filteredJobs.length ===
            0 && (
            <p
              style={{
                color:
                  "gray",
              }}
            >
              No jobs found.
            </p>
          )}

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

                  padding:
                    "20px",

                  marginBottom:
                    "15px",

                  border:
                    "1px solid #ddd",

                  borderRadius:
                    "10px",

                  cursor:
                    "pointer",
                }}
              >
                <h3
                  style={{
                    margin:
                      "0 0 5px",

                    color:
                      "#1c4ed8",
                  }}
                >
                  {job.title}
                </h3>

                <p
                  style={{
                    margin: 0,

                    fontWeight:
                      "bold",
                  }}
                >
                  {job.company}
                </p>

                <p
                  style={{
                    margin:
                      "5px 0",

                    color:
                      "gray",
                  }}
                >
                  📍{" "}
                  {job.location}
                </p>
              </div>
            )
          )}
        </div>

        {/* RIGHT PANEL */}

        <div
          style={{
            width:
              "300px",

            marginLeft:
              "20px",
          }}
        >
          <div
            style={{
              background:
                "white",

              padding:
                "20px",

              borderRadius:
                "10px",

              border:
                "1px solid #ddd",
            }}
          >
            <h3
              style={{
                marginTop: 0,
              }}
            >
              Actions
            </h3>

            {/* Employer Actions */}

            {role ===
              "employer" && (
              <>
                <p>
                  Ready to hire?
                </p>

                <a href="/post-job">
                  <button
                    style={{
                      width:
                        "100%",

                      padding:
                        "14px",

                      background:
                        "#1c4ed8",

                      color:
                        "white",

                      border:
                        "none",

                      borderRadius:
                        "8px",

                      fontWeight:
                        "bold",

                      cursor:
                        "pointer",
                    }}
                  >
                    + Post a Job
                  </button>
                </a>
              </>
            )}

            {/* Applicant Actions */}

            {role ===
              "applicant" && (
              <>
                <p>
                  Apply to jobs
                  easily.
                </p>

                <button
                  style={{
                    width:
                      "100%",

                    padding:
                      "14px",

                    background:
                      "#16a34a",

                    color:
                      "white",

                    border:
                      "none",

                    borderRadius:
                      "8px",

                    fontWeight:
                      "bold",
                  }}
                >
                  Applicant Mode
                </button>
              </>
            )}

            {/* Logged Out */}

            {!user && (
              <>
                <p>
                  Login to
                  continue.
                </p>

                <a href="/login">
                  <button
                    style={{
                      width:
                        "100%",

                      padding:
                        "12px",

                      background:
                        "#1c4ed8",

                      color:
                        "white",

                      border:
                        "none",

                      borderRadius:
                        "8px",

                      cursor:
                        "pointer",
                    }}
                  >
                    Login
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}