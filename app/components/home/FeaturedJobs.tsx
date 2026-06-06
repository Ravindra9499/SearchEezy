import JobCard from "./JobCard";

type Props = {
  featuredJobs: any[];
  role: string;
  savedJobs: number[];
  toggleSaveJob: (
    jobId: number,
    e: any
  ) => Promise<void>;
  getCurrencySymbol: (
    currency: string
  ) => string;
};

export default function FeaturedJobs({
  featuredJobs,
  role,
  savedJobs,
  toggleSaveJob,
  getCurrencySymbol,
}: Props) {
  return (
    <>
      {/* CATEGORY SECTION */}

      <div
        style={{
          marginBottom:
            "40px",
        }}
      >
        <h2
          style={{
            fontSize:
              "32px",
            fontWeight:
              "bold",
            marginBottom:
              "24px",
            color:
              "#111827",
          }}
        >
          Browse Jobs By Category
        </h2>

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              title:
                "Healthcare Jobs",
              link:
                "/categories/healthcare",
              icon:
                "🏥",
            },

            {
              title:
                "Software Engineering",
              link:
                "/categories/software-engineering",
              icon:
                "💻",
            },

            {
              title:
                "Remote Jobs",
              link:
                "/categories/remote",
              icon:
                "🌎",
            },

            {
              title:
                "Construction Jobs",
              link:
                "/categories/construction",
              icon:
                "🏗️",
            },

            {
              title:
                "Manufacturing Jobs",
              link:
                "/categories/manufacturing",
              icon:
                "🏭",
            },
          ].map(
            (
              category
            ) => (
              <a
                key={
                  category.title
                }
                href={
                  category.link
                }
                style={{
                  textDecoration:
                    "none",
                }}
              >
                <div
                  style={{
                    background:
                      "white",
                    borderRadius:
                      "20px",
                    padding:
                      "24px",
                    boxShadow:
                      "0 4px 18px rgba(0,0,0,0.05)",
                    textAlign:
                      "center",
                    border:
                      "1px solid #eef2ff",
                    height:
                      "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "42px",
                      marginBottom:
                        "12px",
                    }}
                  >
                    {
                      category.icon
                    }
                  </div>

                  <h3
                    style={{
                      color:
                        "#111827",
                      fontSize:
                        "20px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    {
                      category.title
                    }
                  </h3>

                  <p
                    style={{
                      color:
                        "#6b7280",
                      fontSize:
                        "14px",
                      lineHeight:
                        "1.6",
                    }}
                  >
                    Explore{" "}
                    {
                      category.title
                    }{" "}
                    on
                    SearchEezy
                  </p>
                </div>
              </a>
            )
          )}
        </div>
      </div>

      {featuredJobs.length >
        0 && (
        <div
          style={{
            marginBottom:
              "40px",
          }}
        >
          <h2
            style={{
              color:
                "#f59e0b",
              marginBottom:
                "20px",
            }}
          >
            ⭐ Featured Jobs
          </h2>

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
            }}
          >
            {featuredJobs.map(
              (
                job
              ) => (
                <JobCard
                  key={
                    job.id
                  }
                  job={job}
                  role={
                    role
                  }
                  savedJobs={
                    savedJobs
                  }
                  toggleSaveJob={
                    toggleSaveJob
                  }
                  getCurrencySymbol={
                    getCurrencySymbol
                  }
                  featured
                />
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}