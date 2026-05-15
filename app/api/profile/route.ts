import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase =
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const userId =
      searchParams.get(
        "userId"
      );

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Missing userId",
        },
        { status: 400 }
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
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
          "Failed to fetch profile",
      },
      { status: 500 }
    );
  }
}