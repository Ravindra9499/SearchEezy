import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase =
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

export async function PUT(
  req: Request
) {
  try {
    const body =
      await req.json();

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "applications"
        )
        .update({
          status:
            body.status,
        })
        .eq(
          "id",
          body.id
        )
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

    return NextResponse.json(
      data
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to update application status",
      },
      { status: 500 }
    );
  }
}