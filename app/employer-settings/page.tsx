"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function EmployerSettingsPage() {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [user, setUser] =
    useState<any>(null);

  const [profile, setProfile] =
    useState<any>(null);

  const [companyName, setCompanyName] =
    useState("");

  const [companyWebsite, setCompanyWebsite] =
    useState("");

  const [linkedinUrl, setLinkedinUrl] =
    useState("");

  const [verificationStatus, setVerificationStatus] =
    useState("unverified");

  useEffect(() => {
    const loadProfile =
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

        setUser(user);

        const res =
          await fetch(
            `/api/profile?email=${user.email}`
          );

        const data =
          await res.json();

        setProfile(data);

        setCompanyName(
          data.company_name || ""
        );

        setCompanyWebsite(
          data.companyWebsite || ""
        );

        setLinkedinUrl(
          data.linkedinUrl || ""
        );

        setVerificationStatus(
          data.verificationStatus ||
            "unverified"
        );

        setLoading(false);
      };

    loadProfile();
  }, []);

  const saveProfile =
    async () => {
      try {
        setSaving(true);

        const { error } =
          await supabase
            .from("profiles")
            .update({
              company_name:
                companyName,
              companyWebsite:
                companyWebsite,
              linkedinUrl:
                linkedinUrl,
            })
            .eq(
              "email",
              user.email
            );

        if (error) {
          alert(
            error.message
          );

          return;
        }

        alert(
          "Profile updated successfully"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to save profile"
        );
      } finally {
        setSaving(false);
      }
    };

  const requestVerification =
    async () => {
      try {
        const { error } =
          await supabase
            .from("profiles")
            .update({
              verificationRequested:
                true,
              verificationStatus:
                "pending",
            })
            .eq(
              "email",
              user.email
            );

        if (error) {
          alert(
            error.message
          );

          return;
        }

        setVerificationStatus(
          "pending"
        );

        alert(
          "Verification request submitted"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to request verification"
        );
      }
    };

  const getStatusColor =
    () => {
      switch (
        verificationStatus
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
          minHeight:
            "100vh",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          fontSize:
            "20px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f7fb",
        padding:
          "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth:
            "900px",
          margin:
            "0 auto",
        }}
      >
        <div
          style={{
            display:
              "flex",
            gap: "10px",
            flexWrap:
              "wrap",
            marginBottom:
              "20px",
          }}
        >
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
                  "10px 16px",
                borderRadius:
                  "8px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              🏠 Home
            </button>
          </a>

          <a href="/my-jobs">
            <button
              style={{
                background:
                  "#16a34a",
                color:
                  "white",
                border:
                  "none",
                padding:
                  "10px 16px",
                borderRadius:
                  "8px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              📋 My Jobs
            </button>
          </a>

          <a href="/pricing">
            <button
              style={{
                background:
                  "#7c3aed",
                color:
                  "white",
                border:
                  "none",
                padding:
                  "10px 16px",
                borderRadius:
                  "8px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              💰 Pricing
            </button>
          </a>
        </div>

        <div
          style={{
            marginBottom:
              "30px",
          }}
        >
          <h1
            style={{
              fontSize:
                "36px",
              marginBottom:
                "10px",
            }}
          >
            Employer Settings
          </h1>

          <p
            style={{
              color:
                "#6b7280",
              fontSize:
                "16px",
            }}
          >
            Manage your company
            profile and employer
            verification.
          </p>
        </div>

        {/* STATUS CARD */}

        <div
          style={{
            background:
              "white",
            borderRadius:
              "20px",
            padding:
              "30px",
            marginBottom:
              "25px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
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
              flexWrap:
                "wrap",
              gap: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  marginBottom:
                    "10px",
                }}
              >
                Verification Status
              </h2>

              <p
                style={{
                  color:
                    "#6b7280",
                }}
              >
                Verified employers
                build higher trust
                with applicants.
              </p>
            </div>

            <div
              style={{
                background:
                  getStatusColor(),
                color:
                  "white",
                padding:
                  "10px 18px",
                borderRadius:
                  "999px",
                fontWeight:
                  "bold",
                textTransform:
                  "capitalize",
              }}
            >
              {verificationStatus}
            </div>
          </div>

          {verificationStatus ===
            "unverified" && (
            <button
              onClick={
                requestVerification
              }
              style={{
                marginTop:
                  "25px",
                background:
                  "#1c4ed8",
                color:
                  "white",
                border:
                  "none",
                padding:
                  "14px 22px",
                borderRadius:
                  "10px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
                fontSize:
                  "15px",
              }}
            >
              Request Verification
            </button>
          )}
        </div>

        {/* COMPANY INFO */}

        <div
          style={{
            background:
              "white",
            borderRadius:
              "20px",
            padding:
              "30px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              marginBottom:
                "25px",
            }}
          >
            Company Information
          </h2>

          <div
            style={{
              display:
                "grid",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display:
                    "block",
                  marginBottom:
                    "8px",
                  fontWeight:
                    "bold",
                }}
              >
                Company Name
              </label>

              <input
                value={
                  companyName
                }
                onChange={(e) =>
                  setCompanyName(
                    e.target.value
                  )
                }
                placeholder="Enter company name"
                style={{
                  width:
                    "100%",
                  padding:
                    "14px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #ddd",
                  fontSize:
                    "15px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display:
                    "block",
                  marginBottom:
                    "8px",
                  fontWeight:
                    "bold",
                }}
              >
                Company Website
              </label>

              <input
                value={
                  companyWebsite
                }
                onChange={(e) =>
                  setCompanyWebsite(
                    e.target.value
                  )
                }
                placeholder="https://company.com"
                style={{
                  width:
                    "100%",
                  padding:
                    "14px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #ddd",
                  fontSize:
                    "15px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display:
                    "block",
                  marginBottom:
                    "8px",
                  fontWeight:
                    "bold",
                }}
              >
                LinkedIn URL
              </label>

              <input
                value={
                  linkedinUrl
                }
                onChange={(e) =>
                  setLinkedinUrl(
                    e.target.value
                  )
                }
                placeholder="https://linkedin.com/company/..."
                style={{
                  width:
                    "100%",
                  padding:
                    "14px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #ddd",
                  fontSize:
                    "15px",
                }}
              />
            </div>

            <button
              onClick={
                saveProfile
              }
              disabled={saving}
              style={{
                background:
                  "#111827",
                color:
                  "white",
                border:
                  "none",
                padding:
                  "15px",
                borderRadius:
                  "12px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
                fontSize:
                  "15px",
                marginTop:
                  "10px",
              }}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}