"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function JobDetails() {
  const params = useParams();

  const id = params.id;

  const [job, setJob] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] =
    useState("");

  const [resumeFile, setResumeFile] =
    useState<File | null>(null);

  const [success, setSuccess] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    const res = await fetch("/api/jobs");

    const data = await res.json();

    const foundJob = data.find(
      (j: any) => j.id === id
    );

    setJob(foundJob);
  };

  const uploadResume = async () => {
    if (!resumeFile) return "";

    const fileName =
      `${Date.now()}-${resumeFile.name}`;

    const { error } =
      await supabase.storage
        .from("resumes")
        .upload(fileName, resumeFile);

    if (error) {
      alert("Resume upload failed");

      return "";
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("resumes")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const applyToJob = async () => {
    if (!name || !email) {
      alert(
        "Name and email required"
      );

      return;
    }

    setUploading(true);

    const resumeLink =
      await uploadResume();

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
          jobId: id,
        }),
      }
    );

    setUploading(false);

    if (res.ok) {
      setSuccess(
        "Application submitted successfully!"
      );

      setName("");
      setEmail("");
      setCoverLetter("");
      setResumeFile(null);
    } else {
      alert("Failed to apply");
    }
  };

  if (!job) {
    return (
      <div style={{ padding: "40px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <Link href="/">
        <button
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            background: "#eee",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Jobs
        </button>
      </Link>

      <h1
        style={{
          color: "#1c4ed8",
        }}
      >
        {job.title}
      </h1>

      <p
        style={{
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {job.company}
      </p>

      <p style={{ color: "gray" }}>
        📍 {job.location}
      </p>

      <hr
        style={{
          margin: "20px 0",
        }}
      />

      <h3>Job Description</h3>

      <p>
        {job.description ||
          "No description provided."}
      </p>

      <hr
        style={{
          margin: "30px 0",
        }}
      />

      <h2>Apply Now</h2>

      {success && (
        <p
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          {success}
        </p>
      )}

      <input
        placeholder="Your Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        placeholder="Your Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) =>
          setResumeFile(
            e.target.files?.[0] ||
              null
          )
        }
        style={{
          marginBottom: "15px",
        }}
      />

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
          padding: "10px",
          marginBottom: "10px",
          minHeight: "120px",
        }}
      />

      <button
        onClick={applyToJob}
        disabled={uploading}
        style={{
          padding: "12px 20px",
          background: "#1c4ed8",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {uploading
          ? "Uploading..."
          : "Submit Application"}
      </button>
    </div>
  );
}