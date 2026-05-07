import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// CREATE application
export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { data, error } =
      await supabase
        .from("applications")
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
      console.error(error);

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

    const { data, error } =
      await supabase
        .from("applications")
        .select("*")
        .eq("jobId", jobId)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      console.error(error);

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