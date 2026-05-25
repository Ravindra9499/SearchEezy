"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

export default function ResumeSearchPage() {
  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const [
    candidates,
    setCandidates,
  ] = useState<any[]>([]);

  const [
    filteredCandidates,
    setFilteredCandidates,
  ] = useState<any[]>([]);

  const [keyword, setKeyword] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [radius, setRadius] =
    useState("25");

  const [
    remoteOnly,
    setRemoteOnly,
  ] = useState(false);

  const [
    experienceFilter,
    setExperienceFilter,
  ] = useState("");

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess =
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
        !profile.resumeSearchEnabled
      ) {
        alert(
          "Resume search is only available for premium recruiters."
        );

        window.location.href =
          "/";

        return;
      }

      setAuthorized(
        true
      );

      await loadCandidates();

      setLoading(false);
    };

  const loadCandidates =
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
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      if (!error && data) {
        setCandidates(data);

        setFilteredCandidates(
          data
        );
      }
    };

  const handleSearch =
    () => {
      let filtered =
        candidates;

      // KEYWORD SEARCH

      if (keyword) {
        filtered =
          filtered.filter(
            (
              candidate
            ) =>
              candidate.fullname
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||
              candidate.useremail
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||
              candidate.title
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||
              candidate.skills
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                ) ||
              candidate.summary
                ?.toLowerCase()
                .includes(
                  keyword.toLowerCase()
                )
          );
      }

      // LOCATION / ZIP SEARCH

      if (location) {
        filtered =
          filtered.filter(
            (
              candidate
            ) =>
              candidate.location
                ?.toLowerCase()
                .includes(
                  location.toLowerCase()
                ) ||
              candidate.zipcode
                ?.toLowerCase()
                .includes(
                  location.toLowerCase()
                )
          );
      }

      // EXPERIENCE FILTER

      if (
        experienceFilter
      ) {
        filtered =
          filtered.filter(
            (
              candidate
            ) =>
              candidate.experience
                ?.toLowerCase()
                .includes(
                  experienceFilter.toLowerCase()
                )
          );
      }

      // REMOTE FILTER

      if (
        remoteOnly
      ) {
        filtered =
          filtered.filter(
            (
              candidate
            ) =>
              candidate.remote ===
              true
          );
      }

      setFilteredCandidates(
        filtered
      );
    };

  // SAVE CANDIDATE

  const saveCandidate =
    async (
      candidate: any
    ) => {
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
            "50px",
        }}
      >
        Loading recruiter database...
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
              Resume Search
            </h1>

            <p
              style={{
                color:
                  "#6b7280",

                marginTop:
                  "8px",
              }}
            >
              Premium recruiter candidate database.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
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

        {/* SEARCH SECTION */}

        <div
          style={{
            background:
              "white",

            padding:
              "25px",

            borderRadius:
              "20px",

            marginBottom:
              "30px",

            boxShadow:
              "0 4px 18px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "2fr 1.5fr 1fr 1fr auto",

              gap: "15px",

              alignItems:
                "center",
            }}
          >
            <input
              placeholder="Search skills, title, candidate name..."
              value={keyword}
              onChange={(e) =>
                setKeyword(
                  e.target
                    .value
                )
              }
              style={{
                padding:
                  "15px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "12px",

                fontSize:
                  "15px",
              }}
            />

            <input
              placeholder="City or ZIP Code"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target
                    .value
                )
              }
              style={{
                padding:
                  "15px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "12px",

                fontSize:
                  "15px",
              }}
            />

            <select
              value={radius}
              onChange={(e) =>
                setRadius(
                  e.target
                    .value
                )
              }
              style={{
                padding:
                  "15px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "12px",

                fontSize:
                  "15px",
              }}
            >
              <option value="10">
                10 Miles
              </option>

              <option value="25">
                25 Miles
              </option>

              <option value="50">
                50 Miles
              </option>

              <option value="100">
                100 Miles
              </option>

              <option value="200">
                200 Miles
              </option>

              <option value="300">
                300 Miles
              </option>

              <option value="400">
                400 Miles
              </option>

              <option value="500">
                500 Miles
              </option>

              <option value="nationwide">
                Entire Country
              </option>
            </select>

            <input
              placeholder="Experience"
              value={
                experienceFilter
              }
              onChange={(e) =>
                setExperienceFilter(
                  e.target
                    .value
                )
              }
              style={{
                padding:
                  "15px",

                border:
                  "1px solid #d1d5db",

                borderRadius:
                  "12px",

                fontSize:
                  "15px",
              }}
            />

            <button
              onClick={
                handleSearch
              }
              style={{
                background:
                  "#1c4ed8",

                color:
                  "white",

                border:
                  "none",

                padding:
                  "15px 24px",

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
              Search
            </button>
          </div>

          {/* FILTERS */}

          <div
            style={{
              marginTop:
                "20px",

              display:
                "flex",

              gap: "20px",

              alignItems:
                "center",

              flexWrap:
                "wrap",
            }}
          >
            <label
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "10px",

                fontWeight:
                  "bold",

                color:
                  "#374151",
              }}
            >
              <input
                type="checkbox"
                checked={
                  remoteOnly
                }
                onChange={(e) =>
                  setRemoteOnly(
                    e.target
                      .checked
                  )
                }
              />
              Remote Only
            </label>

            <div
              style={{
                color:
                  "#6b7280",

                fontSize:
                  "14px",
              }}
            >
              Radius:{" "}
              {radius} miles
            </div>
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
            filteredCandidates.length
          }{" "}
          candidate profiles found
        </div>

        {/* CANDIDATE GRID */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(380px, 1fr))",

            gap: "22px",
          }}
        >
          {filteredCandidates.map(
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
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "flex-start",

                    marginBottom:
                      "18px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin:
                          "0 0 8px 0",

                        color:
                          "#111827",
                      }}
                    >
                      {
                        candidate.fullname
                      }
                    </h2>

                    <div
                      style={{
                        color:
                          "#6b7280",

                        fontSize:
                          "14px",
                      }}
                    >
                      📧{" "}
                      {
                        candidate.useremail
                      }
                    </div>
                  </div>

                  {candidate.remote && (
                    <div
                      style={{
                        background:
                          "#dcfce7",

                        color:
                          "#166534",

                        padding:
                          "6px 12px",

                        borderRadius:
                          "999px",

                        fontWeight:
                          "bold",

                        fontSize:
                          "12px",
                      }}
                    >
                      Remote
                    </div>
                  )}
                </div>

                {/* DETAILS */}

                {candidate.title && (
                  <div
                    style={{
                      marginBottom:
                        "10px",

                      color:
                        "#374151",
                    }}
                  >
                    💼{" "}
                    {
                      candidate.title
                    }
                  </div>
                )}

                {candidate.location && (
                  <div
                    style={{
                      marginBottom:
                        "10px",

                      color:
                        "#374151",
                    }}
                  >
                    📍{" "}
                    {
                      candidate.location
                    }

                    {candidate.zipcode &&
                      ` • ${candidate.zipcode}`}
                  </div>
                )}

                {candidate.experience && (
                  <div
                    style={{
                      marginBottom:
                        "10px",

                      color:
                        "#374151",
                    }}
                  >
                    🧠{" "}
                    {
                      candidate.experience
                    }
                  </div>
                )}

                {candidate.education && (
                  <div
                    style={{
                      marginBottom:
                        "16px",

                      color:
                        "#374151",
                    }}
                  >
                    🎓{" "}
                    {
                      candidate.education
                    }
                  </div>
                )}

                {/* SKILLS */}

                {candidate.skills && (
                  <div
                    style={{
                      marginBottom:
                        "18px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "inline-block",

                        background:
                          "#eff6ff",

                        color:
                          "#1d4ed8",

                        padding:
                          "8px 14px",

                        borderRadius:
                          "999px",

                        fontWeight:
                          "bold",

                        fontSize:
                          "13px",
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
                      Candidate Summary
                    </h4>

                    <div
                      style={{
                        background:
                          "#f9fafb",

                        padding:
                          "16px",

                        borderRadius:
                          "12px",

                        maxHeight:
                          "130px",

                        overflow:
                          "auto",

                        fontSize:
                          "14px",

                        color:
                          "#374151",

                        lineHeight:
                          "1.6",
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
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "12px",
                    marginTop: "22px",
                  }}
                >
                  <button
                    onClick={() =>
                      saveCandidate(
                        candidate
                      )
                    }
                    style={{
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

                      width:
                        "100%",

                      fontSize:
                        "15px",
                    }}
                  >
                    Save Candidate
                  </button>

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "12px",
                    }}
                  >
                    <a
                      href={`/candidate/${candidate.id}`}
                      style={{
                        flex: 1,
                      }}
                    >
                      <button
                        style={{
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

                          width:
                            "100%",

                          fontSize:
                            "15px",
                        }}
                      >
                        View Profile
                      </button>
                    </a>

                    {candidate.resumeurl && (
                      <a
                        href={
                          candidate.resumeurl
                        }
                        target="_blank"
                        style={{
                          flex: 1,
                        }}
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
                              "14px 18px",

                            borderRadius:
                              "12px",

                            cursor:
                              "pointer",

                            fontWeight:
                              "bold",

                            width:
                              "100%",

                            fontSize:
                              "15px",
                          }}
                        >
                          View Resume
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}