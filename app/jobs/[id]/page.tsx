import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.jobs.findUnique({
    where: {
      id: BigInt(id),
    },
  });

  if (!job) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Job not found</h2>

        <Link href="/">
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "#1c4ed8",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ⬅ Back to Jobs
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
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

      <h1 style={{ color: "#1c4ed8" }}>{job.title}</h1>

      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        {job.company}
      </p>

      <p style={{ color: "gray" }}>📍 {job.location}</p>

      <hr style={{ margin: "20px 0" }} />

      <h3>Job Description</h3>

      <p>
        {job.description || "No description provided."}
      </p>

      <button
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "#1c4ed8",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Apply Now
      </button>
    </div>
  );
}