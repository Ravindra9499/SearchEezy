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

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
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
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "20px",
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
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back to My Jobs
            </button>
          </a>
        </div>

        {applications.length === 0 ? (
          <p>
            No applications yet.
          </p>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              style={{
                background:
                  "white",
                padding: "20px",
                borderRadius:
                  "10px",
                marginBottom:
                  "15px",
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

              <p>
                <strong>
                  Resume:
                </strong>{" "}
                <a
                  href={
                    app.resumeLink
                  }
                  target="_blank"
                >
                  View Resume
                </a>
              </p>

              <p>
                <strong>
                  Cover Letter:
                </strong>
              </p>

              <p>
                {
                  app.coverLetter
                }
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}