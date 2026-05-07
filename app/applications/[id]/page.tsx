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
      const res = await fetch(
        `/api/applications?jobId=${jobId}`
      );

      const data =
        await res.json();

      setApplications(data);

      setLoading(false);
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
        <h1
          style={{
            color: "#1c4ed8",
          }}
        >
          Job Applicants
        </h1>

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
                <h2>
                  {app.name}
                </h2>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {app.email}
                </p>

                <div
                  style={{
                    marginTop:
                      "15px",
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

                <div
                  style={{
                    marginTop:
                      "20px",
                  }}
                >
                  <h3>
                    Screening Answers
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