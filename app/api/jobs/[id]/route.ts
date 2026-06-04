import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

// ✅ Environment variables

const supabaseUrl =
  process.env.SUPABASE_URL;

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

// ✅ Safety check

if (
  !supabaseUrl ||
  !supabaseKey
) {
  console.error(
    "ENV ERROR:",
    {
      url: supabaseUrl,
      key: supabaseKey,
    }
  );

  throw new Error(
    "Missing Supabase environment variables"
  );
}

// ✅ Supabase client

const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );

// ✅ Ownership verification

async function verifyJobOwnership(
  jobId: number,
  userEmail: string
) {
  const {
    data: existingJob,
    error,
  } = await supabase
    .from("jobs")
    .select("id, userEmail")
    .eq("id", jobId)
    .single();

  if (
    error ||
    !existingJob
  ) {
    return {
      authorized: false,
      message:
        "Job not found",
    };
  }

  if (
    existingJob.userEmail
      ?.trim()
      ?.toLowerCase() !==
    userEmail
      ?.trim()
      ?.toLowerCase()
  ) {
    return {
      authorized: false,
      message:
        "Unauthorized job access",
    };
  }

  return {
    authorized: true,
  };
}

// ✅ GET single job

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const {
      data,
      error,
    } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "SUPABASE ERROR:",
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
  } catch (err) {
    console.error(
      "SERVER ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch job",
      },
      { status: 500 }
    );
  }
}

// ✅ PUT update job

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const body =
      await req.json();

    if (
      !body.userEmail
    ) {
      return NextResponse.json(
        {
          error:
            "Missing employer email",
        },
        { status: 403 }
      );
    }

    const ownership =
      await verifyJobOwnership(
        Number(id),
        body.userEmail
      );

    if (
      !ownership.authorized
    ) {
      return NextResponse.json(
        {
          error:
            ownership.message,
        },
        { status: 403 }
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("jobs")
      .update({
        title: body.title,

        company:
          body.company,

        location:
          body.location,

        description:
          body.description,

        jobType:
          body.jobType,

        salaryMin:
          body.salaryMin
            ? Number(
                body.salaryMin
              )
            : null,

        salaryMax:
          body.salaryMax
            ? Number(
                body.salaryMax
              )
            : null,

        salaryType:
          body.salaryType,

        currency:
          body.currency,

        screeningQuestions:
          body.screeningQuestions,
      })
      .eq(
        "id",
        Number(id)
      )
      .select()
      .single();

    if (error) {
      console.error(
        "PUT ERROR:",
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

    return NextResponse.json({
      message:
        "Job updated successfully",

      updatedJob: data,
    });
  } catch (err) {
    console.error(
      "PUT SERVER ERROR:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to update job",
      },
      { status: 500 }
    );
  }
}
