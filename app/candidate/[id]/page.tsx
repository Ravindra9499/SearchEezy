"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function CandidateProfilePage() {
  const params =
    useParams();

  const id = params.id;

  const [
    candidate,
    setCandidate,
  ] = useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCandidate();
  }, []);

  const loadCandidate =
    async () => {
      const {
        data,
        error,
      } =
        await supabase
          .from(
            "candidate_profiles"
          )
          .select("*")
          .eq("id", id)
          .single();

      if (!error && data) {
        setCandidate(data);
      }

      setLoading(false);
    };

  // SAVE CANDIDATE

  const saveCandidate =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        alert(
          "Please login first."
        );

        return;
      }

      // CHECK DUPLICATE

      const {
        data: existing,
      } =
        await supabase
          .from(
            "shortlisted_candidates"
          )
          .select("id")
          .eq(
            "recruiterEmail",
            user.email
          )
          .eq(
            "candidateId",
            candidate.id
          );

      if (
        existing &&
        existing.length > 0
      ) {
        alert(
          "Candidate already shortlisted."
        );

        return;
      }

      const { error } =
        await supabase
          .from(
            "shortlisted_candidates"
          )
          .insert([
            {
              recruiterEmail:
                user.email,

              candidateId:
                candidate.id,

              candidateEmail:
                candidate.useremail,

              candidateName:
                candidate.fullname,

              candidateTitle:
                candidate.title,

              candidateLocation:
                candidate.location,

              resumeUrl:
                candidate.resumeurl,
            },
          ]);

      if (error) {
        console.error(
          error
        );

        alert(
          "Failed to save candidate."
        );

        return;
      }

      alert(
        "Candidate shortlisted successfully!"
      );
    };

  if (loading) {
    return (
      <div
        style={{
          padding:
            "40px",
        }}
      >
        Loading candidate...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div
        style={{
          padding:
            "40px",
        }}
      >
        Candidate not found.
      </div>
    );
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
            "1200px",

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

            flexWrap:
              "wrap",

            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,

                fontSize:
                  "36px",

                color:
                  "#111827",
              }}
            >
              {
                candidate.fullname
              }
            </h1>

            <p
              style={{
                color:
                  "#6b7280",

                marginTop:
                  "10px",

                fontSize:
                  "16px",
              }}
            >
              Recruiter Candidate Profile
            </p>
          </div>

          <div
            style={{
              display:
                "flex",

              gap: "12px",

              flexWrap:
                "wrap",
            }}
          >
            <a href="/shortlisted-candidates">
              <button
                style={{
                  background:
                    "#16a34a",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "14px 20px",

                  borderRadius:
                    "12px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                Shortlisted Candidates
              </button>
            </a>

            <a href="/resume-search">
              <button
                style={{
                  background:
                    "#1d4ed8",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "14px 20px",

                  borderRadius:
                    "12px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                ← Back to Resume Search
              </button>
            </a>
          </div>
        </div>

        {/* PROFILE CARD */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "1fr 1fr",

            gap: "24px",
          }}
        >
          {/* LEFT */}

          <div
            style={{
              background:
                "white",

              padding:
                "30px",

              borderRadius:
                "24px",

              boxShadow:
                "0 6px 18px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              Candidate Details
            </h2>

            <div
              style={{
                marginTop:
                  "25px",

                lineHeight:
                  "2",
              }}
            >
              <div>
                📧{" "}
                <strong>
                  Email:
                </strong>{" "}
                {
                  candidate.useremail
                }
              </div>

              <div>
                💼{" "}
                <strong>
                  Title:
                </strong>{" "}
                {
                  candidate.title ||
                  "N/A"
                }
              </div>

              <div>
                📍{" "}
                <strong>
                  Location:
                </strong>{" "}
                {
                  candidate.location ||
                  "N/A"
                }
              </div>

              <div>
                🧠{" "}
                <strong>
                  Experience:
                </strong>{" "}
                {
                  candidate.experience ||
                  "N/A"
                }
              </div>

              <div>
                🎓{" "}
                <strong>
                  Education:
                </strong>{" "}
                {
                  candidate.education ||
                  "N/A"
                }
              </div>

              <div>
                🌎{" "}
                <strong>
                  Remote:
                </strong>{" "}
                {candidate.remote
                  ? "Yes"
                  : "No"}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div
            style={{
              background:
                "white",

              padding:
                "30px",

              borderRadius:
                "24px",

              boxShadow:
                "0 6px 18px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              Recruiter Actions
            </h2>

            {/* SKILLS */}

            {candidate.skills && (
              <div
                style={{
                  marginTop:
                    "20px",
                }}
              >
                <h4>
                  Skills
                </h4>

                <div
                  style={{
                    background:
                      "#eff6ff",

                    color:
                      "#1d4ed8",

                    display:
                      "inline-block",

                    padding:
                      "10px 14px",

                    borderRadius:
                      "999px",

                    fontWeight:
                      "bold",
                  }}
                >
                  {
                    candidate.skills
                  }
                </div>
              </div>
            )}

            {/* SUMMARY */}

            {candidate.summary && (
              <div
                style={{
                  marginTop:
                    "30px",
                }}
              >
                <h4>
                  Candidate Summary
                </h4>

                <div
                  style={{
                    background:
                      "#f9fafb",

                    padding:
                      "18px",

                    borderRadius:
                      "14px",

                    lineHeight:
                      "1.7",

                    color:
                      "#374151",
                  }}
                >
                  {
                    candidate.summary
                  }
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}

            <div
              style={{
                marginTop:
                  "30px",

                display:
                  "flex",

                flexDirection:
                  "column",

                gap: "14px",
              }}
            >
              {/* SAVE CANDIDATE */}

              <button
                onClick={
                  saveCandidate
                }
                style={{
                  width:
                    "100%",

                  background:
                    "#f59e0b",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "16px",

                  borderRadius:
                    "14px",

                  fontWeight:
                    "bold",

                  cursor:
                    "pointer",

                  fontSize:
                    "16px",
                }}
              >
                Save Candidate
              </button>

              {/* VIEW RESUME */}

              {candidate.resumeurl && (
                <a
                  href={
                    candidate.resumeurl
                  }
                  target="_blank"
                >
                  <button
                    style={{
                      width:
                        "100%",

                      background:
                        "#16a34a",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "16px",

                      borderRadius:
                        "14px",

                      fontWeight:
                        "bold",

                      cursor:
                        "pointer",

                      fontSize:
                        "16px",
                    }}
                  >
                    View Resume
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}