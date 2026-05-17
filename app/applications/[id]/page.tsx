"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

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
        const res = await fetch(
          `/api/applications?jobId=${jobId}`
        );

        const data =
          await res.json();

        setApplications(data);
      } catch (error) {
        console.error(error);
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
                "8px",

              marginBottom:
                "12px",

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
          padding: "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f3f2f1",

        minHeight: "100vh",

        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",

          margin: "0 auto",
        }}
      >
        {/* Header */}

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom:
              "20px",

            flexWrap: "wrap",

            gap: "10px",
          }}
        >
          <h1
            style={{
              color: "#1c4ed8",
            }}
          >
            Job Applicants
          </h1>

          <a href="/my-jobs">
            <button
              style={{
                background:
                  "#1c4ed8",

                color: "white",

                border: "none",

                padding:
                  "10px 15px",

                borderRadius:
                  "5px",

                cursor:
                  "pointer",

                fontWeight:
                  "bold",
              }}
            >
              Back to My Jobs
            </button>
          </a>
        </div>

        {applications.length ===
        0 ? (
          <p>
            No applications
            yet.
          </p>
        ) : (
          applications.map(
            (app) => (
              <div
                key={app.id}
                style={{
                  background:
                    "white",

                  padding:
                    "25px",

                  borderRadius:
                    "12px",

                  marginBottom:
                    "20px",

                  border:
                    "1px solid #ddd",
                }}
              >
                {/* Applicant Header */}

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
                  }}
                >
                  <div>
                    <h2>
                      {app.name}
                    </h2>

                    <p>
                      <strong>
                        Email:
                      </strong>{" "}
                      {app.email}
                    </p>
                  </div>

                  {/* Status Dropdown */}

                  <div>
                    <label
                      style={{
                        display:
                          "block",

                        marginBottom:
                          "6px",

                        fontWeight:
                          "bold",
                      }}
                    >
                      Application
                      Status
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
                          "10px",

                        borderRadius:
                          "8px",

                        border:
                          "1px solid #ccc",

                        fontWeight:
                          "bold",
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

                {/* Resume */}

                <div
                  style={{
                    marginTop:
                      "20px",
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
                    >
                      View Resume
                    </a>
                  ) : (
                    "No resume uploaded"
                  )}
                </div>

                {/* Cover Letter */}

                <div
                  style={{
                    marginTop:
                      "20px",
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
                        "15px",

                      borderRadius:
                        "8px",

                      border:
                        "1px solid #e5e7eb",

                      marginTop:
                        "10px",

                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {app.coverLetter ||
                      "No cover letter provided."}
                  </div>
                </div>

                {/* Screening Answers */}

                <div
                  style={{
                    marginTop:
                      "20px",
                  }}
                >
                  <h3>
                    Screening
                    Answers
                  </h3>

                  <div
                    style={{
                      marginTop:
                        "10px",
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