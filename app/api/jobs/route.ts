import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ✅ GET all jobs
export async function GET() {
  try {
    const jobs = await prisma.jobs.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    const safeJobs = jobs.map((job: any) => ({
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

// ✅ DELETE job
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.jobs.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "DELETE failed" }, { status: 500 });
  }
}