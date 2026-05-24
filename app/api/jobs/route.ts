import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(
  process.env.RESEND_API_KEY
);

// GET jobs

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userEmail =
      searchParams.get("userEmail");

    console.log(
      "GET JOBS userEmail:",
      userEmail
    );

    let query = supabase
      .from("jobs")
      .select("*");

    // Employer-specific filtering

    if (
      userEmail &&
      userEmail !== "undefined"
    ) {
      query = query.eq(
        "userEmail",
        userEmail
      );
    }

    const { data, error } =
      await query.order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(
        "GET JOBS ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    console.log(
      "RETURNING JOBS:",
      data?.map((job) => ({
        id: job.id,
        title: job.title,
        userEmail:
          job.userEmail,
      }))
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "GET failed",
      },
      { status: 500 }
    );
  }
}

// POST new job

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    console.log(
      "POST JOB BODY:",
      body
    );

    const { data, error } =
      await supabase
        .from("jobs")
        .insert([
          {
            title: body.title,

            company:
              body.company,

            location:
              body.location,

            description:
              body.description,

            jobType:
              body.jobType,

            category:
              body.category,

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

            companyLogo:
              body.companyLogo,

            verified:
              body.verified,

            companyDescription:
              body.companyDescription,

            companyWebsite:
              body.companyWebsite,

            featured:
              body.featured,

            userEmail:
              body.userEmail,
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(
        "POST ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    // JOB ALERT EMAIL MATCHING

    try {
      console.log(
        "CHECKING JOB ALERTS..."
      );

      const {
        data: alerts,
        error: alertsError,
      } =
        await supabase
          .from(
            "job_alerts"
          )
          .select("*");

      console.log(
        "JOB ALERTS:",
        alerts
      );

      if (alertsError) {
        console.error(
          "ALERT FETCH ERROR:",
          alertsError
        );
      }

      if (
        alerts &&
        alerts.length > 0
      ) {
        const matchingAlerts =
          alerts.filter(
            (alert) => {
              const keyword =
                alert.keyword
                  ?.toLowerCase()
                  ?.trim();

              const title =
                body.title
                  ?.toLowerCase()
                  ?.trim() || "";

              const category =
                body.category
                  ?.toLowerCase()
                  ?.trim() || "";

              console.log(
                "MATCH CHECK:",
                {
                  keyword,
                  title,
                  category,
                }
              );

              return (
                title.includes(
                  keyword
                ) ||
                category.includes(
                  keyword
                )
              );
            }
          );

        console.log(
          "MATCHING ALERTS:",
          matchingAlerts
        );

        // SEND EMAILS

        for (const alert of matchingAlerts) {
          try {
            const emailResponse =
              await resend.emails.send(
                {
                  from:
                    "SearchEezy <notifications@searcheezy.com>",

                  to: alert.userEmail,

                  subject: `New ${body.title} Job Posted`,

                  html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">

                      <h2 style="color: #1d4ed8;">
                        New Matching Job Alert
                      </h2>

                      <p>
                        A new job matching your alert has been posted on SearchEezy.
                      </p>

                      <hr />

                      <p>
                        <strong>Job Title:</strong>
                        ${body.title}
                      </p>

                      <p>
                        <strong>Company:</strong>
                        ${body.company}
                      </p>

                      <p>
                        <strong>Location:</strong>
                        ${body.location}
                      </p>

                      <p>
                        <strong>Category:</strong>
                        ${body.category || "N/A"}
                      </p>

                      <div style="margin-top:20px;">
                        <a
                          href="https://www.searcheezy.com/jobs/${data.id}"
                          target="_blank"
                          style="
                            background-color:#1d4ed8;
                            color:white;
                            padding:12px 20px;
                            text-decoration:none;
                            border-radius:6px;
                            display:inline-block;
                            font-weight:bold;
                          "
                        >
                          View Job
                        </a>
                      </div>

                    </div>
                  `,
                }
              );

            console.log(
              "ALERT EMAIL SENT:",
              alert.userEmail
            );

            console.log(
              "EMAIL RESPONSE:",
              emailResponse
            );
          } catch (
            emailError
          ) {
            console.error(
              "EMAIL ERROR:",
              emailError
            );
          }
        }
      } else {
        console.log(
          "NO JOB ALERTS FOUND"
        );
      }
    } catch (
      alertError
    ) {
      console.error(
        "ALERT MATCH ERROR:",
        alertError
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "POST failed",
      },
      { status: 500 }
    );
  }
}

// UPDATE job

export async function PUT(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { data, error } =
      await supabase
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

          category:
            body.category,

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

          companyLogo:
            body.companyLogo,

          verified:
            body.verified,

          companyDescription:
            body.companyDescription,

          companyWebsite:
            body.companyWebsite,

          featured:
            body.featured,
        })
        .eq(
          "id",
          Number(body.id)
        )
        .select();

    if (error) {
      console.error(
        "UPDATE ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "PUT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "UPDATE failed",
      },
      { status: 500 }
    );
  }
}

// DELETE job

export async function DELETE(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { data, error } =
      await supabase
        .from("jobs")
        .delete()
        .eq(
          "id",
          Number(body.id)
        )
        .select();

    if (error) {
      console.error(
        "DELETE ERROR:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    if (
      !data ||
      data.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No matching job found to delete",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Job deleted",

      deletedJob: data[0],
    });
  } catch (error) {
    console.error(
      "DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "DELETE failed",
      },
      { status: 500 }
    );
  }
}