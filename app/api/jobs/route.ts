import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// GET jobs
export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const userEmail =
      searchParams.get(
        "userEmail"
      );

    let query =
      supabase
        .from("jobs")
        .select("*");

    // Employer-specific filtering
    if (userEmail) {
      query = query.eq(
        "userEmail",
        userEmail
      );
    }

    const { data, error } =
      await query.order(
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
        .eq(
          "id",
          Number(body.id)
        )
        .select();

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

    const {
      data,
      error,
    } = await supabase
      .from("jobs")
      .delete()
      .eq(
        "id",
        Number(body.id)
      )
      .select();

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

    // Verify actual deletion

    if (
      !data ||
      data.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No matching job found to delete",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message:
        "Job deleted",

      deletedJob:
        data[0],
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