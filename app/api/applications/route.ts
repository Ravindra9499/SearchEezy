import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { Resend } from "resend";

const supabase =
  createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

const resend =
  new Resend(
    process.env
      .RESEND_API_KEY
  );


async function verifyEmployerAccess(
  jobId: number,
  employerEmail: string
) {
  const {
    data: job,
    error,
  } = await supabase
    .from("jobs")
    .select("id, userEmail")
    .eq("id", jobId)
    .single();

  if (
    error ||
    !job
  ) {
    return {
      authorized: false,
      message:
        "Job not found",
    };
  }

  if (
    job.userEmail !==
    employerEmail
  ) {
    return {
      authorized: false,
      message:
        "Unauthorized employer access",
    };
  }

  return {
    authorized: true,
  };
}


// CREATE application

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    if (
      !body.name ||
      !body.email ||
      !body.jobId ||
      !body.resumeLink
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required application fields",
        },
        { status: 400 }
      );
    }

    // Fetch job details FIRST

    const {
      data: job,
      error: jobError,
    } =
      await supabase
        .from("jobs")
        .select("*")
        .eq(
          "id",
          body.jobId
        )
        .single();

    if (
      jobError ||
      !job
    ) {
      console.error(
        "Job fetch failed:",
        jobError
      );

      return NextResponse.json(
        {
          error:
            "Job not found",
        },
        { status: 404 }
      );
    }

    // Save application

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "applications"
        )
        .insert([
          {
            name:
              body.name,

            email:
              body.email,

            resumeLink:
              body.resumeLink,

            coverLetter:
              body.coverLetter,

            screeningAnswers:
              body.screeningAnswers,

            jobId:
              body.jobId,

            jobTitle:
              job.title,

            company:
              job.company,

            employerEmail:
              job.userEmail,

            status:
              "Applied",
          },
        ])
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

    // CREATE OR UPDATE SEARCHABLE CANDIDATE PROFILE

    try {
      // CHECK IF CANDIDATE EXISTS

      const {
        data:
          existingCandidate,
      } =
        await supabase
          .from(
            "candidate_profiles"
          )
          .select("*")
          .eq(
            "useremail",
            body.email
          )
          .maybeSingle();

      // UPDATE EXISTING PROFILE

      if (
        existingCandidate
      ) {
        const {
          error:
            updateError,
        } =
          await supabase
            .from(
              "candidate_profiles"
            )
            .update({
              fullname:
                body.name,

              title:
                body.currentTitle ||
                existingCandidate.title,

              skills:
                body.skills ||
                existingCandidate.skills,

              experience:
                body.experience ||
                existingCandidate.experience,

              location:
                body.location ||
                existingCandidate.location,

              zipcode:
                body.zipCode ||
                existingCandidate.zipcode,

              resumeurl:
                body.resumeLink ||
                existingCandidate.resumeurl,

              summary:
                body.coverLetter ||
                existingCandidate.summary,

              education:
                body.education ||
                existingCandidate.education,

              remote:
                body.remote,
            })
            .eq(
              "useremail",
              body.email
            );

        if (
          updateError
        ) {
          console.error(
            "Candidate profile update failed:"
          );

          console.error(
            JSON.stringify(
              updateError,
              null,
              2
            )
          );
        } else {
          console.log(
            "Candidate profile updated successfully"
          );
        }
      }

      // INSERT NEW PROFILE

      else {
        const {
          error:
            insertError,
        } =
          await supabase
            .from(
              "candidate_profiles"
            )
            .insert([
              {
                useremail:
                  body.email,

                fullname:
                  body.name,

                title:
                  body.currentTitle ||
                  "Candidate",

                skills:
                  body.skills ||
                  "",

                experience:
                  body.experience ||
                  "",

                location:
                  body.location ||
                  "",

                zipcode:
                  body.zipCode ||
                  "",

                resumeurl:
                  body.resumeLink,

                summary:
                  body.coverLetter ||
                  "",

                education:
                  body.education ||
                  "",

                remote:
                  body.remote ||
                  false,
              },
            ]);

        if (
          insertError
        ) {
          console.error(
            "Candidate profile insert failed:"
          );

          console.error(
            JSON.stringify(
              insertError,
              null,
              2
            )
          );
        } else {
          console.log(
            "Candidate profile inserted successfully"
          );
        }
      }
    } catch (
      candidateError
    ) {
      console.error(
        "Candidate profile processing exception:"
      );

      console.error(
        JSON.stringify(
          candidateError,
          null,
          2
        )
      );
    }

    // Send employer email notification

    try {
      await resend.emails.send(
        {
          from:
            "SearchEezy <notifications@searcheezy.com>",

          to: job.userEmail,

          subject: `New Applicant for ${job.title}`,

          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              
              <h2 style="color: #1c4ed8;">
                New Application Received
              </h2>

              <p>
                You received a new applicant on SearchEezy.
              </p>

              <hr />

              <p>
                <strong>Job:</strong>
                ${job.title}
              </p>

              <p>
                <strong>Company:</strong>
                ${job.company}
              </p>

              <p>
                <strong>Applicant Name:</strong>
                ${body.name}
              </p>

              <p>
                <strong>Applicant Email:</strong>
                ${body.email}
              </p>

              <hr />

              <div style="margin-top:20px;">
                <a
                  href="https://www.searcheezy.com/my-jobs"
                  target="_blank"
                  style="
                    background-color:#1c4ed8;
                    color:white;
                    padding:12px 20px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                    font-weight:bold;
                  "
                >
                  Open My Jobs
                </a>
              </div>

            </div>
          `,
        }
      );
    } catch (
      emailError
    ) {
      console.error(
        "EMAIL SEND FAILED:"
      );

      console.error(
        emailError
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
          "Application failed",
      },
      { status: 500 }
    );
  }
}

// GET applications

export async function GET(
  req: Request
) {
  try {
    const { searchParams } =
      new URL(req.url);

    const jobId =
      searchParams.get(
        "jobId"
      );

    const email =
      searchParams.get(
        "email"
      );

    let query =
      supabase
        .from(
          "applications"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

    const employerEmail =
      searchParams.get(
        "employerEmail"
      );

    // Employer view

    if (jobId) {

      if (
        !employerEmail
      ) {
        return NextResponse.json(
          {
            error:
              "Employer authorization required",
          },
          { status: 403 }
        );
      }

      const ownership =
        await verifyEmployerAccess(
          Number(jobId),
          employerEmail
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

      query = query.eq(
        "jobId",
        jobId
      );
    }

    // Applicant view

    if (email) {

      if (
        typeof email !==
        "string"
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid applicant email",
          },
          { status: 403 }
        );
      }

      query = query.eq(
        "email",
        email
      );
    }

    const {
      data,
      error,
    } = await query;

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
          "Failed to fetch applications",
      },
      { status: 500 }
    );
  }
}