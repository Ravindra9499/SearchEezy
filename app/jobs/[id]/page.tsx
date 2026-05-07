"use client";

import "./page.css";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobDetailsPage() {
  const params = useParams();

  const jobId = params.id;

  const [job, setJob] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [coverLetter, setCoverLetter] =
    useState("");

  const [resumeFile, setResumeFile] =
    useState<File | null>(null);

  const [screeningAnswers, setScreeningAnswers] =
    useState<{ [key: string]: string }>({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await fetch(
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

  const handleAnswerChange = (
    question: string,
    value: string
  ) => {
    setScreeningAnswers((prev) => ({
      ...prev,
      [question]: value,
    }));
  };

  const handleSubmit = async (
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
              method: "POST",
              body: formData,
            }
          );

        const uploadData =
          await uploadRes.json();

        resumeLink =
          uploadData.fileUrl;
      }

      // Submit Application
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
            coverLetter,
            resumeLink,

            screeningAnswers:
              JSON.stringify(
                screeningAnswers
              ),

            jobId,
          }),
        }
      );

      if (res.ok) {
        alert(
          "Application submitted successfully!"
        );

        setName("");
        setEmail("");
        setCoverLetter("");
        setResumeFile(null);

        setScreeningAnswers({});
      } else {
        alert(
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
          padding: "20px",
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
          padding: "20px",
        }}
      >
        Job not found
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f3f2f1",

        minHeight: "100vh",

        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",

          margin: "0 auto",
        }}
      >
        {/* Job Details */}
        <div
          style={{
            background: "white",

            padding: "30px",

            borderRadius: "12px",

            border:
              "1px solid #ddd",

            marginBottom: "25px",
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

          <h3
            style={{
              marginBottom:
                "10px",
            }}
          >
            {job.company}
          </h3>

          <p
            style={{
              marginBottom:
                "20px",
            }}
          >
            📍 {job.location}
          </p>

          <div
            className="job-description"
            style={{
              lineHeight: "1.8",

              fontSize: "16px",
            }}
            dangerouslySetInnerHTML={{
              __html:
                job.description,
            }}
          />
        </div>

        {/* Application Form */}
        <div
          style={{
            background: "white",

            padding: "30px",

            borderRadius: "12px",

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
                width: "100%",

                padding: "12px",

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
                width: "100%",

                padding: "12px",

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
                  (q: string) =>
                    q.trim() !==
                    ""
                )
                .map(
                  (
                    question: string,
                    index: number
                  ) => (
                    <div
                      key={index}
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
                          ] || ""
                        }
                        onChange={(
                          e
                        ) =>
                          handleAnswerChange(
                            question,
                            e.target
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
                  display: "block",

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
                  width: "100%",

                  padding: "10px",

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
              value={coverLetter}
              onChange={(e) =>
                setCoverLetter(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                minHeight:
                  "140px",

                padding: "12px",

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

                color: "white",

                border: "none",

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
      </div>
    </div>
  );
}