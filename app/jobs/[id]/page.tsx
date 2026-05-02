"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useParams } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function JobDetails() {
  const params = useParams();

  const id = params.id;

  const [job, setJob] = useState<any>(null);

  const [user, setUser] =
    useState<any>(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [resumeFile, setResumeFile] =
    useState<any>(null);

  const [coverLetter, setCoverLetter] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    fetchJob();

    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setUser(user);
  };

  const fetchJob = async () => {
    const res =
      await fetch("/api/jobs");

    const data =
      await res.json();

    const foundJob =
      data.find(
        (j: any) =>
          String(j.id) ===
          String(id)
      );

    setJob(foundJob);
  };

  const uploadResume =
    async () => {
      if (!resumeFile)
        return "";

      const fileName = `${Date.now()}-${resumeFile.name}`;

      const { error } =
        await supabase.storage
          .from("resumes")
          .upload(
            fileName,
            resumeFile
          );

      if (error) {
        alert(
          "Resume upload failed"
        );

        return "";
      }

      const { data } =
        supabase.storage
          .from("resumes")
          .getPublicUrl(
            fileName
          );

      return data.publicUrl;
    };

  const applyToJob =
    async () => {
      if (!name || !email) {
        alert(
          "Name and email required"
        );

        return;
      }

      let resumeLink = "";

      if (resumeFile) {
        resumeLink =
          await uploadResume();

        if (!resumeLink)
          return;
      }

      const res =
        await fetch(
          "/api/applications",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              {
                name,
                email,
                resumeLink,
                coverLetter,
                jobId: id,
              }
            ),
          }
        );

      if (res.ok) {
        setSuccess(
          "Application submitted successfully!"
        );

        setName("");
        setEmail("");
        setResumeFile(
          null
        );
        setCoverLetter("");
      } else {
        alert(
          "Failed to apply"
        );
      }
    };

  if (!job) {
    return (
      <div
        style={{
          padding:
            "40px",
        }}
      >
        Loading...
      </div>
    );
  }

  const isOwner =
    user?.email ===
    job.userEmail;

  return (
    <div
      style={{
        background:
          "#f3f2f1",

        minHeight:
          "100vh",

        padding:
          "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth:
            "950px",

          margin:
            "0 auto",
        }}
      >
        <Link href="/">
          <button
            style={{
              marginBottom:
                "20px",

              padding:
                "10px 16px",

              background:
                "#e5e7eb",

              border:
                "none",

              borderRadius:
                "6px",

              cursor:
                "pointer",

              fontWeight:
                "bold",
            }}
          >
            ← Back to Jobs
          </button>
        </Link>

        {/* JOB DETAILS */}

        <div
          style={{
            background:
              "white",

            padding:
              "35px",

            borderRadius:
              "12px",

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
                "36px",
            }}
          >
            {job.title}
          </h1>

          <h2
            style={{
              marginBottom:
                "10px",

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

              gap: "12px",

              flexWrap:
                "wrap",

              marginBottom:
                "20px",
            }}
          >
            <div
              style={{
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
                  "14px",
              }}
            >
              📍{" "}
              {
                job.location
              }
            </div>

            {job.jobType && (
              <div
                style={{
                  background:
                    "#dcfce7",

                  color:
                    "#166534",

                  padding:
                    "8px 14px",

                  borderRadius:
                    "999px",

                  fontWeight:
                    "bold",

                  fontSize:
                    "14px",
                }}
              >
                💼{" "}
                {
                  job.jobType
                }
              </div>
            )}
          </div>

          <hr
            style={{
              margin:
                "30px 0",
            }}
          />

          {/* DESCRIPTION */}

          <h3
            style={{
              marginBottom:
                "20px",

              fontSize:
                "28px",
            }}
          >
            Job Description
          </h3>

          <div
            className="job-description"
            dangerouslySetInnerHTML={{
              __html:
                job.description ||
                "No description provided.",
            }}
          />

          {/* SCREENING QUESTIONS */}

          {job.screeningQuestions && (
            <>
              <hr
                style={{
                  margin:
                    "35px 0",
                }}
              />

              <h3
                style={{
                  marginBottom:
                    "15px",

                  fontSize:
                    "26px",
                }}
              >
                Screening Questions
              </h3>

              <div
                style={{
                  background:
                    "#f9fafb",

                  padding:
                    "20px",

                  borderRadius:
                    "10px",

                  border:
                    "1px solid #e5e7eb",

                  whiteSpace:
                    "pre-line",

                  lineHeight:
                    "1.8",
                }}
              >
                {
                  job.screeningQuestions
                }
              </div>
            </>
          )}
        </div>

        {/* EMPLOYER NOTICE */}

        {isOwner && (
          <div
            style={{
              background:
                "#fef3c7",

              border:
                "1px solid #fcd34d",

              padding:
                "20px",

              borderRadius:
                "10px",

              marginBottom:
                "25px",

              color:
                "#92400e",

              fontWeight:
                "bold",
            }}
          >
            You are the employer who posted this job.
            Applications are disabled for your own job posting.
          </div>
        )}

        {/* APPLY SECTION */}

        {!isOwner && (
          <div
            style={{
              background:
                "white",

              padding:
                "35px",

              borderRadius:
                "12px",

              border:
                "1px solid #ddd",
            }}
          >
            <h2
              style={{
                marginBottom:
                  "25px",

                fontSize:
                  "30px",
              }}
            >
              Apply Now
            </h2>

            {success && (
              <p
                style={{
                  color:
                    "green",

                  fontWeight:
                    "bold",

                  marginBottom:
                    "20px",
                }}
              >
                {success}
              </p>
            )}

            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              style={{
                width:
                  "100%",

                padding:
                  "14px",

                marginBottom:
                  "14px",

                borderRadius:
                  "8px",

                border:
                  "1px solid #ccc",
              }}
            />

            <input
              placeholder="Your Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              style={{
                width:
                  "100%",

                padding:
                  "14px",

                marginBottom:
                  "14px",

                borderRadius:
                  "8px",

                border:
                  "1px solid #ccc",
              }}
            />

            <div
              style={{
                marginBottom:
                  "14px",
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
                onChange={(
                  e: any
                ) =>
                  setResumeFile(
                    e.target
                      .files[0]
                  )
                }
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

                padding:
                  "14px",

                minHeight:
                  "160px",

                marginBottom:
                  "18px",

                borderRadius:
                  "8px",

                border:
                  "1px solid #ccc",
              }}
            />

            <button
              onClick={
                applyToJob
              }
              style={{
                padding:
                  "16px 28px",

                background:
                  "#1c4ed8",

                color:
                  "white",

                border:
                  "none",

                borderRadius:
                  "8px",

                cursor:
                  "pointer",

                fontWeight:
                  "bold",

                fontSize:
                  "16px",
              }}
            >
              Submit
              Application
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .job-description {
          line-height: 1.9;
          font-size: 16px;
          color: #111827;
        }

        .job-description h1 {
          font-size: 34px;
          font-weight: bold;
          margin: 24px 0 12px;
        }

        .job-description h2 {
          font-size: 28px;
          font-weight: bold;
          margin: 24px 0 12px;
        }

        .job-description h3 {
          font-size: 24px;
          font-weight: bold;
          margin: 24px 0 12px;
        }

        .job-description p {
          margin-bottom: 14px;
        }

        .job-description ul {
          padding-left: 30px;
          margin-bottom: 18px;
          list-style-type: disc;
        }

        .job-description ol {
          padding-left: 30px;
          margin-bottom: 18px;
          list-style-type: decimal;
        }

        .job-description li {
          margin-bottom: 10px;
        }

        .job-description strong {
          font-weight: bold;
        }

        .job-description li[data-list="bullet"] {
          list-style-type: disc;
        }

        .job-description li[data-list="ordered"] {
          list-style-type: decimal;
        }
      `}</style>
    </div>
  );
}