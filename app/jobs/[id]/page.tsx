"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function JobDetails() {
  const params = useParams();

  const id = params.id;

  const [job, setJob] = useState<any>(null);

  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [resumeFile, setResumeFile] =
    useState<any>(null);

  const [coverLetter, setCoverLetter] =
    useState("");

  const [
    screeningAnswers,
    setScreeningAnswers,
  ] = useState<any>({});

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    fetchJob();
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const fetchJob = async () => {
    const res = await fetch("/api/jobs");

    const data = await res.json();

    const foundJob = data.find(
      (j: any) =>
        String(j.id) === String(id)
    );

    setJob(foundJob);
  };

  const uploadResume = async () => {
    if (!resumeFile) return "";

    const fileName = `${Date.now()}-${resumeFile.name}`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(fileName, resumeFile);

    if (error) {
      alert("Resume upload failed");

      return "";
    }

    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const applyToJob = async () => {
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

      if (!resumeLink) return;
    }

    const res = await fetch(
      "/api/applications",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          resumeLink,
          coverLetter,
          screeningAnswers:
            JSON.stringify(
              screeningAnswers
            ),
          jobId: id,
        }),
      }
    );

    if (res.ok) {
      setSuccess(
        "Application submitted successfully!"
      );

      setName("");
      setEmail("");
      setResumeFile(null);
      setCoverLetter("");
      setScreeningAnswers({});
    } else {
      alert("Failed to apply");
    }
  };

  if (!job) {
    return (
      <div
        style={{
          padding: "40px",
        }}
      >
        Loading...
      </div>
    );
  }

  const isOwner =
    user?.email ===
    job.userEmail;

  const questions =
    job.screeningQuestions
      ? job.screeningQuestions
          .split("\n")
          .filter(
            (q: string) =>
              q.trim() !== ""
          )
      : [];

  return (
    <div
      style={{
        background: "#f3f2f1",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
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

              border: "none",

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

        <div
          style={{
            background: "white",

            padding: "30px",

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
              color: "#1c4ed8",

              marginBottom:
                "10px",
            }}
          >
            {job.title}
          </h1>

          <h2
            style={{
              marginBottom:
                "10px",
            }}
          >
            {job.company}
          </h2>

          <p
            style={{
              color: "gray",

              marginBottom:
                "20px",

              fontSize:
                "16px",
            }}
          >
            📍 {job.location}
          </p>

          {job.jobType && (
            <div
              style={{
                display:
                  "inline-block",

                background:
                  "#dbeafe",

                color:
                  "#1e40af",

                padding:
                  "6px 12px",

                borderRadius:
                  "20px",

                fontWeight:
                  "bold",

                marginBottom:
                  "20px",
              }}
            >
              {job.jobType}
            </div>
          )}

          <hr
            style={{
              margin:
                "25px 0",
            }}
          />

          <h3
            style={{
              marginBottom:
                "20px",

              fontSize:
                "24px",
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
        </div>

        {!isOwner && (
          <div
            style={{
              background:
                "white",

              padding: "30px",

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

            {success && (
              <p
                style={{
                  color:
                    "green",

                  fontWeight:
                    "bold",

                  marginBottom:
                    "15px",
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
                  "12px",

                marginBottom:
                  "12px",

                borderRadius:
                  "6px",

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
                  "12px",

                marginBottom:
                  "12px",

                borderRadius:
                  "6px",

                border:
                  "1px solid #ccc",
              }}
            />

            {questions.length > 0 && (
              <div
                style={{
                  marginBottom:
                    "20px",
                }}
              >
                <h3>
                  Screening Questions
                </h3>

                {questions.map(
                  (
                    question: string,
                    index: number
                  ) => (
                    <div
                      key={index}
                      style={{
                        marginBottom:
                          "15px",
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
                        {
                          question
                        }
                      </label>

                      <textarea
                        placeholder="Your answer"
                        value={
                          screeningAnswers[
                            question
                          ] || ""
                        }
                        onChange={(
                          e
                        ) =>
                          setScreeningAnswers(
                            {
                              ...screeningAnswers,

                              [question]:
                                e
                                  .target
                                  .value,
                            }
                          )
                        }
                        style={{
                          width:
                            "100%",

                          padding:
                            "12px",

                          minHeight:
                            "100px",

                          borderRadius:
                            "6px",

                          border:
                            "1px solid #ccc",
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            )}

            <div
              style={{
                marginBottom:
                  "12px",
              }}
            >
              <input
                type="file"
                onChange={(e: any) =>
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
                  "12px",

                minHeight:
                  "140px",

                marginBottom:
                  "15px",

                borderRadius:
                  "6px",

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
                  "14px 24px",

                background:
                  "#1c4ed8",

                color:
                  "white",

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
              Submit
              Application
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .job-description {
          line-height: 1.8;
          font-size: 16px;
          color: #111827;
        }

        .job-description h1 {
          font-size: 32px;
          font-weight: bold;
          margin: 20px 0 10px;
        }

        .job-description h2 {
          font-size: 26px;
          font-weight: bold;
          margin: 20px 0 10px;
        }

        .job-description h3 {
          font-size: 22px;
          font-weight: bold;
          margin: 20px 0 10px;
        }

        .job-description p {
          margin-bottom: 14px;
        }

        .job-description ul {
          padding-left: 30px;
          margin-bottom: 16px;
          list-style-type: disc;
        }

        .job-description ol {
          padding-left: 30px;
          margin-bottom: 16px;
          list-style-type: decimal;
        }

        .job-description li {
          margin-bottom: 10px;
        }

        .job-description strong {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}