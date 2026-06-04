"use client";

import {
  useEffect,
  useState,
} from "react";

import { useParams } from "next/navigation";

import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

export default function EditJobPage() {
  const params =
    useParams();

  const id = params.id;

  const [title, setTitle] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [jobType, setJobType] =
    useState("");

  const [
    salaryMin,
    setSalaryMin,
  ] = useState("");

  const [
    salaryMax,
    setSalaryMax,
  ] = useState("");

  const [
    salaryType,
    setSalaryType,
  ] = useState("");

  const [currency, setCurrency] =
    useState("USD");

  const [
    screeningQuestions,
    setScreeningQuestions,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  // IMPORTANT FIX
  const [
    userEmail,
    setUserEmail,
  ] = useState("");

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob =
    async () => {
      const res =
        await fetch(
          "/api/jobs"
        );

      const data =
        await res.json();

      const job =
        data.find(
          (j: any) =>
            j.id.toString() ===
            id
        );

      if (job) {
        setTitle(
          job.title || ""
        );

        setCompany(
          job.company || ""
        );

        setLocation(
          job.location || ""
        );

        setJobType(
          job.jobType || ""
        );

        setSalaryMin(
          job.salaryMin?.toString() ||
            ""
        );

        setSalaryMax(
          job.salaryMax?.toString() ||
            ""
        );

        setSalaryType(
          job.salaryType || ""
        );

        setCurrency(
          job.currency ||
            "USD"
        );

        setScreeningQuestions(
          job.screeningQuestions ||
            ""
        );

        setDescription(
          job.description ||
            ""
        );

        // IMPORTANT FIX
        setUserEmail(
          job.userEmail || ""
        );
      }
    };

  const updateJob =
    async () => {
      const res =
        await fetch(
          `/api/jobs/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              id,

              // IMPORTANT FIX
              userEmail,

              title,

              company,

              location,

              jobType,

              salaryMin,

              salaryMax,

              salaryType,

              currency,

              screeningQuestions,

              description,
            }),
          }
        );

      if (res.ok) {
        alert(
          "Job updated successfully"
        );

        window.location.href =
          "/my-jobs";
      } else {
        alert(
          "Failed to update job"
        );
      }
    };

  return (
    <div
      style={{
        maxWidth:
          "950px",

        margin:
          "40px auto",

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
      <h1
        style={{
          color:
            "#1c4ed8",

          marginBottom:
            "25px",
        }}
      >
        Edit Job
      </h1>

      {/* TITLE */}

      <input
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
        placeholder="Job Title"
        style={{
          width: "100%",

          padding: "14px",

          marginBottom:
            "15px",

          border:
            "1px solid #ccc",

          borderRadius:
            "8px",
        }}
      />

      {/* COMPANY */}

      <input
        value={company}
        onChange={(e) =>
          setCompany(
            e.target.value
          )
        }
        placeholder="Company"
        style={{
          width: "100%",

          padding: "14px",

          marginBottom:
            "15px",

          border:
            "1px solid #ccc",

          borderRadius:
            "8px",
        }}
      />

      {/* LOCATION */}

      <input
        value={location}
        onChange={(e) =>
          setLocation(
            e.target.value
          )
        }
        placeholder="Location"
        style={{
          width: "100%",

          padding: "14px",

          marginBottom:
            "15px",

          border:
            "1px solid #ccc",

          borderRadius:
            "8px",
        }}
      />

      {/* JOB TYPE */}

      <select
        value={jobType}
        onChange={(e) =>
          setJobType(
            e.target.value
          )
        }
        style={{
          width: "100%",

          padding: "14px",

          marginBottom:
            "15px",

          border:
            "1px solid #ccc",

          borderRadius:
            "8px",
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

      {/* SALARY */}

      <div
        style={{
          display: "flex",

          gap: "10px",

          flexWrap: "wrap",

          marginBottom:
            "20px",
        }}
      >
        {/* Currency */}

        <select
          value={currency}
          onChange={(e) =>
            setCurrency(
              e.target.value
            )
          }
          style={{
            flex: 1,

            padding: "14px",

            border:
              "1px solid #ccc",

            borderRadius:
              "8px",
          }}
        >
          <option value="USD">
            USD ($)
          </option>

          <option value="INR">
            INR (₹)
          </option>

          <option value="EUR">
            EUR (€)
          </option>

          <option value="GBP">
            GBP (£)
          </option>
        </select>

        {/* Min */}

        <input
          type="number"
          placeholder="Minimum Salary"
          value={salaryMin}
          onChange={(e) =>
            setSalaryMin(
              e.target.value
            )
          }
          style={{
            flex: 1,

            padding: "14px",

            border:
              "1px solid #ccc",

            borderRadius:
              "8px",
          }}
        />

        {/* Max */}

        <input
          type="number"
          placeholder="Maximum Salary"
          value={salaryMax}
          onChange={(e) =>
            setSalaryMax(
              e.target.value
            )
          }
          style={{
            flex: 1,

            padding: "14px",

            border:
              "1px solid #ccc",

            borderRadius:
              "8px",
          }}
        />

        {/* Salary Type */}

        <select
          value={salaryType}
          onChange={(e) =>
            setSalaryType(
              e.target.value
            )
          }
          style={{
            flex: 1,

            padding: "14px",

            border:
              "1px solid #ccc",

            borderRadius:
              "8px",
          }}
        >
          <option value="">
            Salary Type
          </option>

          <option value="yearly">
            Yearly
          </option>

          <option value="hourly">
            Hourly
          </option>
        </select>
      </div>

      {/* SCREENING QUESTIONS */}

      <textarea
        value={
          screeningQuestions
        }
        onChange={(e) =>
          setScreeningQuestions(
            e.target.value
          )
        }
        placeholder="Screening Questions"
        style={{
          width: "100%",

          minHeight:
            "140px",

          padding: "14px",

          marginBottom:
            "20px",

          border:
            "1px solid #ccc",

          borderRadius:
            "8px",
        }}
      />

      {/* DESCRIPTION */}

      <div
        style={{
          marginBottom:
            "70px",
        }}
      >
        <ReactQuill
          theme="snow"
          value={description}
          onChange={
            setDescription
          }
          style={{
            height: "320px",
          }}
        />
      </div>

      <button
        onClick={updateJob}
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

          fontSize: "16px",

          cursor: "pointer",
        }}
      >
        Update Job
      </button>
    </div>
  );
}