"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserAndJobs();
  }, []);

  const getUserAndJobs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUser(user);

    const res = await fetch("/api/jobs");
    const data = await res.json();

    const myJobs = data.filter(
      (job: any) => job.userEmail === user.email
    );

    setJobs(myJobs);
    setLoading(false);
  };

  const deleteJob = async (id: string) => {
    const confirmDelete = confirm("Delete this job?");

    if (!confirmDelete) return;

    await fetch("/api/jobs", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setJobs(jobs.filter((job) => job.id !== id));
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
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              color: "#1c4ed8",
            }}
          >
            My Jobs
          </h1>

          <a href="/">
            <button
              style={{
                background: "#1c4ed8",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back to Home
            </button>
          </a>
        </div>

        <p style={{ marginBottom: "20px" }}>
          Logged in as: {user?.email}
        </p>

        {jobs.length === 0 ? (
          <p>You have not posted any jobs yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                border: "1px solid #ddd",
              }}
            >
              <h2
                style={{
                  color: "#1c4ed8",
                  marginBottom: "5px",
                }}
              >
                {job.title}
              </h2>

              <p>
                <strong>{job.company}</strong>
              </p>

              <p>📍 {job.location}</p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <a href={`/edit-job/${job.id}`}>
                  <button
                    style={{
                      background: "#1c4ed8",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit Job
                  </button>
                </a>

                <button
                  onClick={() => deleteJob(job.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}