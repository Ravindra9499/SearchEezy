import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


// CREATE application
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const application =
      await prisma.applications.create({
        data: {
          name: body.name,

          email: body.email,

          resumeLink:
            body.resumeLink,

          coverLetter:
            body.coverLetter,

          screeningAnswers:
            body.screeningAnswers,

          jobId: BigInt(
            body.jobId
          ),
        },
      });

    return NextResponse.json({
      ...application,

      id:
        application.id.toString(),

      jobId:
        application.jobId.toString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Application failed",
      },
      { status: 500 }
    );
  }
}


// GET applications by job
export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const jobId =
      searchParams.get("jobId");

    const applications =
      await prisma.applications.findMany(
        {
          where: {
            jobId: BigInt(
              jobId!
            ),
          },

          orderBy: {
            created_at:
              "desc",
          },
        }
      );

    const safeApplications =
      applications.map(
        (app: any) => ({
          ...app,

          id:
            app.id.toString(),

          jobId:
            app.jobId.toString(),
        })
      );

    return NextResponse.json(
      safeApplications
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch applications",
      },
      { status: 500 }
    );
  }
}