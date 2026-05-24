"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function ResumeSearchPage() {
  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [
    applications,
    setApplications,
  ] = useState<any[]>([]);

  const [
    filteredApplications,
    setFilteredApplications,
  ] = useState<any[]>([]);

  const [keyword, setKeyword] =
    useState("");

  const [location, setLocation] =
    useState("");

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    filterResults();
  }, [
    keyword,
    location,
    applications,
  ]);

  const checkAccess =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        window.location.href =
          "/login";

        return;
      }

      const res =
        await fetch(
          `/api/profile?userId=${user.id}`
        );

      const profile =
        await res.json();

      if (
        !profile.resumeSearchEnabled
      ) {
        alert(
          "Resume search is only available for premium recruiters."
        );

        window.location.href =
          "/";

        return;
      }

      setAuthorized(
        true
      );

      await loadApplications();

      setLoading(false);
    };

  const loadApplications =
    async () => {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "applications"
          )
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      if (!error && data) {
        setApplications(data);

        setFilteredApplications(
          data
        );
      }
    };

  const filterResults =
    () => {
      let filtered =
        applications;

      if (keyword) {
        filtered =
          filtered.filter(
            (app) =>
              app.name
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||
              app.email
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||
              app.jobTitle
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||
              app.coverLetter
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                )
          );
      }

      if (location) {
        filtered =
          filtered.filter(
            (app) =>
              app.location
                ?.toLowerCase()
                .includes(
                  location.toLowerCase()
                )
          );
      }

      setFilteredApplications(
        filtered
      );
    };

  if (loading) {
    return (
      <div
        style={{
          padding:
            "50px",
        }}
      >
        Loading resume database...
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div
      style={{
        background:
          "#f5f7fb",
        minHeight:
          "100vh",
        padding:
          "40px",
        fontFamily:
          "Arial",
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
        {/* HEADER */}

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
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color:
                  "#111827",
              }}
            >
              Resume Search
            </h1>

            <p
              style={{
                color:
                  "#6b7280",
              }}
            >
              Premium recruiter candidate database.
            </p>
          </div>

          <a href="/">
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
                  "10px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              ← Back to Home
            </button>
          </a>
        </div>

        {/* SEARCH BAR */}

        <div
          style={{
            background:
              "white",
            padding:
              "25px",
            borderRadius:
              "18px",
            marginBottom:
              "30px",
            display:
              "flex",
            gap: "15px",
            flexWrap:
              "wrap",
          }}
        >
          <input
            placeholder="Search skills, name, title..."
            value={keyword}
            onChange={(e) =>
              setKeyword(
                e.target.value
              )
            }
            style={{
              flex: 1,
              minWidth:
                "280px",
              padding:
                "15px",
              border:
                "1px solid #ddd",
              borderRadius:
                "10px",
              fontSize:
                "15px",
            }}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(
                e.target.value
              )
            }
            style={{
              flex: 1,
              minWidth:
                "280px",
              padding:
                "15px",
              border:
                "1px solid #ddd",
              borderRadius:
                "10px",
              fontSize:
                "15px",
            }}
          />
        </div>

        {/* RESULTS */}

        <div
          style={{
            marginBottom:
              "20px",
            fontWeight:
              "bold",
            color:
              "#6b7280",
          }}
        >
          {
            filteredApplications.length
          }
          {" "}
          candidate profiles found
        </div>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredApplications.map(
            (
              application
            ) => (
              <div
                key={
                  application.id
                }
                style={{
                  background:
                    "white",
                  borderRadius:
                    "18px",
                  padding:
                    "25px",
                  boxShadow:
                    "0 4px 18px rgba(0,0,0,0.05)",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                  }}
                >
                  {
                    application.name
                  }
                </h2>

                <p>
                  📧{" "}
                  {
                    application.email
                  }
                </p>

                {application.jobTitle && (
                  <p>
                    💼{" "}
                    {
                      application.jobTitle
                    }
                  </p>
                )}

                {application.location && (
                  <p>
                    📍{" "}
                    {
                      application.location
                    }
                  </p>
                )}

                {application.status && (
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
                        "999px",
                      fontWeight:
                        "bold",
                      fontSize:
                        "13px",
                      marginTop:
                        "8px",
                    }}
                  >
                    {
                      application.status
                    }
                  </div>
                )}

                {application.coverLetter && (
                  <div
                    style={{
                      marginTop:
                        "20px",
                    }}
                  >
                    <h4>
                      Cover Letter
                    </h4>

                    <div
                      style={{
                        background:
                          "#f9fafb",
                        padding:
                          "14px",
                        borderRadius:
                          "10px",
                        maxHeight:
                          "120px",
                        overflow:
                          "auto",
                        fontSize:
                          "14px",
                        color:
                          "#374151",
                      }}
                    >
                      {
                        application.coverLetter
                      }
                    </div>
                  </div>
                )}

                {application.resume && (
                  <a
                    href={
                      application.resume
                    }
                    target="_blank"
                  >
                    <button
                      style={{
                        marginTop:
                          "20px",
                        background:
                          "#16a34a",
                        color:
                          "white",
                        border:
                          "none",
                        padding:
                          "12px 16px",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold",
                        width:
                          "100%",
                      }}
                    >
                      View Resume
                    </button>
                  </a>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}