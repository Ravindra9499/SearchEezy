"use client";

import { useState, useEffect } from "react";

import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css";

import { supabase } from "../lib/supabase";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

export default function PostJobPage() {
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");

  const [company, setCompany] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [jobType, setJobType] =
    useState("");

  const [
    screeningQuestions,
    setScreeningQuestions,
  ] = useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href =
        "/login";

      return;
    }

    setUser(user);
  };

  const handleSubmit = async (
    e: any
  ) => {
    e.preventDefault();

    if (
      !title ||
      !company ||
      !location ||
      !description ||
      !jobType
    ) {
      alert("Please fill all required fields");

      return;
    }

    setLoading(true);

    const res = await fetch(
      "/api/jobs",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          title,
          company,
          location,
          description,
          jobType,
          screeningQuestions,
          userEmail: user.email,
        }),
      }
    );

    setLoading(false);

    if (res.ok) {
      alert("Job posted successfully");

      window.location.href =
        "/my-jobs";
    } else {
      alert("Failed to post job");
    }
  };

  return (
    <div
      style={{
        background: "#f3f2f1",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "950px",
          margin: "0 auto",

          background: "white",

          padding: "35px",

          borderRadius: "14px",

          border:
            "1px solid #ddd",
        }}
      >
        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              color: "#1c4ed8",
              margin: 0,
            }}
          >
            Post a Job
          </h1>

          <a href="/">
            <button
              style={{
                background:
                  "#eee",

                border: "none",

                padding:
                  "10px 15px",

                borderRadius:
                  "6px",

                cursor:
                  "pointer",
              }}
            >
              ← Back
            </button>
          </a>
        </div>

        <p
          style={{
            marginBottom: "30px",
            color: "gray",
          }}
        >
          Logged in as:
          {" "}
          {user?.email}
        </p>

        <form
          onSubmit={
            handleSubmit
          }
        >
          {/* JOB TITLE */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                fontWeight:
                  "bold",

                display: "block",

                marginBottom:
                  "8px",
              }}
            >
              Job Title
            </label>

            <input
              placeholder="e.g. Senior React Developer"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                padding:
                  "14px",

                border:
                  "1px solid #ccc",

                borderRadius:
                  "8px",

                fontSize:
                  "16px",
              }}
            />
          </div>

          {/* COMPANY */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                fontWeight:
                  "bold",

                display: "block",

                marginBottom:
                  "8px",
              }}
            >
              Company Name
            </label>

            <input
              placeholder="e.g. Google"
              value={company}
              onChange={(e) =>
                setCompany(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                padding:
                  "14px",

                border:
                  "1px solid #ccc",

                borderRadius:
                  "8px",

                fontSize:
                  "16px",
              }}
            />
          </div>

          {/* LOCATION */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                fontWeight:
                  "bold",

                display: "block",

                marginBottom:
                  "8px",
              }}
            >
              Location
            </label>

            <input
              placeholder="e.g. Hyderabad, India"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                padding:
                  "14px",

                border:
                  "1px solid #ccc",

                borderRadius:
                  "8px",

                fontSize:
                  "16px",
              }}
            />
          </div>

          {/* JOB TYPE */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                fontWeight:
                  "bold",

                display: "block",

                marginBottom:
                  "8px",
              }}
            >
              Job Type
            </label>

            <select
              value={jobType}
              onChange={(e) =>
                setJobType(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                padding:
                  "14px",

                border:
                  "1px solid #ccc",

                borderRadius:
                  "8px",

                fontSize:
                  "16px",
              }}
            >
              <option value="">
                Select Job Type
              </option>

              <option value="Full-time">
                Full-time
              </option>

              <option value="Part-time">
                Part-time
              </option>

              <option value="Contract">
                Contract
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Remote">
                Remote
              </option>

              <option value="Hybrid">
                Hybrid
              </option>
            </select>
          </div>

          {/* SCREENING QUESTIONS */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                fontWeight:
                  "bold",

                display: "block",

                marginBottom:
                  "8px",
              }}
            >
              Screening Questions
            </label>

            <textarea
              placeholder={`Example:
How many years of React experience do you have?
Do you have Node.js experience?
Are you willing to relocate?`}
              value={
                screeningQuestions
              }
              onChange={(e) =>
                setScreeningQuestions(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                minHeight:
                  "140px",

                padding:
                  "14px",

                border:
                  "1px solid #ccc",

                borderRadius:
                  "8px",

                fontSize:
                  "15px",
              }}
            />
          </div>

          {/* DESCRIPTION */}

          <div
            style={{
              marginBottom:
                "70px",
            }}
          >
            <label
              style={{
                fontWeight:
                  "bold",

                display: "block",

                marginBottom:
                  "10px",
              }}
            >
              Job Description
            </label>

            <ReactQuill
              theme="snow"
              value={
                description
              }
              onChange={
                setDescription
              }
              placeholder="Write detailed job description..."
              style={{
                height:
                  "350px",
              }}
            />
          </div>

          <button
            disabled={loading}
            style={{
              width: "100%",

              padding: "16px",

              background:
                "#1c4ed8",

              color: "white",

              border: "none",

              borderRadius:
                "8px",

              fontWeight:
                "bold",

              fontSize:
                "16px",

              cursor:
                "pointer",
            }}
          >
            {loading
              ? "Posting..."
              : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}