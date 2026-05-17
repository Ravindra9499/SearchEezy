import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { Resend } from "resend";

const supabase =
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

const resend =
  new Resend(
    process.env
      .RESEND_API_KEY
  );

// CREATE application

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    // Save application

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "applications"
        )
        .insert([
          {
            name:
              body.name,

            email:
              body.email,

            resumeLink:
              body.resumeLink,

            coverLetter:
              body.coverLetter,

            screeningAnswers:
              body.screeningAnswers,

            jobId:
              body.jobId,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(
        error
      );

      return NextResponse.json(
        {
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    // Fetch job details

    const {
      data: job,
      error: jobError,
    } =
      await supabase
        .from("jobs")
        .select("*")
        .eq(
          "id",
          body.jobId
        )
        .single();

    if (
      jobError ||
      !job
    ) {
      console.error(
        "Job fetch failed:",
        jobError
      );

      return NextResponse.json(
        data
      );
    }

    // Send employer email notification

    try {
      await resend.emails.send(
        {
          from:
            "SearchEezy <onboarding@resend.dev>",

          to: job.userEmail,

          subject: `New Applicant for ${job.title}`,

          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              
              <h2 style="color: #1c4ed8;">
                New Application Received
              </h2>

              <p>
                You received a new applicant on SearchEezy.
              </p>

              <hr />

              <p>
                <strong>Job:</strong>
                ${job.title}
              </p>

              <p>
                <strong>Company:</strong>
                ${job.company}
              </p>

              <p>
                <strong>Applicant Name:</strong>
                ${body.name}
              </p>

              <p>
                <strong>Applicant Email:</strong>
                ${body.email}
              </p>

              <hr />

              <p>
                Login to review the application and resume.
              </p>

              <a
                href="http://localhost:3000/my-jobs"
                style="
                  display: inline-block;
                  padding: 12px 18px;
                  background: #1c4ed8;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  margin-top: 10px;
                "
              >
                Open My Jobs
              </a>

            </div>
          `,
        }
      );

      console.log(
        "Employer notification sent"
      );
    } catch (
      emailError
    ) {
      console.error(
        "Email send failed:",
        emailError
      );
    }

    return NextResponse.json(
      data
    );
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

// GET applications

export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const jobId =
      searchParams.get(
        "jobId"
      );

    const email =
      searchParams.get(
        "email"
      );

    let query =
      supabase
        .from(
          "applications"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

    // Employer view

    if (jobId) {
      query = query.eq(
        "jobId",
        jobId
      );
    }

    // Applicant view

    if (email) {
      query = query.eq(
        "email",
        email
      );
    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      console.error(
        error
      );

      return NextResponse.json(
        {
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      data
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