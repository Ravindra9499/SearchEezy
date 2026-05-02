"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import dynamic from "next/dynamic";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

export default function EditJobPage() {
  const params = useParams();

  const id = params.id;

  const [title, setTitle] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    const res = await fetch(
      "/api/jobs"
    );

    const data = await res.json();

    const job = data.find(
      (j: any) =>
        j.id.toString() === id
    );

    if (job) {
      setTitle(job.title || "");

      setCompany(
        job.company || ""
      );

      setLocation(
        job.location || ""
      );

      setDescription(
        job.description || ""
      );
    }
  };

  const updateJob = async () => {
    const res = await fetch(
      "/api/jobs",
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          id,

          title,

          company,

          location,

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
        maxWidth: "900px",

        margin: "40px auto",

        background: "white",

        padding: "30px",

        borderRadius: "10px",

        border:
          "1px solid #ddd",
      }}
    >
      <h1
        style={{
          color: "#1c4ed8",
        }}
      >
        Edit Job
      </h1>

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

          padding: "12px",

          marginBottom: "15px",
        }}
      />

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

          padding: "12px",

          marginBottom: "15px",
        }}
      />

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

          padding: "12px",

          marginBottom: "15px",
        }}
      />

      <div
        style={{
          marginBottom: "60px",
        }}
      >
        <ReactQuill
          theme="snow"
          value={description}
          onChange={
            setDescription
          }
          style={{
            height: "300px",
          }}
        />
      </div>

      <button
        onClick={updateJob}
        style={{
          width: "100%",

          padding: "14px",

          background: "#1c4ed8",

          color: "white",

          border: "none",

          borderRadius: "8px",

          fontWeight: "bold",

          fontSize: "16px",

          cursor: "pointer",
        }}
      >
        Update Job
      </button>
    </div>
  );
}