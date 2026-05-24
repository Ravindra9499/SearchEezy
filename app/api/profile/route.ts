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

    const email =
      searchParams.get(
        "email"
      );

    // FETCH BY EMAIL

    if (email) {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
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
    }

    // FETCH BY ID

    if (userId) {
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
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
    }

    return NextResponse.json(
      {
        error:
          "Missing parameters",
      },
      { status: 400 }
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