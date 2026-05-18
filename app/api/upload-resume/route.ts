import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  req: Request
) {
  try {
    const data =
      await req.formData();

    const file =
      data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "No file uploaded",
        },
        { status: 400 }
      );
    }

    // Convert file

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // Unique filename

    const fileName =
      `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage

    const { error } =
      await supabase.storage
        .from("resumes")
        .upload(
          fileName,
          buffer,
          {
            contentType:
              file.type,
          }
        );

    if (error) {
      console.error(
        "SUPABASE STORAGE ERROR:",
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

    // Generate public URL

    const {
      data: publicUrlData,
    } =
      supabase.storage
        .from("resumes")
        .getPublicUrl(
          fileName
        );

    return NextResponse.json({
      fileUrl:
        publicUrlData.publicUrl,
    });
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Upload failed",
      },
      { status: 500 }
    );
  }
}