import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET all jobs
export async function GET() {
  try {
    const { data, error } =
      await supabase
        .from("jobs")
        .select("*")
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
    console.error(
      "GET ERROR:",
      error
    );

    return NextResponse.json(
      { error: "GET failed" },
      { status: 500 }
    );
  }
}

// POST new job
export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { data, error } =
      await supabase
        .from("jobs")
        .insert([
          {
            title:
              body.title,

            company:
              body.company,

            location:
              body.location,

            description:
              body.description,

            jobType:
              body.jobType,

            screeningQuestions:
              body.screeningQuestions,

            userEmail:
              body.userEmail,
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
    console.error(
      "POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "POST failed",
      },
      { status: 500 }
    );
  }
}

// UPDATE job
export async function PUT(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { data, error } =
      await supabase
        .from("jobs")
        .update({
          title:
            body.title,

          company:
            body.company,

          location:
            body.location,

          description:
            body.description,

          jobType:
            body.jobType,

          screeningQuestions:
            body.screeningQuestions,
        })
        .eq("id", body.id)
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
    console.error(
      "PUT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "UPDATE failed",
      },
      { status: 500 }
    );
  }
}

// DELETE job
export async function DELETE(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { error } =
      await supabase
        .from("jobs")
        .delete()
        .eq("id", body.id);

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

    return NextResponse.json({
      message:
        "Job deleted",
    });
  } catch (error) {
    console.error(
      "DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "DELETE failed",
      },
      { status: 500 }
    );
  }
}