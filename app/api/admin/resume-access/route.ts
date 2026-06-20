import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const {
      id,
      resumeSearchEnabled,
    } = await req.json();

    const { error } =
      await supabase
        .from("profiles")
        .update({
          resumeSearchEnabled,
        })
        .eq("id", id);

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to update resume access",
      },
      { status: 500 }
    );
  }
}