"use client";

import "./page.css";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function JobDetailsPage() {
  const params =
    useParams();

  const jobId =
    params.id;

  const [job, setJob] =
    useState<any>(null);

  const [user, setUser] =
    useState<any>(null);

  const [role, setRole] =
    useState("");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [
    coverLetter,
    setCoverLetter,
  ] = useState("");

  const [
    resumeFile,
    setResumeFile,
  ] = useState<File | null>(
    null
  );

  const [
    screeningAnswers,
    setScreeningAnswers,
  ] = useState<{
    [key: string]: string;
  }>({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchJob();

    getUser();
  }, []);

  const getCurrencySymbol =
    (
      currency: string
    ) => {
      switch (
        currency
      ) {
        case "USD":
          return "$";

        case "INR":
          return "₹";

        case "EUR":
          return "€";

        case "GBP":
          return "£";

        default:
          return "$";
      }
    };

  const getUser =
    async () => {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);

      if (user?.id) {
        const res =
          await fetch(
            `/api/profile?userId=${user.id}`
          );

        const profile =
          await res.json();

        setRole(
          profile.role
        );
      }
    };

  const fetchJob =
    async () => {
      try {
        const res =
          await fetch(
            `/api/jobs/${jobId}`
          );

        const data =
          await res.json();

        setJob(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  const handleAnswerChange =
    (
      question: string,
      value: string
    ) => {
      setScreeningAnswers(
        (prev) => ({
          ...prev,

          [question]:
            value,
        })
      );
    };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        let resumeLink = "";

        if (resumeFile) {
          const formData =
            new FormData();

          formData.append(
            "file",
            resumeFile
          );

          const uploadRes =
            await fetch(
              "/api/upload-resume",
              {
                method:
                  "POST",

                body:
                  formData,
              }
            );

          const uploadData =
            await uploadRes.json();

          resumeLink =
            uploadData.fileUrl;
        }

        const res =
          await fetch(
            "/api/applications",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  name,

                  email,

                  coverLetter,

                  resumeLink,

                  screeningAnswers:
                    JSON.stringify(
                      screeningAnswers
                    ),

                  jobId,
                }
              ),
            }
          );

        const result =
          await res.json();

        if (res.ok) {
          alert(
            "Application submitted successfully!"
          );

          setName("");
          setEmail("");
          setCoverLetter("");
          setResumeFile(
            null
          );

          setScreeningAnswers(
            {}
          );
        } else {
          alert(
            result.error ||
              "Failed to submit application"
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Something went wrong"
        );
      }
    };

  if (loading) {
    return (
      <div
        style={{
          padding:
            "40px",

          textAlign:
            "center",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div
        style={{
          padding:
            "40px",

          textAlign:
            "center",
        }}
      >
        Job not found
      </div>
    );
  }

  const canApply =
    role ===
    "applicant";

  return (
    <div
      style={{
        background:
          "#f5f7fb",

        minHeight:
          "100vh",

        padding:
          "40px 20px",

        fontFamily:
          "Arial, sans-serif",
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
        {/* TOP BAR */}

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "25px",

            flexWrap:
              "wrap",

            gap: "10px",
          }}
        >
          <a href="/">
            <button
              style={{
                background:
                  "white",

                border:
                  "1px solid #d1d5db",

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
              ← Back to Jobs
            </button>
          </a>

          <div
            style={{
              color:
                "#6b7280",

              fontSize:
                "14px",
            }}
          >
            SearchEezy Jobs
          </div>
        </div>

        {/* HERO CARD */}

        <div
          style={{
            background:
              "linear-gradient(to right, #1c4ed8, #2563eb)",

            borderRadius:
              "24px",

            padding:
              "45px",

            color:
              "white",

            marginBottom:
              "30px",

            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
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
              <div
                style={{
                  width:
                    "70px",

                  height:
                    "70px",

                  borderRadius:
                    "18px",

                  background:
                    "rgba(255,255,255,0.2)",

                  display:
                    "flex",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  fontSize:
                    "28px",

                  fontWeight:
                    "bold",

                  marginBottom:
                    "20px",
                }}
              >
                {job.company?.charAt(
                  0
                )}
              </div>

              <h1
                style={{
                  fontSize:
                    "42px",

                  marginBottom:
                    "12px",

                  fontWeight:
                    "bold",
                }}
              >
                {job.title}
              </h1>

              <h2
                style={{
                  fontSize:
                    "24px",

                  opacity: 0.95,

                  marginBottom:
                    "25px",
                }}
              >
                {job.company}
              </h2>

              <div
                style={{
                  display:
                    "flex",

                  flexWrap:
                    "wrap",

                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.15)",

                    padding:
                      "10px 14px",

                    borderRadius:
                      "999px",
                  }}
                >
                  📍 {job.location}
                </div>

                {job.jobType && (
                  <div
                    style={{
                      background:
                        "rgba(255,255,255,0.15)",

                      padding:
                        "10px 14px",

                      borderRadius:
                        "999px",
                    }}
                  >
                    💼 {job.jobType}
                  </div>
                )}

                {job.salaryMin &&
                  job.salaryMax && (
                    <div
                      style={{
                        background:
                          "rgba(255,255,255,0.15)",

                        padding:
                          "10px 14px",

                        borderRadius:
                          "999px",
                      }}
                    >
                      💰{" "}
                      {getCurrencySymbol(
                        job.currency
                      )}
                      {Number(
                        job.salaryMin
                      ).toLocaleString(
                        "en-US"
                      )}
                      {" - "}
                      {getCurrencySymbol(
                        job.currency
                      )}
                      {Number(
                        job.salaryMax
                      ).toLocaleString(
                        "en-US"
                      )}
                      {" "}
                      {
                        job.salaryType
                      }
                    </div>
                  )}
              </div>
            </div>

            <div
              style={{
                background:
                  "rgba(255,255,255,0.12)",

                padding:
                  "14px 18px",

                borderRadius:
                  "16px",

                fontWeight:
                  "bold",
              }}
            >
              Active Job
            </div>
          </div>
        </div>

        {/* MAIN GRID */}

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "2fr 1fr",

            gap: "28px",
          }}
        >
          {/* LEFT */}

          <div>
            <div
              style={{
                background:
                  "white",

                borderRadius:
                  "22px",

                padding:
                  "35px",

                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  marginBottom:
                    "25px",

                  fontSize:
                    "28px",

                  color:
                    "#111827",
                }}
              >
                Job Description
              </h2>

              <div
                className="job-description"
                style={{
                  lineHeight:
                    "1.9",

                  fontSize:
                    "17px",

                  color:
                    "#374151",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    job.description,
                }}
              />
            </div>
          </div>

          {/* RIGHT */}

          <div>
            {canApply && (
              <div
                style={{
                  background:
                    "white",

                  borderRadius:
                    "22px",

                  padding:
                    "30px",

                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.05)",

                  position:
                    "sticky",

                  top: "100px",
                }}
              >
                <h2
                  style={{
                    marginBottom:
                      "22px",

                    fontSize:
                      "26px",
                  }}
                >
                  Apply Now
                </h2>

                <form
                  onSubmit={
                    handleSubmit
                  }
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    required
                    style={{
                      width:
                        "100%",

                      padding:
                        "14px",

                      marginBottom:
                        "16px",

                      borderRadius:
                        "12px",

                      border:
                        "1px solid #d1d5db",

                      fontSize:
                        "15px",
                    }}
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    required
                    style={{
                      width:
                        "100%",

                      padding:
                        "14px",

                      marginBottom:
                        "16px",

                      borderRadius:
                        "12px",

                      border:
                        "1px solid #d1d5db",

                      fontSize:
                        "15px",
                    }}
                  />

                  {job.screeningQuestions &&
                    job.screeningQuestions
                      .split("\n")
                      .filter(
                        (
                          q: string
                        ) =>
                          q.trim() !==
                          ""
                      )
                      .map(
                        (
                          question: string,
                          index: number
                        ) => (
                          <div
                            key={
                              index
                            }
                            style={{
                              marginBottom:
                                "18px",
                            }}
                          >
                            <p
                              style={{
                                fontWeight:
                                  "bold",

                                marginBottom:
                                  "8px",
                              }}
                            >
                              {
                                question
                              }
                            </p>

                            <textarea
                              value={
                                screeningAnswers[
                                  question
                                ] ||
                                ""
                              }
                              onChange={(
                                e
                              ) =>
                                handleAnswerChange(
                                  question,
                                  e
                                    .target
                                    .value
                                )
                              }
                              required
                              style={{
                                width:
                                  "100%",

                                minHeight:
                                  "110px",

                                padding:
                                  "12px",

                                borderRadius:
                                  "12px",

                                border:
                                  "1px solid #d1d5db",
                              }}
                            />
                          </div>
                        )
                      )}

                  <div
                    style={{
                      marginBottom:
                        "18px",
                    }}
                  >
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
                      Upload Resume
                    </label>

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setResumeFile(
                          e.target
                            .files?.[0] ||
                            null
                        )
                      }
                      required
                      style={{
                        width:
                          "100%",

                        padding:
                          "12px",

                        border:
                          "1px solid #d1d5db",

                        borderRadius:
                          "12px",

                        background:
                          "white",
                      }}
                    />
                  </div>

                  <textarea
                    placeholder="Cover Letter"
                    value={
                      coverLetter
                    }
                    onChange={(e) =>
                      setCoverLetter(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "100%",

                      minHeight:
                        "150px",

                      padding:
                        "14px",

                      marginBottom:
                        "20px",

                      borderRadius:
                        "12px",

                      border:
                        "1px solid #d1d5db",

                      fontSize:
                        "15px",
                    }}
                  />

                  <button
                    type="submit"
                    style={{
                      width:
                        "100%",

                      background:
                        "#1c4ed8",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "16px",

                      borderRadius:
                        "14px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",

                      fontSize:
                        "16px",
                    }}
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}