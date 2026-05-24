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
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "profiles"
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
        setProfiles(data);
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
      await supabase
        .from(
          "profiles"
        )
        .update({
          resumeSearchEnabled:
            !current,
        })
        .eq("id", id);

      loadProfiles();
    };

  if (loading) {
    return (
      <div
        style={{
          padding:
            "50px",
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
              SearchEezy Admin Dashboard
            </h1>

            <p
              style={{
                color:
                  "#6b7280",
              }}
            >
              Manage employers, subscriptions and platform access.
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

        {/* STATS */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom:
              "30px",
          }}
        >
          <div
            style={{
              background:
                "white",
              padding:
                "25px",
              borderRadius:
                "18px",
            }}
          >
            <h2>
              {
                profiles.length
              }
            </h2>

            <p>
              Total Users
            </p>
          </div>

          <div
            style={{
              background:
                "white",
              padding:
                "25px",
              borderRadius:
                "18px",
            }}
          >
            <h2>
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

            <p>
              Employers
            </p>
          </div>

          <div
            style={{
              background:
                "white",
              padding:
                "25px",
              borderRadius:
                "18px",
            }}
          >
            <h2>
              {
                profiles.filter(
                  (
                    p
                  ) =>
                    p.subscriptionPlan ===
                    "premium"
                ).length
              }
            </h2>

            <p>
              Premium Accounts
            </p>
          </div>

          <div
            style={{
              background:
                "white",
              padding:
                "25px",
              borderRadius:
                "18px",
            }}
          >
            <h2>
              {
                profiles.filter(
                  (
                    p
                  ) =>
                    p.resumeSearchEnabled
                ).length
              }
            </h2>

            <p>
              Resume Search Enabled
            </p>
          </div>
        </div>

        {/* USERS TABLE */}

        <div
          style={{
            background:
              "white",
            borderRadius:
              "18px",
            overflow:
              "hidden",
          }}
        >
          <div
            style={{
              padding:
                "20px",
              borderBottom:
                "1px solid #eee",
            }}
          >
            <h2
              style={{
                margin: 0,
              }}
            >
              Employer & User Management
            </h2>
          </div>

          <div
            style={{
              overflowX:
                "auto",
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
                    background:
                      "#f9fafb",
                  }}
                >
                  <th
                    style={
                      thStyle
                    }
                  >
                    Email
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    Role
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    Plan
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    Free Posts
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
                    Resume Search
                  </th>

                  <th
                    style={
                      thStyle
                    }
                  >
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
                    >
                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          profile.email
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          profile.role
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            gap: "8px",
                            alignItems:
                              "center",
                          }}
                        >
                          <span>
                            {
                              profile.subscriptionPlan
                            }
                          </span>

                          <button
                            onClick={() =>
                              updatePlan(
                                profile.id,
                                profile.subscriptionPlan ===
                                  "premium"
                                  ? "free"
                                  : "premium"
                              )
                            }
                            style={{
                              background:
                                profile.subscriptionPlan ===
                                "premium"
                                  ? "#dc2626"
                                  : "#16a34a",
                              color:
                                "white",
                              border:
                                "none",
                              padding:
                                "6px 10px",
                              borderRadius:
                                "8px",
                              cursor:
                                "pointer",
                              fontSize:
                                "12px",
                              fontWeight:
                                "bold",
                            }}
                          >
                            {profile.subscriptionPlan ===
                            "premium"
                              ? "Downgrade"
                              : "Upgrade"}
                          </button>
                        </div>
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {
                          profile.freePostsRemaining
                        }
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        {profile.resumeSearchEnabled
                          ? "Enabled"
                          : "Disabled"}
                      </td>

                      <td
                        style={
                          tdStyle
                        }
                      >
                        <button
                          onClick={() =>
                            toggleResumeSearch(
                              profile.id,
                              profile.resumeSearchEnabled
                            )
                          }
                          style={{
                            background:
                              "#1d4ed8",
                            color:
                              "white",
                            border:
                              "none",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "8px",
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
    </div>
  );
}

const thStyle = {
  textAlign: "left" as const,
  padding: "16px",
  borderBottom:
    "1px solid #eee",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "16px",
  borderBottom:
    "1px solid #f3f4f6",
};