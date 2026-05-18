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

      // Fetch role

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

        // Upload Resume

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

        // Submit Application

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
          console.error(
            "APPLICATION ERROR:",
            result
          );

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
            "20px",
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
            "20px",
        }}
      >
        Job not found
      </div>
    );
  }

  // Applicants only

  const canApply =
    role ===
    "applicant";

  return (
    <div
      style={{
        background:
          "#f3f2f1",

        minHeight:
          "100vh",

        padding:
          "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth:
            "850px",

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
              "20px",

            flexWrap:
              "wrap",

            gap: "10px",
          }}
        >
          <h1
            style={{
              color:
                "#1c4ed8",
            }}
          >
            Job Details
          </h1>

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
                  "10px 15px",

                borderRadius:
                  "5px",

                cursor:
                  "pointer",

                fontWeight:
                  "bold",
              }}
            >
              Back to Home
            </button>
          </a>
        </div>

        {/* Job Details */}

        <div
          style={{
            background:
              "white",

            padding:
              "35px",

            borderRadius:
              "14px",

            border:
              "1px solid #ddd",

            marginBottom:
              "25px",
          }}
        >
          <h1
            style={{
              color:
                "#1c4ed8",

              marginBottom:
                "10px",

              fontSize:
                "32px",
            }}
          >
            {job.title}
          </h1>

          <h2
            style={{
              marginBottom:
                "15px",

              fontSize:
                "24px",
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

              gap: "20px",

              marginBottom:
                "25px",

              color:
                "#444",

              fontSize:
                "16px",
            }}
          >
            <p>
              📍 {job.location}
            </p>

            {job.jobType && (
              <p>
                💼 {job.jobType}
              </p>
            )}

            {job.salaryMin &&
              job.salaryMax && (
                <p>
                  💰{" "}
                  {getCurrencySymbol(
                    job.currency
                  )}
                  {Number(
                    job.salaryMin
                  ).toLocaleString("en-US")}
                  {" - "}
                  {getCurrencySymbol(
                    job.currency
                  )}
                  {Number(
                    job.salaryMax
                  ).toLocaleString("en-US")}
                  {" "}
                  {job.salaryType}
                </p>
              )}
          </div>

          <hr
            style={{
              marginBottom:
                "30px",

              border:
                "none",

              borderTop:
                "1px solid #eee",
            }}
          />

          <div
            className="job-description"
            style={{
              lineHeight:
                "1.9",

              fontSize:
                "17px",

              color:
                "#222",
            }}
            dangerouslySetInnerHTML={{
              __html:
                job.description,
            }}
          />
        </div>

        {/* Applicant Only */}

        {canApply && (
          <div
            style={{
              background:
                "white",

              padding:
                "30px",

              borderRadius:
                "12px",

              border:
                "1px solid #ddd",
            }}
          >
            <h2
              style={{
                marginBottom:
                  "20px",
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
                placeholder="Your Name"
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
                    "12px",

                  marginBottom:
                    "15px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "6px",
                }}
              />

              <input
                type="email"
                placeholder="Your Email"
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
                    "12px",

                  marginBottom:
                    "20px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "6px",
                }}
              />

              {/* Screening Questions */}

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
                            "20px",
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
                              "100px",

                            padding:
                              "12px",

                            border:
                              "1px solid #ccc",

                            borderRadius:
                              "6px",
                          }}
                        />
                      </div>
                    )
                  )}

              {/* Resume Upload */}

              <div
                style={{
                  marginBottom:
                    "20px",
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
                      "10px",

                    border:
                      "1px solid #ccc",

                    borderRadius:
                      "6px",

                    background:
                      "white",
                  }}
                />

                {resumeFile && (
                  <p
                    style={{
                      marginTop:
                        "8px",

                      color:
                        "green",

                      fontSize:
                        "14px",
                    }}
                  >
                    Selected:{" "}
                    {
                      resumeFile.name
                    }
                  </p>
                )}
              </div>

              {/* Cover Letter */}

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
                    "140px",

                  padding:
                    "12px",

                  marginBottom:
                    "20px",

                  border:
                    "1px solid #ccc",

                  borderRadius:
                    "6px",
                }}
              />

              <button
                type="submit"
                style={{
                  background:
                    "#1c4ed8",

                  color:
                    "white",

                  border:
                    "none",

                  padding:
                    "12px 20px",

                  borderRadius:
                    "6px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",
                }}
              >
                Submit Application
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}