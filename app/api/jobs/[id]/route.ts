import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Read environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// ✅ Safety check
if (!supabaseUrl || !supabaseKey) {
  console.error("ENV ERROR:", {
    url: supabaseUrl,
    key: supabaseKey,
  });

  throw new Error("Missing Supabase environment variables");
}

// ✅ Create client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Next.js 16 fix
    const { id } = await params;

    // ✅ Fetch job from Supabase
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();

    // ❗ Show exact error in terminal
    if (error) {
      console.error("SUPABASE ERROR:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // ✅ Success
    return NextResponse.json(data);

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}