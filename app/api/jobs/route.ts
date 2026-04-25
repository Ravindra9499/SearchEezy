import { PrismaClient } from "@/app/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ✅ GET all jobs
export async function GET() {
  try {
    const jobs = await prisma.jobs.findMany();

    // 🔥 Fix BigInt issue
    const safeJobs = jobs.map((job) => ({
      ...job,
      id: job.id.toString(),
    }));

    return NextResponse.json(safeJobs);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "GET failed" }, { status: 500 });
  }
}

// ✅ POST new job
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const job = await prisma.jobs.create({
      data: {
        title: body.title,
        company: body.company,
        location: body.location,
        description: body.description,
      },
    });

    return NextResponse.json({
      ...job,
      id: job.id.toString(),
    });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: "POST failed" }, { status: 500 });
  }
}