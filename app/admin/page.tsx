"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [profiles, setProfiles] =
    useState<any[]>([]);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin =
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
        !profile.isAdmin
      ) {
        alert(
          "Access denied"
        );

        window.location.href =
          "/";

        return;
      }

      setAuthorized(
        true
      );

      await loadProfiles();

      setLoading(false);
    };

  const loadProfiles =
    async () => {
      try {
        const response =
          await fetch(
            "/api/admin/profiles"
          );

        const data =
          await response.json();

        if (
          Array.isArray(data)
        ) {
          setProfiles(data);
        }
      } catch (error) {
        console.error(
          "Failed to load profiles",
          error
        );
      }
    };

  const updatePlan =
    async (
      id: string,
      plan: string
    ) => {
      await supabase
        .from(
          "profiles"
        )
        .update({
          subscriptionPlan:
            plan,
        })
        .eq("id", id);

      loadProfiles();
    };

  const toggleResumeSearch =
  async (
    id: string,
    current: boolean
  ) => {
    try {
      const response =
        await fetch(
          "/api/admin/resume-access",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id,
              resumeSearchEnabled:
                !current,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Update failed"
        );
        return;
      }

      alert(
        !current
          ? "Resume access enabled"
          : "Resume access disabled"
      );

      await loadProfiles();
    } catch (error) {
      console.error(error);

      alert(
        "Update failed"
      );
    }
  };

  const updateVerificationStatus =
  async (
    id: string,
    status: string
  ) => {
    try {
      const response =
        await fetch(
          "/api/admin/verify",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id,
              status,
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Verification failed"
        );
        return;
      }

      alert(
        `Employer ${status}`
      );

      await loadProfiles();
    } catch (error) {
      console.error(error);

      alert(
        "Verification failed"
      );
    }
  };

  const getVerificationColor =
    (
      status: string
    ) => {
      switch (
        status
      ) {
        case "verified":
          return "#16a34a";

        case "pending":
          return "#f59e0b";

        case "rejected":
          return "#dc2626";

        default:
          return "#6b7280";
      }
    };

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial",
        }}
      >
        Loading admin dashboard...
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
            gap: "20px",
          }}
        >
          <div>
            <a
              href="/"
              style={{
                display:
                  "inline-block",
                marginBottom:
                  "20px",
                color:
                  "#1d4ed8",
                fontWeight:
                  "bold",
                textDecoration:
                  "none",
                fontSize:
                  "15px",
              }}
            >
              ← Back to Home
            </a>

            <h1
              style={{
                margin: 0,
                fontSize:
                  "36px",
                color:
                  "#111827",
              }}
            >
              SearchEezy Admin Dashboard
            </h1>

            <p
              style={{
                color:
                  "#6b7280",
                marginTop:
                  "8px",
              }}
            >
              Manage employers, applicants, verification and premium access
            </p>
          </div>

          <div
            style={{
              display:
                "flex",
              gap: "16px",
              flexWrap:
                "wrap",
            }}
          >
            <div
              style={{
                background:
                  "white",
                padding:
                  "18px 24px",
                borderRadius:
                  "16px",
                minWidth:
                  "180px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                }}
              >
                Total Profiles
              </p>

              <h2
                style={{
                  margin:
                    "8px 0 0 0",
                  color:
                    "#111827",
                }}
              >
                {profiles.length}
              </h2>
            </div>

            <div
              style={{
                background:
                  "white",
                padding:
                  "18px 24px",
                borderRadius:
                  "16px",
                minWidth:
                  "180px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                }}
              >
                Employers
              </p>

              <h2
                style={{
                  margin:
                    "8px 0 0 0",
                  color:
                    "#1d4ed8",
                }}
              >
                {
                  profiles.filter(
                    (
                      p
                    ) =>
                      p.role ===
                      "employer"
                  ).length
                }
              </h2>
            </div>

            <div
              style={{
                background:
                  "white",
                padding:
                  "18px 24px",
                borderRadius:
                  "16px",
                minWidth:
                  "180px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                }}
              >
                Verified Employers
              </p>

              <h2
                style={{
                  margin:
                    "8px 0 0 0",
                  color:
                    "#16a34a",
                }}
              >
                {
                  profiles.filter(
                    (
                      p
                    ) =>
                      p.verificationStatus ===
                      "verified"
                  ).length
                }
              </h2>
            </div>

            <div
              style={{
                background:
                  "white",
                padding:
                  "18px 24px",
                borderRadius:
                  "16px",
                minWidth:
                  "180px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color:
                    "#6b7280",
                  fontSize:
                    "14px",
                }}
              >
                Pending Requests
              </p>

              <h2
                style={{
                  margin:
                    "8px 0 0 0",
                  color:
                    "#f59e0b",
                }}
              >
                {
                  profiles.filter(
                    (p) =>
                      p.verificationRequested ===
                      true
                  ).length
                }
              </h2>
            </div>
          </div>
        </div>

        <div
          style={{
            overflowX:
              "auto",
            background:
              "white",
            borderRadius:
              "24px",
            padding:
              "24px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <table
            style={{
              width:
                "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                <th style={thStyle}>
                  Company
                </th>

                <th style={thStyle}>
                  Email
                </th>

                <th style={thStyle}>
                  Role
                </th>

                <th style={thStyle}>
                  Verification
                </th>

                <th style={thStyle}>
                  Plan
                </th>

                <th style={thStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {profiles.map(
                (
                  profile
                ) => (
                  <tr
                    key={
                      profile.id
                    }
                    style={{
                      borderBottom:
                        "1px solid #f3f4f6",
                    }}
                  >
                    <td style={tdStyle}>
                      <div
                        style={{
                          fontWeight:
                            "bold",
                          color:
                            "#111827",
                        }}
                      >
                        {
                          profile.company_name ||
                          "-"
                        }
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          fontWeight:
                            "bold",
                          color:
                            "#111827",
                        }}
                      >
                        {
                          profile.email
                        }
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          background:
                            profile.role ===
                            "employer"
                              ? "#dbeafe"
                              : "#dcfce7",
                          color:
                            profile.role ===
                            "employer"
                              ? "#1d4ed8"
                              : "#15803d",
                          padding:
                            "6px 12px",
                          borderRadius:
                            "999px",
                          width:
                            "fit-content",
                          fontSize:
                            "12px",
                          fontWeight:
                            "bold",
                          textTransform:
                            "capitalize",
                        }}
                      >
                        {
                          profile.role
                        }
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display:
                            "flex",
                          flexDirection:
                            "column",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            background:
                              getVerificationColor(
                                profile.verificationStatus ||
                                  "unverified"
                              ),
                            color:
                              "white",
                            padding:
                              "6px 12px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "bold",
                            width:
                              "fit-content",
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {
                            profile.verificationStatus ||
                              "unverified"
                          }
                        </div>

                        {profile.role ===
                          "employer" &&
                          profile.verificationRequested ===
                            true && (
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "10px",
                              flexWrap:
                                "wrap",
                            }}
                          >
                            <button
                              onClick={() =>
                                updateVerificationStatus(
                                  profile.id,
                                  "verified"
                                )
                              }
                              style={{
                                background:
                                  "#16a34a",
                                color:
                                  "white",
                                border:
                                  "none",
                                padding:
                                  "8px 14px",
                                borderRadius:
                                  "8px",
                                cursor:
                                  "pointer",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateVerificationStatus(
                                  profile.id,
                                  "rejected"
                                )
                              }
                              style={{
                                background:
                                  "#dc2626",
                                color:
                                  "white",
                                border:
                                  "none",
                                padding:
                                  "8px 14px",
                                borderRadius:
                                  "8px",
                                cursor:
                                  "pointer",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          background:
                            profile.subscriptionPlan ===
                            "premium"
                              ? "#ede9fe"
                              : "#f3f4f6",
                          color:
                            profile.subscriptionPlan ===
                            "premium"
                              ? "#7c3aed"
                              : "#374151",
                          padding:
                            "6px 12px",
                          borderRadius:
                            "999px",
                          width:
                            "fit-content",
                          fontSize:
                            "12px",
                          fontWeight:
                            "bold",
                          textTransform:
                            "capitalize",
                        }}
                      >
                        {
                          profile.subscriptionPlan
                        }
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          toggleResumeSearch(
                            profile.id,
                            profile.resumeSearchEnabled
                          )
                        }
                        style={{
                          background:
                            "#111827",
                          color:
                            "white",
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
                        Toggle Resume Access
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "16px",
};

const tdStyle = {
  padding: "16px",
};
