import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase =
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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

    // FETCH PROFILE BY EMAIL

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
        console.error(
          "PROFILE API ERROR:",
          error
        );

        return NextResponse.json(
          {
            error:
              error.message,
            details:
              error,
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        data
      );
    }

    // FETCH PROFILE BY USER ID

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
        console.error(
          "PROFILE API ERROR:",
          error
        );

        return NextResponse.json(
          {
            error:
              error.message,
            details:
              error,
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
    console.error(
      "PROFILE ROUTE CRASH:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch profile",
      },
      { status: 500 }
    );
  }
}
