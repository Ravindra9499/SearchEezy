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

  // JOB ALERTS

  const [alerts, setAlerts] =
    useState<any[]>([]);

  const [keyword, setKeyword] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [savingAlert, setSavingAlert] =
    useState(false);

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

        fetchAlerts(
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

  // FETCH ALERTS

  const fetchAlerts =
    async (
      email: string
    ) => {
      const {
        data,
      } =
        await supabase
          .from(
            "job_alerts"
          )
          .select("*")
          .eq(
            "userEmail",
            email
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      if (data) {
        setAlerts(data);
      }
    };

  // SAVE ALERT

  const saveAlert =
    async () => {
      if (
        !keyword.trim()
      ) {
        alert(
          "Please enter keyword"
        );

        return;
      }

      if (!user?.email) {
        return;
      }

      try {
        setSavingAlert(true);

        const {
          error,
        } =
          await supabase
            .from(
              "job_alerts"
            )
            .insert([
              {
                userEmail:
                  user.email,
                keyword,
                location,
              },
            ]);

        if (error) {
          console.error(
            error
          );

          alert(
            "Failed to create alert"
          );

          return;
        }

        setKeyword("");
        setLocation("");

        fetchAlerts(
          user.email
        );

        alert(
          "Job alert created successfully"
        );
      } catch (error) {
        console.error(
          error
        );
      } finally {
        setSavingAlert(false);
      }
    };

  // DELETE ALERT

  const deleteAlert =
    async (
      id: number
    ) => {
      await supabase
        .from(
          "job_alerts"
        )
        .delete()
        .eq("id", id);

      fetchAlerts(
        user.email
      );
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
              manage your job
              alerts.
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

        {/* JOB ALERTS SECTION */}

        {user && (
          <div
            style={{
              background:
                "white",

              padding:
                "30px",

              borderRadius:
                "20px",

              border:
                "1px solid #e5e7eb",

              marginBottom:
                "35px",

              boxShadow:
                "0 4px 18px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color:
                  "#7c3aed",
              }}
            >
              🔔 Job Alerts
            </h2>

            <p
              style={{
                color:
                  "#6b7280",

                marginBottom:
                  "24px",
              }}
            >
              Create alerts and
              get notified when
              matching jobs are
              posted.
            </p>

            {/* FORM */}

            <div
              style={{
                display:
                  "flex",

                gap: "14px",

                flexWrap:
                  "wrap",

                marginBottom:
                  "24px",
              }}
            >
              <input
                placeholder="Keyword (Software Engineer)"
                value={keyword}
                onChange={(e) =>
                  setKeyword(
                    e.target.value
                  )
                }
                style={{
                  flex: 1,

                  minWidth:
                    "240px",

                  padding:
                    "14px",

                  border:
                    "1px solid #ddd",

                  borderRadius:
                    "10px",

                  fontSize:
                    "15px",
                }}
              />

              <input
                placeholder="Location (Optional)"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                style={{
                  flex: 1,

                  minWidth:
                    "240px",

                  padding:
                    "14px",

                  border:
                    "1px solid #ddd",

                  borderRadius:
                    "10px",

                  fontSize:
                    "15px",
                }}
              />

              <button
                onClick={
                  saveAlert
                }
                disabled={
                  savingAlert
                }
                style={{
                  background:
                    "#7c3aed",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "14px 20px",

                  borderRadius:
                    "10px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                {savingAlert
                  ? "Saving..."
                  : "Create Alert"}
              </button>
            </div>

            {/* ALERTS */}

            {alerts.length ===
            0 ? (
              <div
                style={{
                  color:
                    "#6b7280",
                }}
              >
                No alerts created
                yet.
              </div>
            ) : (
              <div
                style={{
                  display:
                    "grid",

                  gap: "14px",
                }}
              >
                {alerts.map(
                  (
                    alert
                  ) => (
                    <div
                      key={
                        alert.id
                      }
                      style={{
                        background:
                          "#faf5ff",

                        border:
                          "1px solid #e9d5ff",

                        padding:
                          "18px",

                        borderRadius:
                          "14px",

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
                        <div
                          style={{
                            fontWeight:
                              "bold",

                            color:
                              "#6d28d9",

                            marginBottom:
                              "6px",
                          }}
                        >
                          🔔{" "}
                          {
                            alert.keyword
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
                          📍{" "}
                          {alert.location ||
                            "Any Location"}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          deleteAlert(
                            alert.id
                          )
                        }
                        style={{
                          background:
                            "#fee2e2",

                          color:
                            "#dc2626",

                          border:
                            "none",

                          padding:
                            "10px 16px",

                          borderRadius:
                            "10px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

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

                marginBottom:
                  "25px",
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