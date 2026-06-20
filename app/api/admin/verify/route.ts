import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id, status } =
      await req.json();

    const updates: any = {
      verificationStatus: status,
      verificationRequested: false,
    };

    if (status === "verified") {
      updates.isverified = true;
      updates.verifiedAt =
        new Date().toISOString();
    }

    if (status === "rejected") {
      updates.isverified = false;
    }

    const { error } =
      await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}