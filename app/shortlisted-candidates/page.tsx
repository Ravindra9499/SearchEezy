"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function ShortlistedCandidatesPage() {
  const [loading, setLoading] =
    useState(true);

  const [
    candidates,
    setCandidates,
  ] = useState<any[]>([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates =
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

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "shortlisted_candidates"
          )
          .select("*")
          .eq(
            "recruiterEmail",
            user.email
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      if (!error && data) {
        setCandidates(data);
      }

      setLoading(false);
    };

  // REMOVE CANDIDATE

  const removeCandidate =
    async (
      shortlistId: number
    ) => {
      const confirmDelete =
        confirm(
          "Remove candidate from shortlist?"
        );

      if (
        !confirmDelete
      ) {
        return;
      }

      const { error } =
        await supabase
          .from(
            "shortlisted_candidates"
          )
          .delete()
          .eq(
            "id",
            shortlistId
          );

      if (error) {
        console.error(
          error
        );

        alert(
          "Failed to remove candidate."
        );

        return;
      }

      setCandidates(
        candidates.filter(
          (
            candidate
          ) =>
            candidate.id !==
            shortlistId
        )
      );

      alert(
        "Candidate removed successfully!"
      );
    };

  // UPDATE NOTES

  const updateNotes =
    async (
      shortlistId: number,
      notes: string
    ) => {
      const { error } =
        await supabase
          .from(
            "shortlisted_candidates"
          )
          .update({
            recruiterNotes:
              notes,
          })
          .eq(
            "id",
            shortlistId
          );

      if (error) {
        console.error(
          error
        );

        alert(
          "Failed to save notes."
        );

        return;
      }

      alert(
        "Recruiter notes saved successfully!"
      );
    };

  // HANDLE NOTES CHANGE

  const handleNotesChange =
    (
      shortlistId: number,
      value: string
    ) => {
      setCandidates(
        candidates.map(
          (
            candidate
          ) =>
            candidate.id ===
            shortlistId
              ? {
                  ...candidate,
                  recruiterNotes:
                    value,
                }
              : candidate
        )
      );
    };

  if (loading) {
    return (
      <div
        style={{
          padding:
            "50px",
        }}
      >
        Loading shortlisted candidates...
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
            "1500px",

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

                color:
                  "#111827",

                fontSize:
                  "34px",
              }}
            >
              Shortlisted Candidates
            </h1>

            <p
              style={{
                color:
                  "#6b7280",

                marginTop:
                  "8px",
              }}
            >
              Recruiter candidate CRM workflow.
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
                Resume Search
              </button>
            </a>

            <a href="/">
              <button
                style={{
                  background:
                    "#111827",

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
                ← Back to Home
              </button>
            </a>
          </div>
        </div>

        {/* RESULTS */}

        <div
          style={{
            marginBottom:
              "22px",

            fontWeight:
              "bold",

            color:
              "#6b7280",

            fontSize:
              "16px",
          }}
        >
          {
            candidates.length
          }{" "}
          shortlisted candidates
        </div>

        {/* EMPTY STATE */}

        {candidates.length ===
          0 && (
          <div
            style={{
              background:
                "white",

              padding:
                "50px",

              borderRadius:
                "24px",

              textAlign:
                "center",

              color:
                "#6b7280",

              boxShadow:
                "0 6px 20px rgba(0,0,0,0.05)",
            }}
          >
            <h2>
              No shortlisted candidates yet.
            </h2>

            <p>
              Save candidates from Resume Search to build your recruiter pipeline.
            </p>
          </div>
        )}

        {/* CANDIDATE GRID */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(420px, 1fr))",

            gap: "22px",
          }}
        >
          {candidates.map(
            (
              candidate
            ) => (
              <div
                key={
                  candidate.id
                }
                style={{
                  background:
                    "white",

                  borderRadius:
                    "22px",

                  padding:
                    "28px",

                  boxShadow:
                    "0 6px 20px rgba(0,0,0,0.05)",

                  border:
                    "1px solid #eef2f7",
                }}
              >
                {/* TOP */}

                <div
                  style={{
                    marginBottom:
                      "18px",
                  }}
                >
                  <h2
                    style={{
                      margin:
                        "0 0 8px 0",

                      color:
                        "#111827",
                    }}
                  >
                    {
                      candidate.candidateName
                    }
                  </h2>

                  <div
                    style={{
                      color:
                        "#6b7280",

                      fontSize:
                        "14px",

                      marginBottom:
                        "8px",
                    }}
                  >
                    📧{" "}
                    {
                      candidate.candidateEmail
                    }
                  </div>

                  {candidate.candidateTitle && (
                    <div
                      style={{
                        color:
                          "#374151",

                        marginBottom:
                          "8px",
                      }}
                    >
                      💼{" "}
                      {
                        candidate.candidateTitle
                      }
                    </div>
                  )}

                  {candidate.candidateLocation && (
                    <div
                      style={{
                        color:
                          "#374151",
                      }}
                    >
                      📍{" "}
                      {
                        candidate.candidateLocation
                      }
                    </div>
                  )}
                </div>

                {/* RECRUITER NOTES */}

                <div
                  style={{
                    marginTop:
                      "20px",
                  }}
                >
                  <h4
                    style={{
                      marginBottom:
                        "10px",

                      color:
                        "#111827",
                    }}
                  >
                    Recruiter Notes
                  </h4>

                  <textarea
                    value={
                      candidate.recruiterNotes ||
                      ""
                    }
                    onChange={(e) =>
                      handleNotesChange(
                        candidate.id,
                        e.target
                          .value
                      )
                    }
                    placeholder="Add recruiter notes..."
                    style={{
                      width:
                        "100%",

                      minHeight:
                        "120px",

                      padding:
                        "14px",

                      border:
                        "1px solid #d1d5db",

                      borderRadius:
                        "14px",

                      resize:
                        "vertical",

                      fontSize:
                        "14px",

                      fontFamily:
                        "Arial",

                      lineHeight:
                        "1.6",
                    }}
                  />

                  <button
                    onClick={() =>
                      updateNotes(
                        candidate.id,
                        candidate.recruiterNotes ||
                          ""
                      )
                    }
                    style={{
                      marginTop:
                        "12px",

                      width:
                        "100%",

                      background:
                        "#f59e0b",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "14px 18px",

                      borderRadius:
                        "12px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",

                      fontSize:
                        "15px",
                    }}
                  >
                    Save Recruiter Notes
                  </button>
                </div>

                {/* ACTION BUTTONS */}

                <div
                  style={{
                    display:
                      "flex",

                    flexDirection:
                      "column",

                    gap: "12px",

                    marginTop:
                      "22px",
                  }}
                >
                  {/* VIEW PROFILE */}

                  <a
                    href={`/candidate/${candidate.candidateId}`}
                  >
                    <button
                      style={{
                        width:
                          "100%",

                        background:
                          "#1d4ed8",

                        color:
                          "white",

                        border:
                          "none",

                        padding:
                          "14px 18px",

                        borderRadius:
                          "12px",

                        cursor:
                          "pointer",

                        fontWeight:
                          "bold",

                        fontSize:
                          "15px",
                      }}
                    >
                      View Profile
                    </button>
                  </a>

                  {/* VIEW RESUME */}

                  {candidate.resumeUrl && (
                    <a
                      href={
                        candidate.resumeUrl
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
                            "14px 18px",

                          borderRadius:
                            "12px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",

                          fontSize:
                            "15px",
                        }}
                      >
                        View Resume
                      </button>
                    </a>
                  )}

                  {/* REMOVE */}

                  <button
                    onClick={() =>
                      removeCandidate(
                        candidate.id
                      )
                    }
                    style={{
                      width:
                        "100%",

                      background:
                        "#dc2626",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "14px 18px",

                      borderRadius:
                        "12px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",

                      fontSize:
                        "15px",
                    }}
                  >
                    Remove Candidate
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}