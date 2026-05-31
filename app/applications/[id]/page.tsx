"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function ApplicationsPage() {
  const params = useParams();

  const jobId = params.id;

  const [applications, setApplications] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications =
    async () => {
      try {

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (!user?.email) {
          alert(
            "Recruiter authorization required."
          );

          return;
        }

        const res = await fetch(
          `/api/applications?jobId=${jobId}&employerEmail=${user.email}`
        );

        const data =
          await res.json();

        if (
          !Array.isArray(
            data
          )
        ) {
          console.error(
            "Applications API Error:",
            data
          );

          setApplications(
            []
          );

          return;
        }

        setApplications(data);

      } catch (error) {
        console.error(error);

        setApplications(
          []
        );

      } finally {
        setLoading(false);
      }
    };

  const updateStatus =
    async (
      applicationId: number,
      status: string
    ) => {
      try {
        const res = await fetch(
          "/api/applications/status",
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id: applicationId,

              status,
            }),
          }
        );

        if (!res.ok) {
          alert(
            "Failed to update status"
          );

          return;
        }

        setApplications(
          applications.map(
            (app) =>
              app.id ===
              applicationId
                ? {
                    ...app,
                    status,
                  }
                : app
          )
        );
      } catch (error) {
        console.error(error);

        alert(
          "Status update failed"
        );
      }
    };

  const getStatusStyle =
    (status: string) => {
      switch (status) {
        case "Applied":
          return {
            background:
              "#dbeafe",
            color:
              "#1d4ed8",
          };

        case "Reviewing":
          return {
            background:
              "#fef3c7",
            color:
              "#b45309",
          };

        case "Interview":
          return {
            background:
              "#ede9fe",
            color:
              "#7c3aed",
          };

        case "Rejected":
          return {
            background:
              "#fee2e2",
            color:
              "#dc2626",
          };

        case "Hired":
          return {
            background:
              "#dcfce7",
            color:
              "#15803d",
          };

        default:
          return {
            background:
              "#f3f4f6",
            color:
              "#374151",
          };
      }
    };

  const renderAnswers = (
    answers: string
  ) => {
    if (!answers) {
      return (
        <p>
          No screening answers
          provided.
        </p>
      );
    }

    try {
      const parsed =
        JSON.parse(answers);

      return Object.entries(
        parsed
      ).map(
        (
          [question, answer]: any,
          index
        ) => (
          <div
            key={index}
            style={{
              background:
                "#f9fafb",

              padding: "15px",

              borderRadius:
                "10px",

              marginBottom:
                "14px",

              border:
                "1px solid #e5e7eb",
            }}
          >
            <p
              style={{
                fontWeight:
                  "bold",

                marginBottom:
                  "8px",
              }}
            >
              {question}
            </p>

            <p
              style={{
                whiteSpace:
                  "pre-wrap",
              }}
            >
              {String(answer)}
            </p>
          </div>
        )
      );
    } catch {
      return (
        <p>
          Failed to load
          answers
        </p>
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
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
          "#f3f4f6",

        minHeight:
          "100vh",

        padding:
          "30px",
      }}
    >
      <div
        style={{
          maxWidth:
            "1000px",

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

            flexWrap:
              "wrap",

            gap: "15px",

            marginBottom:
              "30px",
          }}
        >
          <div>
            <h1
              style={{
                color:
                  "#1d4ed8",

                marginBottom:
                  "6px",
              }}
            >
              Job Applicants
            </h1>

            <p
              style={{
                color:
                  "#6b7280",
              }}
            >
              ATS-style hiring
              workflow dashboard
            </p>
          </div>

          <a href="/my-jobs">
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

                fontWeight:
                  "bold",
              }}
            >
              ← Back to My Jobs
            </button>
          </a>
        </div>

        {applications.length ===
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
              No applications
              yet.
            </h2>
          </div>
        ) : (
          applications.map(
            (app) => (
              <div
                key={app.id}
                style={{
                  background:
                    "white",

                  padding:
                    "30px",

                  borderRadius:
                    "20px",

                  marginBottom:
                    "28px",

                  boxShadow:
                    "0 4px 18px rgba(0,0,0,0.05)",

                  border:
                    "1px solid #e5e7eb",
                }}
              >
                {/* TOP SECTION */}

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

                    gap: "25px",
                  }}
                >
                  {/* LEFT */}

                  <div>
                    <h2
                      style={{
                        marginBottom:
                          "10px",
                      }}
                    >
                      {app.name}
                    </h2>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {app.email}
                    </p>

                    {/* STATUS BADGE */}

                    <div
                      style={{
                        marginTop:
                          "16px",
                      }}
                    >
                      <span
                        style={{
                          ...getStatusStyle(
                            app.status ||
                              "Applied"
                          ),

                          padding:
                            "8px 16px",

                          borderRadius:
                            "999px",

                          fontWeight:
                            "bold",

                          fontSize:
                            "14px",

                          display:
                            "inline-block",
                        }}
                      >
                        {app.status ||
                          "Applied"}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div>
                    <label
                      style={{
                        display:
                          "block",

                        marginBottom:
                          "10px",

                        fontWeight:
                          "bold",

                        color:
                          "#374151",
                      }}
                    >
                      Application Status
                    </label>

                    <select
                      value={
                        app.status ||
                        "Applied"
                      }
                      onChange={(e) =>
                        updateStatus(
                          app.id,
                          e.target.value
                        )
                      }
                      style={{
                        padding:
                          "12px 14px",

                        borderRadius:
                          "10px",

                        border:
                          "1px solid #d1d5db",

                        fontWeight:
                          "bold",

                        background:
                          "white",

                        minWidth:
                          "190px",
                      }}
                    >
                      <option>
                        Applied
                      </option>

                      <option>
                        Reviewing
                      </option>

                      <option>
                        Interview
                      </option>

                      <option>
                        Rejected
                      </option>

                      <option>
                        Hired
                      </option>
                    </select>
                  </div>
                </div>

                {/* RESUME */}

                <div
                  style={{
                    marginTop:
                      "28px",
                  }}
                >
                  <strong>
                    Resume:
                  </strong>{" "}

                  {app.resumeLink ? (
                    <a
                      href={
                        app.resumeLink
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color:
                          "#1d4ed8",

                        fontWeight:
                          "bold",
                      }}
                    >
                      View Resume
                    </a>
                  ) : (
                    "No resume uploaded"
                  )}
                </div>

                {/* COVER LETTER */}

                <div
                  style={{
                    marginTop:
                      "28px",
                  }}
                >
                  <h3>
                    Cover Letter
                  </h3>

                  <div
                    style={{
                      background:
                        "#f9fafb",

                      padding:
                        "18px",

                      borderRadius:
                        "12px",

                      border:
                        "1px solid #e5e7eb",

                      marginTop:
                        "12px",

                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {app.coverLetter ||
                      "No cover letter provided."}
                  </div>
                </div>

                {/* SCREENING ANSWERS */}

                <div
                  style={{
                    marginTop:
                      "28px",
                  }}
                >
                  <h3>
                    Screening
                    Answers
                  </h3>

                  <div
                    style={{
                      marginTop:
                        "14px",
                    }}
                  >
                    {renderAnswers(
                      app.screeningAnswers
                    )}
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}