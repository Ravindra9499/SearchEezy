"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function MyApplicationsPage() {
  const [
    applications,
    setApplications,
  ] = useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);

      if (user?.email) {
        fetchApplications(
          user.email
        );
      } else {
        setLoading(false);
      }
    };

  const fetchApplications =
    async (
      email: string
    ) => {
      try {
        const res =
          await fetch(
            `/api/applications?email=${email}`
          );

        const data =
          await res.json();

        setApplications(
          data
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div
        style={{
          padding:
            "30px",
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
          "30px 20px",
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
                color:
                  "#16a34a",

                marginBottom:
                  "6px",
              }}
            >
              My Applications
            </h1>

            <p
              style={{
                color:
                  "#6b7280",
              }}
            >
              Track your hiring
              progress and
              application status.
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

        {/* Not logged in */}

        {!user && (
          <div
            style={{
              background:
                "white",

              padding:
                "35px",

              borderRadius:
                "18px",

              border:
                "1px solid #ddd",
            }}
          >
            <p
              style={{
                color:
                  "gray",

                margin: 0,
              }}
            >
              Please login to
              view your
              applications.
            </p>
          </div>
        )}

        {/* Empty State */}

        {user &&
          applications.length ===
            0 && (
            <div
              style={{
                background:
                  "white",

                padding:
                  "35px",

                borderRadius:
                  "18px",

                border:
                  "1px solid #ddd",
              }}
            >
              <p
                style={{
                  color:
                    "gray",

                  margin: 0,
                }}
              >
                No applications
                found.
              </p>
            </div>
          )}

        {/* Applications */}

        {applications.map(
          (app) => (
            <div
              key={app.id}
              style={{
                background:
                  "white",

                padding:
                  "28px",

                borderRadius:
                  "20px",

                border:
                  "1px solid #e5e7eb",

                marginBottom:
                  "24px",

                boxShadow:
                  "0 4px 18px rgba(0,0,0,0.05)",
              }}
            >
              {/* TOP */}

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
                  <h2
                    style={{
                      color:
                        "#1c4ed8",

                      marginBottom:
                        "10px",
                    }}
                  >
                    {app.jobTitle ||
                      "Job"}
                  </h2>

                  <p>
                    <strong>
                      Applicant:
                    </strong>{" "}
                    {app.name}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {app.email}
                  </p>

                  <p>
                    <strong>
                      Applied:
                    </strong>{" "}
                    {new Date(
                      app.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                {/* STATUS BADGE */}

                <div>
                  <div
                    style={{
                      marginBottom:
                        "10px",

                      fontWeight:
                        "bold",

                      color:
                        "#374151",
                    }}
                  >
                    Application Status
                  </div>

                  <span
                    style={{
                      ...getStatusStyle(
                        app.status ||
                          "Applied"
                      ),

                      padding:
                        "10px 18px",

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

              {/* RESUME */}

              {app.resumeLink && (
                <div
                  style={{
                    marginTop:
                      "24px",
                  }}
                >
                  <a
                    href={
                      app.resumeLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
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
                          "10px",

                        cursor:
                          "pointer",

                        fontWeight:
                          "bold",
                      }}
                    >
                      View Resume
                    </button>
                  </a>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}