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

  const updateVerificationStatus =
    async (
      id: string,
      status: string
    ) => {
      const updates: any = {
        verificationStatus:
          status,
        verificationRequested:
          false,
      };

      if (
        status ===
        "verified"
      ) {
        updates.isverified =
          true;

        updates.verifiedAt =
          new Date().toISOString();
      }

      if (
        status ===
        "rejected"
      ) {
        updates.isverified =
          false;
      }

      await supabase
        .from(
          "profiles"
        )
        .update(
          updates
        )
        .eq("id", id);

      loadProfiles();
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
        <h1>
          SearchEezy Admin Dashboard
        </h1>

        <div
          style={{
            overflowX:
              "auto",
            background:
              "white",
            borderRadius:
              "18px",
            padding:
              "20px",
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
              <tr>
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
                  >
                    <td style={tdStyle}>
                      {
                        profile.email
                      }
                    </td>

                    <td style={tdStyle}>
                      {
                        profile.role
                      }
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display:
                            "flex",
                          flexDirection:
                            "column",
                          gap: "8px",
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
                              "6px 10px",
                            borderRadius:
                              "999px",
                            fontSize:
                              "12px",
                            fontWeight:
                              "bold",
                            width:
                              "fit-content",
                          }}
                        >
                          {
                            profile.verificationStatus ||
                              "unverified"
                          }
                        </div>

                        {profile.role ===
                          "employer" && (
                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={() =>
                                updateVerificationStatus(
                                  profile.id,
                                  "verified"
                                )
                              }
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
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      {
                        profile.subscriptionPlan
                      }
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          toggleResumeSearch(
                            profile.id,
                            profile.resumeSearchEnabled
                          )
                        }
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
