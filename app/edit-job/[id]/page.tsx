"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();

    const job = data.find(
      (j: any) => j.id === params.id
    );

    if (!job) {
      alert("Job not found");
      return;
    }

    setTitle(job.title || "");
    setCompany(job.company || "");
    setLocation(job.location || "");
    setDescription(job.description || "");

    setLoading(false);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    await fetch("/api/jobs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: params.id,
        title,
        company,
        location,
        description,
      }),
    });

    alert("Job updated successfully");

    router.push("/my-jobs");
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  return (
    <div
      style={{
        background: "#f3f2f1",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h1
          style={{
            color: "#1c4ed8",
            marginBottom: "20px",
          }}
        >
          Edit Job
        </h1>

        <form onSubmit={handleUpdate}>
          <input
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              minHeight: "200px",
            }}
          />

          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "#1c4ed8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
}